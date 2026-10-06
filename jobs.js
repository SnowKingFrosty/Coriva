import { auth, db, functions, httpsCallable, collection, query, where, onSnapshot, doc, updateDoc, onAuthStateChanged, limit, orderBy } from './firebase.js';
const call = httpsCallable(functions, 'corivaWorkflow');
const $ = id => document.getElementById(id);
const node = (tag, className = '', text = '') => { const el=document.createElement(tag); el.className=className; el.textContent=text; return el; };
const uid = () => auth.currentUser?.uid;
const timestamp = value => value?.toMillis?.() || 0;
const time = value => value?.toDate?.().toLocaleString() || 'Just now';
const requestId = () => crypto.randomUUID();
let sharedDocuments=[], api, currentJob, jobItems=[], stopJobs, stopNotifications, stops=[], session=0;
let pendingRequestId=requestId(), currentStore;
const notice = (message,error=false) => { $('jobsStatus').textContent=message; $('jobsStatus').classList.toggle('error',error); };
const errorText = error => /not-found|internal|unavailable/.test(error.code || '')
  ? 'Unable to complete this action. Check your connection and that the Coriva backend functions and Firestore rules have been deployed.' : error.message;
async function perform(button, payload, done) {
  if (button.disabled) return;
  button.disabled=true; notice('');
  try { const response=await call(payload); await done?.(response.data); }
  catch(error){
    const message=errorText(error);notice(message,true);
    const formStatus=button.closest('form')?.querySelector('.account-status');
    if(formStatus){formStatus.textContent=message;formStatus.classList.add('error');}
  }
  finally{button.disabled=false;}
}
function button(label, action, className='secondary-btn') { const el=node('button',className,label);el.type='button';el.addEventListener('click',()=>action(el));return el; }
function closeJob(){sharedDocuments=[];stops.forEach(stop=>stop());stops=[];currentJob=null;$('jobDetail').classList.add('hidden');$('jobMessages').replaceChildren();$('jobDocuments').replaceChildren();}
function showPage() {
  if(!uid()){api.requireAuth();return;}
  document.querySelector('.page-shell').classList.add('hidden');
  document.querySelectorAll('.modal-overlay, .storefront-page, .room-page').forEach(el=>{el.classList.add('hidden');el.setAttribute('aria-hidden','true');});
  $('notificationsPage').classList.remove('hidden');$('notificationsPage').setAttribute('aria-hidden','false');
  window.scrollTo(0,0);
}
function route(){
  if(!location.hash.startsWith('#notifications'))return;
  showPage();
  const id=location.hash.split('/')[1];
  if(id && /^[A-Za-z0-9_-]{1,128}$/.test(id) && uid() && currentJob?.id!==id) openJob(id);
}
function goJob(id){if(location.hash===`#notifications/${id}`){showPage();openJob(id);}else location.hash=`notifications/${id}`;}
function renderJobs(){
  const list=$('jobsList');list.replaceChildren();
  if(!jobItems.length)list.append(node('p','empty-state','No estimate requests yet. Requests you send or receive will appear here.'));
  for(const job of jobItems){
    const card=node('article','job-card');
    card.append(node('strong','',job.storeName),node('span','document-status',job.status),node('p','',job.sellerUid===uid()?`From ${job.customerName}`:'Your request'),node('p','job-excerpt',job.description));
    card.append(button('View request',()=>goJob(job.id)));list.append(card);
  }
}
function renderDetail(job){
  currentJob=job;$('jobDetail').classList.remove('hidden');$('jobTitle').textContent=job.storeName;
  $('jobSummary').textContent=`${job.customerName} · ${job.status}`;$('jobDescription').textContent=job.description;
  const actions=$('jobActions');actions.replaceChildren();const seller=job.sellerUid===uid();
  if(job.status==='pending' && seller){
    actions.append(button('Accept',btn=>perform(btn,{action:'respond',jobId:job.id,status:'accepted'},()=>notice('Job accepted. Your private conversation is open.')),'primary-btn'));
    actions.append(button('Reject',btn=>{if(confirm('Decline this estimate request?'))perform(btn,{action:'respond',jobId:job.id,status:'rejected'});}));
  }
  if(job.status==='accepted' && seller){
    actions.append(button('Create quote',()=>api.compose('quotes',job),'primary-btn'),button('Create invoice',()=>api.compose('invoices',job)));
  }
  $('jobConversation').classList.toggle('hidden',job.status!=='accepted');
  $('jobMessageForm').querySelector('button').disabled=job.status!=='accepted';
  renderDocuments(sharedDocuments);
}
function openJob(id){
  closeJob();const token=session;
  stops.push(onSnapshot(doc(db,'jobs',id),snapshot=>{
    if(token!==session)return;
    if(!snapshot.exists()){notice('This job is unavailable.',true);return;}
    renderDetail({id:snapshot.id,...snapshot.data()});
  },error=>notice(error.message,true)));
  stops.push(onSnapshot(query(collection(db,'jobs',id,'messages'),orderBy('createdAt','desc'),limit(100)),snapshot=>{
    const thread=$('jobMessages');thread.replaceChildren();
    const messages=snapshot.docs.map(item=>({id:item.id,...item.data()})).reverse();
    if(!messages.length)thread.append(node('p','helper-text','Discuss the scope here, then share a quote.'));
    messages.forEach(message=>{const bubble=node('article',`chat-message${message.senderUid===uid()?' mine':''}`);bubble.append(node('strong','',message.senderUid===uid()?'You':'Other participant'),node('p','',message.text),node('time','',time(message.createdAt)));thread.append(bubble);});
    thread.scrollTop=thread.scrollHeight;
  },error=>notice(error.message,true)));
  stops.push(onSnapshot(collection(db,'jobs',id,'documents'),snapshot=>{sharedDocuments=snapshot.docs.map(item=>({id:item.id,...item.data()}));renderDocuments(sharedDocuments);},error=>notice(error.message,true)));
}
function renderDocuments(documents){
  const list=$('jobDocuments');list.replaceChildren();
  if(!documents.length)list.append(node('p','helper-text','Shared quotes and invoices will appear here.'));
  for(const record of documents.sort((a,b)=>timestamp(b.createdAt)-timestamp(a.createdAt))){
    const card=node('article','job-card');card.append(node('strong','',`${record.kind==='quotes'?'Quote':'Invoice'} ${record.number}`));
    const active=record.availability==='active';
    card.append(node('span','document-status',!active?record.availability:record.kind==='invoices'?({unpaid:'Awaiting payment',reported:'Payment reported — awaiting seller confirmation',confirmed:'Payment confirmed by seller'}[record.paymentStatus] || 'Awaiting payment'):'Available'));
    if(active){
      const payload={jobId:currentJob?.id || location.hash.split('/')[1],kind:record.kind,documentId:record.documentId};
      card.append(button('View / download PDF',btn=>perform(btn,{...payload,action:'document'},async data=>{
        await api.download(record.kind,data.document,data.storeName,$('jobsStatus'));
      })));
      if(currentJob && record.kind==='invoices'){
        if(currentJob.customerUid===uid() && record.paymentStatus==='unpaid')card.append(button('I have paid',btn=>{
          if(confirm('Confirm you have sent payment using the invoice payment details. The seller will verify receipt.'))perform(btn,{...payload,action:'reportPayment'});
        }));
        if(currentJob.sellerUid===uid() && record.paymentStatus==='reported')card.append(button('Confirm payment received',btn=>{
          if(confirm('Have you verified this payment in your payment account?'))perform(btn,{...payload,action:'confirmPayment'});
        }));
      }
    }
    list.append(card);
  }
}
function startSubscriptions(user){
  session++;stopJobs?.();stopNotifications?.();closeJob();jobItems=[];renderJobs();$('notificationList').replaceChildren();$('notificationCount').textContent='';
  $('notificationsButton').classList.toggle('hidden',!user);
  if(!user){$('notificationsPage').classList.add('hidden');document.querySelector('.page-shell').classList.remove('hidden');return;}
  const token=session;
  stopJobs=onSnapshot(query(collection(db,'jobs'),where('participants','array-contains',user.uid)),snapshot=>{
    if(token!==session)return;
    jobItems=snapshot.docs.map(item=>({id:item.id,...item.data()})).sort((a,b)=>timestamp(b.updatedAt)-timestamp(a.updatedAt));renderJobs();
  },error=>notice(error.message,true));
  stopNotifications=onSnapshot(query(collection(db,'notifications',user.uid,'items'),orderBy('createdAt','desc'),limit(100)),snapshot=>{
    if(token!==session)return;
    const list=$('notificationList');list.replaceChildren();let unread=0;
    for(const item of snapshot.docs){const data=item.data();if(!data.read)unread++;
      const card=node('article',`job-card notification-card${data.read?'':' unread'}`);
      card.append(node('strong','',data.title),node('p','',data.body),node('time','helper-text',time(data.createdAt)));
      card.append(button('Open',async()=>{goJob(data.jobId);try{await updateDoc(item.ref,{read:true});}catch(error){notice(error.message,true);}}));list.append(card);
    }
    if(!snapshot.size)list.append(node('p','empty-state','You’re all caught up. New job, message, quote, and payment updates appear here.'));
    $('notificationCount').textContent=unread?` (${unread})`:'';
  },error=>notice(error.message,true));
  route();
}
export function initJobs(callbacks){
  api=callbacks;
  $('notificationsButton').addEventListener('click',()=>{location.hash='notifications';showPage();});
  $('closeNotifications').addEventListener('click',()=>{location.hash='feed';$('notificationsPage').classList.add('hidden');document.querySelector('.page-shell').classList.remove('hidden');closeJob();});
  window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#notifications'))route();else{$('notificationsPage').classList.add('hidden');document.querySelector('.page-shell').classList.remove('hidden');closeJob();}});
  $('requestEstimateButton').addEventListener('click',()=>{
    if(!api.requireAuth())return;
    currentStore=api.store();if(!currentStore || currentStore.ownerUid===uid())return;
    pendingRequestId=requestId();$('estimateRequestForm').reset();$('estimateRequestTitle').textContent=`Request an estimate from ${currentStore.name}`;$('estimateRequestStatus').textContent='';api.openModal($('estimateRequestModal'));
  });
  $('closeEstimateRequest').addEventListener('click',()=>api.closeModal($('estimateRequestModal')));
  $('estimateRequestForm').addEventListener('submit',async event=>{
    event.preventDefault();const form=event.currentTarget,submit=form.querySelector('button[type="submit"]');if(submit.disabled)return;submit.disabled=true;$('estimateRequestStatus').textContent='Sending request…';
    try{const result=await call({action:'request',storeId:currentStore.id,requestId:pendingRequestId,description:form.elements.description.value});api.closeModal($('estimateRequestModal'));goJob(result.data.jobId);}
    catch(error){$('estimateRequestStatus').textContent=errorText(error);}
    finally{submit.disabled=false;}
  });
  let pendingMessage=null;
  $('jobMessageForm').addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;if(!currentJob)return;
    const text=form.elements.message.value.trim();if(!text)return;
    if(!pendingMessage || pendingMessage.text!==text || pendingMessage.jobId!==currentJob.id)pendingMessage={text,jobId:currentJob.id,messageId:requestId()};
    perform(form.querySelector('button'),{action:'message',...pendingMessage},()=>{form.reset();pendingMessage=null;});
  });
  for(const kind of ['quotes','invoices']){
    const form=$(kind==='quotes'?'quoteForm':'invoiceForm');
    form.querySelector('.share-job-document').addEventListener('click',async event=>{
      const record=api.savedDocument(kind);if(!record){notice('Save the document first.',true);return;}
      await perform(event.currentTarget,{action:'share',jobId:record.jobId,kind,documentId:record.id},()=>{
        api.closeModal($(kind==='quotes'?'quoteModal':'invoiceModal'));goJob(record.jobId);notice('Document shared with the customer.');
      });
    });
  }
  onAuthStateChanged(auth,startSubscriptions);
}
