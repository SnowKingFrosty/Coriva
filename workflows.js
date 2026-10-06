'use strict';
// All cross-account writes happen here, with the authenticated actor checked server-side.
exports.createWorkflow = ({ db, auth, stamp, error }) => {
  const fail = (code, message) => { throw error(code, message); };
  const id = value => {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) fail('invalid-argument', 'Invalid document ID.');
    return value;
  };
  const text = (value, min, max) => {
    if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) fail('invalid-argument', `Enter between ${min} and ${max} characters.`);
    return value.trim();
  };
  const notify = (tx, uid, eventId, jobId, title, body) => tx.set(db.doc(`notifications/${uid}/items/${eventId}`), { jobId, title, body, read: false, createdAt: stamp() });
  return async (uid, input) => {
    if (!uid) fail('unauthenticated', 'Sign in to continue.');
    const action = input?.action;
    if (action === 'request') {
      const storeId = id(input.storeId), requestId = id(input.requestId);
      const description = text(input.description, 20, 2000);
      const user = await auth.getUser(uid);
      const profile = await db.doc(`profiles/${uid}`).get();
      const customerName = (profile.data()?.username || user.displayName || 'Customer').slice(0,100);
      const jobId = `${uid}_${requestId}`;
      const jobRef = db.doc(`jobs/${jobId}`);
      await db.runTransaction(async tx => {
        const [existing, store, quota] = await Promise.all([
          tx.get(jobRef), tx.get(db.doc(`stores/${storeId}`)), tx.get(db.doc(`jobRequestLimits/${uid}`))
        ]);
        if (existing.exists) {
          if (existing.data().customerUid !== uid) fail('permission-denied', 'Request is not yours.');
          return;
        }
        if (!store.exists) fail('not-found', 'Storefront no longer exists.');
        const sellerUid = store.data().ownerUid;
        if (sellerUid === uid) fail('failed-precondition', 'You cannot request work from your own storefront.');
        const day = new Date().toISOString().slice(0,10);
        const count = quota.data()?.day === day ? quota.data().count : 0;
        if (count >= 10) fail('resource-exhausted', 'You have reached today’s limit of 10 estimate requests.');
        tx.set(db.doc(`jobRequestLimits/${uid}`), { day, count: count + 1 });
        tx.create(jobRef, { storeId, storeName: store.data().name || 'Storefront', sellerUid, customerUid: uid, customerName, customerEmail: user.email || '', participants: [uid,sellerUid], description, status: 'pending', createdAt: stamp(), updatedAt: stamp() });
        notify(tx,sellerUid,`${jobId}_request`,jobId,'New estimate request',`${customerName} requested an estimate from ${store.data().name}.`);
        notify(tx,uid,`${jobId}_sent`,jobId,'Estimate request sent','The seller will accept or decline your request.');
      });
      return { jobId };
    }
    const jobId = id(input.jobId), jobRef = db.doc(`jobs/${jobId}`);
    const jobSnapshot = await jobRef.get();
    if (!jobSnapshot.exists) fail('not-found', 'Job not found.');
    const job = jobSnapshot.data();
    if (!job.participants.includes(uid)) fail('permission-denied', 'This job is private.');
    const seller = uid === job.sellerUid;
    if (action === 'respond') {
      if (!seller || !['accepted','rejected'].includes(input.status)) fail('permission-denied', 'Only the seller can accept or reject a request.');
      await db.runTransaction(async tx => {
        const current = await tx.get(jobRef);
        if (current.data().status === input.status) return;
        if (current.data().status !== 'pending') fail('failed-precondition', 'This request has already been answered.');
        tx.update(jobRef,{status:input.status,updatedAt:stamp()});
        notify(tx,job.customerUid,`${jobId}_decision`,jobId,input.status === 'accepted' ? 'Request accepted' : 'Request declined', input.status === 'accepted' ? `${job.storeName} accepted your job. Your private conversation is open.` : `${job.storeName} declined your request.`);
      });
      return { jobId };
    }
    if (job.status !== 'accepted') fail('failed-precondition','The seller must accept this request first.');
    if (action === 'message') {
      const body = text(input.text,1,2000), messageId = `${uid}_${id(input.messageId)}`;
      await db.runTransaction(async tx => {
        const ref = db.doc(`jobs/${jobId}/messages/${messageId}`);
        if ((await tx.get(ref)).exists) return;
        tx.create(ref,{text:body,senderUid:uid,createdAt:stamp()});
        tx.update(jobRef,{updatedAt:stamp()});
        notify(tx,seller ? job.customerUid : job.sellerUid,`${jobId}_message_${messageId}`,jobId,'New job message',`${seller ? job.storeName : job.customerName} sent a message.`);
      });
      return { jobId };
    }
    if (!['share','document','reportPayment','confirmPayment'].includes(action)) fail('invalid-argument','Unknown action.');
    const kind = input.kind;
    if (!['quotes','invoices'].includes(kind)) fail('invalid-argument','Invalid document type.');
    const documentId = id(input.documentId);
    const sourceRef = db.doc(`stores/${job.storeId}/${kind}/${documentId}`);
    const sharedRef = db.doc(`jobs/${jobId}/documents/${kind}_${documentId}`);
    if (action === 'share') {
      if (!seller) fail('permission-denied','Only the seller can share a document.');
      await db.runTransaction(async tx => {
        const [source,existing,store] = await Promise.all([tx.get(sourceRef),tx.get(sharedRef),tx.get(db.doc(`stores/${job.storeId}`))]);
        if (!source.exists || source.data().status === 'void') fail('failed-precondition','This document is deleted or voided.');
        if (source.data().ownerUid !== uid || store.data()?.ownerUid !== uid) fail('permission-denied','This is not your document.');
        if (source.data().jobId !== jobId) fail('failed-precondition','Create this document from this job conversation before sharing.');
        if (existing.exists) return;
        tx.create(sharedRef,{kind,documentId,sourcePath:sourceRef.path,number:source.data().invoiceNumber || source.data().quoteNumber,availability:'active',paymentStatus:'unpaid',createdAt:stamp()});
        notify(tx,job.customerUid,`${jobId}_${kind}_${documentId}_shared`,jobId,kind === 'quotes' ? 'New price quote' : 'New invoice',`${job.storeName} shared ${source.data().invoiceNumber || source.data().quoteNumber}.`);
      });
      return { jobId };
    }
    if (action === 'document') {
      const [source,shared,store] = await Promise.all([sourceRef.get(),sharedRef.get(),db.doc(`stores/${job.storeId}`).get()]);
      if (!shared.exists || !source.exists || source.data().status === 'void') fail('failed-precondition','This document is no longer available.');
      // Only the requested job's shared document can be returned to its two participants.
      const data = source.data();
      if (data.jobId !== jobId) fail('permission-denied','Document does not belong to this job.');
      const safe = {};
      for (const key of ['invoiceNumber','quoteNumber','customerName','customerEmail','dueDate','validUntil','notes','items','taxRate','currency','consumerCurrency','exchange','workflowPricingType','workflowHourlyRate','workflowHours','workflowFlatFee','workflowDescription','paymentMethods','status']) if (data[key] !== undefined) safe[key] = data[key];
      return { document: {...safe,id:documentId,storeId:job.storeId},storeName:store.data()?.name || job.storeName };
    }
    if (kind !== 'invoices') fail('invalid-argument','Only invoices can be marked paid.');
    if ((action === 'reportPayment' && seller) || (action === 'confirmPayment' && !seller)) fail('permission-denied','You cannot perform this payment action.');
    await db.runTransaction(async tx => {
      const [source,shared] = await Promise.all([tx.get(sourceRef),tx.get(sharedRef)]);
      if (!shared.exists || !source.exists || source.data().status === 'void' || source.data().jobId !== jobId) fail('failed-precondition','Invoice is unavailable.');
      const state = shared.data().paymentStatus;
      const next = action === 'reportPayment' ? 'reported' : 'confirmed';
      if (state === next || state === 'confirmed') return;
      if (next === 'confirmed' && state !== 'reported') fail('failed-precondition','Wait for the customer’s payment report.');
      tx.update(sharedRef,{paymentStatus:next,updatedAt:stamp()});
      notify(tx,seller ? job.customerUid : job.sellerUid,`${jobId}_${documentId}_${next}`,jobId,next === 'reported' ? 'Customer reported payment' : 'Payment confirmed by seller',next === 'reported' ? `${job.customerName} reported paying ${shared.data().number}. Verify receipt before confirming.` : `${job.storeName} confirmed payment for ${shared.data().number}.`);
    });
    return { jobId };
  };
};
