'use strict';
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { createWorkflow } = require('./workflows');
initializeApp();
const db = getFirestore();
const workflow = createWorkflow({db,auth:getAuth(),stamp:()=>FieldValue.serverTimestamp(),error:(code,message)=>new HttpsError(code,message)});
exports.corivaWorkflow = onCall({region:'us-central1',timeoutSeconds:60,maxInstances:10}, request => workflow(request.auth?.uid,request.data));

// Shared cards follow the original document's availability; PDFs always read the latest source.
const syncAvailability = async (event, kind) => {
  const before = event.data.before.data();
  // Re-read the source so out-of-order events cannot restore an old availability state.
  const after = (await event.data.after.ref.get()).data();
  const jobId = after?.jobId || before?.jobId;
  if (!jobId) return;
  const documentId = event.params.documentId;
  const shared = db.doc(`jobs/${jobId}/documents/${kind}_${documentId}`);
  if (!(await shared.get()).exists) return;
  const availability = !after ? 'deleted' : after.status === 'void' ? 'void' : 'active';
  await shared.update({availability,number:after?.invoiceNumber || after?.quoteNumber || before?.invoiceNumber || before?.quoteNumber,updatedAt:FieldValue.serverTimestamp()});
  if (availability === 'active' && before) {
    const job = (await db.doc(`jobs/${jobId}`).get()).data();
    if (job) await db.doc(`notifications/${job.customerUid}/items/document_${event.id.replace(/[^a-zA-Z0-9_-]/g,'_')}`).set({jobId,title:'Document updated',body:`${job.storeName} updated a shared ${kind === 'quotes' ? 'quote' : 'invoice'}. Open it to review the latest details.`,read:false,createdAt:FieldValue.serverTimestamp()});
  }
};
exports.syncSharedInvoice = onDocumentWritten({document:'stores/{storeId}/invoices/{documentId}',region:'us-central1'},event=>syncAvailability(event,'invoices'));
exports.syncSharedQuote = onDocumentWritten({document:'stores/{storeId}/quotes/{documentId}',region:'us-central1'},event=>syncAvailability(event,'quotes'));
