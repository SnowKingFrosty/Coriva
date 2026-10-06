import { initJobs } from './jobs.js';
import { COUNTRIES } from './countries.js';
import { getExchangeRate } from './exchange-rates.js';
import { CURRENCIES } from './currencies.js';
import {
  EmailAuthProvider,
  addDoc,
  auth,
  collection,
  createUserWithEmailAndPassword,
  deleteField,
  db,
  deleteDoc,
  deleteObject,
  doc,
  getDoc,
  getDocs,
  getDownloadURL,
  onAuthStateChanged,
  onSnapshot,
  query,
  reauthenticateWithCredential,
  ref,
  serverTimestamp,
  setDoc,
  signInWithEmailAndPassword,
  signOut,
  storage,
  updatePassword,
  updateDoc,
  uploadBytes,
  where,
  writeBatch
} from './firebase.js';

const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authTitle = document.getElementById('authTitle');
const authStatus = document.getElementById('authStatus');
const authFooterText = document.getElementById('authFooterText');
const createAccountLink = document.getElementById('createAccountLink');
const authTabs = document.querySelectorAll('.mode-tab');
const topActions = document.querySelector('.top-actions');

const storeModal = document.getElementById('storeModal');
const closeStoreModal = document.getElementById('closeStoreModal');
const storeForm = document.getElementById('storeForm');
const storeTemplateModal = document.getElementById('storeTemplateModal');
const storeTemplateForm = document.getElementById('storeTemplateForm');
const storeTemplateMedia = document.getElementById('storeTemplateMedia');
const storeTemplateMediaPreview = document.getElementById('storeTemplateMediaPreview');
const storeTemplateSocialLinks = document.getElementById('storeTemplateSocialLinks');
const storeTemplateStatus = document.getElementById('storeTemplateStatus');
const invoiceModal = document.getElementById('invoiceModal');
const quoteModal = document.getElementById('quoteModal');
const quoteForm = document.getElementById('quoteForm');
const quoteItems = document.getElementById('quoteItems');
const quoteList = document.getElementById('quoteList');
const quoteStatus = document.getElementById('quoteStatus');
const createQuoteButton = document.getElementById('createQuoteButton');
const addQuoteItem = document.getElementById('addQuoteItem');
const closeQuoteModal = document.getElementById('closeQuoteModal');
const cancelQuote = document.getElementById('cancelQuote');
const closeInvoiceModal = document.getElementById('closeInvoiceModal');
const invoiceForm = document.getElementById('invoiceForm');
const invoiceItems = document.getElementById('invoiceItems');
const paymentMethods = document.getElementById('paymentMethods');
const invoiceList = document.getElementById('invoiceList');
const invoiceStatus = document.getElementById('invoiceStatus');
const createInvoiceButton = document.getElementById('createInvoiceButton');
const addInvoiceItem = document.getElementById('addInvoiceItem');
const addPaymentMethod = document.getElementById('addPaymentMethod');
const cancelInvoice = document.getElementById('cancelInvoice');
const closeStoreTemplate = document.getElementById('closeStoreTemplate');
const manageStorefrontButton = document.getElementById('manageStorefrontButton');
const storeLogoInput = document.getElementById('storeLogoInput');
const storeBannerInput = document.getElementById('storeBannerInput');
const storefrontHero = document.getElementById('storefrontHero');
const storefrontBanner = document.getElementById('storefrontBanner');
const storefrontLogo = document.getElementById('storefrontLogo');
const storefrontMessageButton = document.getElementById('storefrontMessageButton');
const storefrontSocials = document.getElementById('storefrontSocials');
const storefrontBio = document.getElementById('storefrontBio');
const storefrontBioAction = document.getElementById('storefrontBioAction');
const storefrontBioActionLabel = document.getElementById('storefrontBioActionLabel');
const storefrontBioEditor = document.getElementById('storefrontBioEditor');
const storefrontPosts = document.getElementById('storefrontPosts');
const storefrontCreatePost = document.getElementById('storefrontCreatePost');
const storeList = document.getElementById('storeList');
const storeModalTitle = document.getElementById('storeModalTitle');
const storeSubmitButton = document.getElementById('storeSubmitButton');
const storeDetailModal = document.getElementById('storeDetailModal');
const storeDetailContent = document.getElementById('storeDetailContent');
const manageStoresModal = document.getElementById('manageStoresModal');
const managedStoreList = document.getElementById('managedStoreList');
const accountModal = document.getElementById('accountModal');
const accountForm = document.getElementById('accountForm');
const passwordResetForm = document.getElementById('passwordResetForm');
const passwordResetStatus = document.getElementById('passwordResetStatus');
const discoverFeed = document.getElementById('discoverFeed');
const feedEmptyState = document.getElementById('feedEmptyState');
const discoverSearchInput = document.getElementById('discoverSearchInput');
const discoverSearchForm = document.getElementById('discoverSearchForm');
const discoverSearchStatus = document.getElementById('discoverSearchStatus');
const clearDiscoverSearch = document.getElementById('clearDiscoverSearch');
const postForm = document.getElementById('postForm');
const createPostModal = document.getElementById('createPostModal');
const postStorefrontSelect = document.getElementById('postStorefrontSelect');
const postUploadStatus = document.getElementById('postUploadStatus');
const managePostsModal = document.getElementById('managePostsModal');
const managedPostList = document.getElementById('managedPostList');
const projectRoomsPanel = document.getElementById('projectRoomsPanel');
const roomList = document.getElementById('roomList');
const roomPage = document.getElementById('roomPage');
const roomHero = document.getElementById('roomHero');
const roomBanner = document.getElementById('roomBanner');
const roomBannerInput = document.getElementById('roomBannerInput');
const roomPageTitle = document.getElementById('roomPageTitle');
const roomPageDescription = document.getElementById('roomPageDescription');
const roomCreatorName = document.getElementById('roomCreatorName');
const roomManager = document.getElementById('roomManager');
const roomTitleInput = document.getElementById('roomTitleInput');
const roomDescriptionInput = document.getElementById('roomDescriptionInput');
const roomStatus = document.getElementById('roomStatus');
const roomMessageList = document.getElementById('roomMessageList');
const roomMessageStatus = document.getElementById('roomMessageStatus');
const roomMessageForm = document.getElementById('roomMessageForm');
const roomMessageInput = document.getElementById('roomMessageInput');
const roomSelectedGif = document.getElementById('roomSelectedGif');
const roomSelectedGifImage = document.getElementById('roomSelectedGifImage');
const roomSelectedGifStatus = document.getElementById('roomSelectedGifStatus');
const roomMemberHint = document.getElementById('roomMemberHint');
const createRoomModal = document.getElementById('createRoomModal');
const createRoomForm = document.getElementById('createRoomForm');
const createRoomStatus = document.getElementById('createRoomStatus');
const manageRoomButton = document.getElementById('manageRoomButton');
const saveRoomSettingsButton = document.getElementById('saveRoomSettings');
const deleteRoomButton = document.getElementById('deleteRoomButton');
const deleteRoomConfirmModal = document.getElementById('deleteRoomConfirmModal');
const deleteRoomStatus = document.getElementById('deleteRoomStatus');
const confirmDeleteRoomButton = document.getElementById('confirmDeleteRoom');
const storeChatModal = document.getElementById('storeChatModal');
const storeChatForm = document.getElementById('storeChatForm');
const storeChatThread = document.getElementById('storeChatThread');
const chatStoreContext = document.getElementById('chatStoreContext');

const storesStorageKey = 'aethelStores';
const profileStorageKey = 'aethelProfile';
const postsStorageKey = 'aethelDiscoverPosts';
const cloudStatus = document.getElementById('cloudStatus');
const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileHandle = document.getElementById('profileHandle');
const profileAccountType = document.getElementById('profileAccountType');
const profileSocialLinks = document.getElementById('profileSocialLinks');
const profileSocialLinkFields = document.getElementById('profileSocialLinkFields');
const profileLoginButton = document.getElementById('profileLoginButton');
const profileEditButton = document.getElementById('profileEditButton');
const becomeCreatorButton = document.getElementById('becomeCreatorButton');
const composerAvatar = document.getElementById('composerAvatar');
const firstVisitWelcome = document.getElementById('firstVisitWelcome');
const signupAccountTypeInput = document.getElementById('signupAccountType');
const signupTypeDescription = document.getElementById('signupTypeDescription');
let isAuthenticated = false;
let pendingAccountType = 'creator';

const socialServices = [
  { domains: ['instagram.com'], name: 'Instagram', icon: 'instagram' },
  { domains: ['linkedin.com'], name: 'LinkedIn', icon: 'linkedin' },
  { domains: ['x.com', 'twitter.com'], name: 'X', icon: 'x' },
  { domains: ['tiktok.com'], name: 'TikTok', icon: 'tiktok' },
  { domains: ['youtube.com', 'youtu.be'], name: 'YouTube', icon: 'youtube' },
  { domains: ['facebook.com', 'fb.com'], name: 'Facebook', icon: 'facebook' },
  { domains: ['threads.net'], name: 'Threads', icon: 'threads' },
  { domains: ['behance.net'], name: 'Behance', icon: 'behance' },
  { domains: ['dribbble.com'], name: 'Dribbble', icon: 'dribbble' },
  { domains: ['github.com'], name: 'GitHub', icon: 'github' },
  { domains: ['twitch.tv'], name: 'Twitch', icon: 'twitch' },
  { domains: ['discord.com', 'discordapp.com', 'discord.gg'], name: 'Discord', icon: 'discord' },
  { domains: ['pinterest.com'], name: 'Pinterest', icon: 'pinterest' }
];

const roomGifs = [
  { id: '1f44b', label: 'Waving hand' },
  { id: '1f44d', label: 'Thumbs up' },
  { id: '1f602', label: 'Laughing face' },
  { id: '1f389', label: 'Party popper' },
  { id: '1f525', label: 'Fire' },
  { id: '1f4af', label: 'Hundred points' },
  { id: '1f64c', label: 'Raising hands' },
  { id: '1f44f', label: 'Clapping hands' }
];
const getRoomGifUrl = (gifId) => roomGifs.some((gif) => gif.id === gifId)
  ? `https://fonts.gstatic.com/s/e/notoemoji/latest/${gifId}/512.gif`
  : '';
const isRoomGifUrl = (url) => {
  if (typeof url !== 'string') return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:'
      && (
        parsedUrl.hostname === 'static.klipy.com'
        || parsedUrl.hostname === 'firebasestorage.googleapis.com'
        || parsedUrl.pathname.toLowerCase().endsWith('.gif')
      );
  } catch {
    return false;
  }
};
const getPastedRoomGifUrl = (clipboardData) => {
  const html = clipboardData.getData('text/html');
  const htmlUrl = html
    ? new DOMParser().parseFromString(html, 'text/html').querySelector('img[src]')?.src
    : '';
  const textUrl = (clipboardData.getData('text/uri-list') || clipboardData.getData('text/plain'))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#'));
  for (const candidate of [htmlUrl, textUrl]) {
    if (candidate && isRoomGifUrl(candidate)) return new URL(candidate).href;
  }
  return '';
};

const readStoredValue = (key, fallback) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

let stores = readStoredValue(storesStorageKey, []);
if (!Array.isArray(stores)) stores = [];
let discoverPosts = readStoredValue(postsStorageKey, []);
if (!Array.isArray(discoverPosts)) discoverPosts = [];
let chats = {};
let currentProfile = readStoredValue(profileStorageKey, null);
let editingStoreId = null;
let activeFeedFilter = 'all';
let discoverSearchQuery = '';
let activeChatConversationId = null;
let activeChatUnsubscribe = null;
let activeStorefrontId = null;
let activeInvoices = [];
let activeQuotes = [];
let activeQuoteStoreId = null;
let quotesUnsubscribe = null;
let activeInvoiceStoreId = null;
let invoicesUnsubscribe = null;
let isManagingStorefront = false;
let rooms = [];
let activeRoomId = null;
let activeRoomMessages = [];
let activeRoomMessageUnsubscribe = null;
let selectedRoomGif = null;
let isManagingRoom = false;

const clearActiveUserSession = () => {
  try {
    localStorage.removeItem(profileStorageKey);
    localStorage.removeItem('aethelWelcomeSeen');
  } catch {}
  currentProfile = null;
  isAuthenticated = false;
};

clearActiveUserSession();

const openModal = (modal) => {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = (modal) => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
};

const createElement = (tagName, className = '', text = '') => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const getSocialService = (value) => {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    return socialServices.find((service) => service.domains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    )) || { name: hostname, icon: '' };
  } catch {
    return null;
  }
};

const getProfileSocialUrls = (profile) => {
  if (Array.isArray(profile?.socialLinks)) return profile.socialLinks;
  return [profile?.instagram, profile?.linkedin, profile?.xProfile, profile?.portfolio].filter(Boolean);
};

const createSocialAnchor = (value) => {
  const service = getSocialService(value);
  if (!service) return null;

  const url = new URL(value);
  const link = createElement('a', 'social-link');
  link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.title = service.name;
  link.setAttribute('aria-label', `${service.name} profile`);

  if (service.icon) {
    const logo = createElement('img');
    logo.src = `https://cdn.simpleicons.org/${service.icon}`;
    logo.alt = '';
    logo.addEventListener('error', () => {
      logo.replaceWith(createElement('span', 'social-icon-fallback', service.name.charAt(0).toUpperCase()));
    }, { once: true });
    link.append(logo);
  } else {
    link.append(createElement('span', 'social-icon-fallback', service.name.charAt(0).toUpperCase()));
  }

  link.append(createElement('span', 'visually-hidden', service.name));
  return link;
};

const updateSocialLinkPreview = (input, preview) => {
  preview.replaceChildren();
  const service = getSocialService(input.value);
  if (!service) {
    preview.textContent = 'Paste a profile URL';
    return;
  }

  if (service.icon) {
    const logo = createElement('img');
    logo.src = `https://cdn.simpleicons.org/${service.icon}`;
    logo.alt = '';
    preview.append(logo);
  }
  preview.append(createElement('span', '', service.name));
};

const addSocialLinkInput = (value = '', container = profileSocialLinkFields) => {
  const row = createElement('div', 'social-link-field');
  const label = createElement('label');
  label.append(createElement('span', '', 'Profile URL'));
  const input = createElement('input');
  input.type = 'url';
  input.name = 'socialUrl';
  input.className = 'profile-social-input';
  input.value = value;
  label.append(input);

  const preview = createElement('div', 'social-provider-preview');
  updateSocialLinkPreview(input, preview);
  input.addEventListener('input', () => {
    input.setCustomValidity(input.value.trim() && !getSocialService(input.value)
      ? 'Enter a valid HTTP or HTTPS profile URL.'
      : '');
    updateSocialLinkPreview(input, preview);
  });

  const removeButton = createElement('button', 'remove-social-link', 'Remove');
  removeButton.type = 'button';
  removeButton.setAttribute('aria-label', 'Remove social link');
  removeButton.addEventListener('click', () => row.remove());
  row.append(label, preview, removeButton);
  container.append(row);
};

const renderProfileArea = () => {
  const name = currentProfile?.fullName?.trim() || 'Your profile';
  const initials = name === 'Your profile' ? '?' : name.charAt(0).toUpperCase();
  profileName.textContent = name;
  profileHandle.textContent = currentProfile?.username || currentProfile?.role || 'Sign in to set up your creator profile';
  profileAccountType.textContent = currentProfile?.accountType === 'shopper' ? 'Shopper' : 'Creator';
  profileAccountType.classList.toggle('hidden', !currentProfile?.accountType);

  [profileAvatar, composerAvatar].forEach((avatar) => {
    avatar.replaceChildren();
    if (currentProfile?.profilePicture) {
      const image = createElement('img');
      image.src = currentProfile.profilePicture;
      image.alt = '';
      avatar.append(image);
      avatar.classList.add('has-profile-photo');
    } else {
      avatar.textContent = initials;
      avatar.classList.remove('has-profile-photo');
    }
  });

  profileSocialLinks.replaceChildren();
  getProfileSocialUrls(currentProfile).forEach((url) => {
    const link = createSocialAnchor(url);
    if (link) profileSocialLinks.append(link);
  });

  profileLoginButton.classList.toggle('hidden', isAuthenticated);
  profileEditButton.classList.toggle('hidden', !isAuthenticated);
  becomeCreatorButton.classList.toggle('hidden', !isAuthenticated || currentProfile?.accountType !== 'shopper');
};

const setSignupAccountType = (accountType) => {
  pendingAccountType = accountType === 'shopper' ? 'shopper' : 'creator';
  signupAccountTypeInput.value = pendingAccountType;
  const isCreator = pendingAccountType === 'creator';
  document.getElementById('creatorSignupFields').classList.toggle('hidden', !isCreator);
  document.getElementById('creatorSpecialtiesField').classList.toggle('hidden', !isCreator);
  document.querySelectorAll('[data-signup-type]').forEach((button) => {
    button.classList.toggle('active', button.dataset.signupType === pendingAccountType);
  });
  signupTypeDescription.textContent = pendingAccountType === 'shopper'
    ? 'Set up a shopper profile to discover independent services and storefronts.'
    : 'Set up your creator profile and share what you make.';
};

const showCloudError = (error) => {
  console.error('Firebase operation failed:', error);
  cloudStatus.textContent = `Cloud save failed: ${error.message || 'Check your Firebase setup and try again.'}`;
  cloudStatus.classList.remove('hidden');
};

const clearCloudStatus = () => {
  cloudStatus.textContent = '';
  cloudStatus.classList.add('hidden');
};

const getAuthErrorMessage = (error, action) => {
  if (
    action === 'sign in'
    && ['auth/user-not-found', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(error.code)
  ) {
    return 'Account does not exist, Please sign up';
  }
  if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
    return `Unable to ${action}: enable Email/Password under Firebase Console → Authentication → Sign-in method for project aethel-30d56.`;
  }
  if (error.code === 'auth/invalid-api-key') {
    return `Unable to ${action}: verify the Firebase web API key in firebase.js matches project aethel-30d56.`;
  }
  return `Unable to ${action}: ${error.message}`;
};

const writeOwnedDocuments = async (collectionName, items) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to save changes to Firebase.');
  const ownedItems = items.filter((item) => item.ownerUid === user.uid);
  await Promise.all(ownedItems.map((item) => {
    const publicItem = Object.fromEntries(
      Object.entries(item).filter(([key]) => !['fullName', 'email', 'creatorName', 'senderName'].includes(key))
    );
    if (collectionName === 'posts' && typeof publicItem.creatorUsername !== 'string') {
      publicItem.creatorUsername = currentProfile?.username || 'Creator';
    }
    return setDoc(
      doc(db, collectionName, item.id),
      { ...publicItem, updatedAt: serverTimestamp() }
    );
  }));
};

const migrateLegacyPublicNames = async (userId, username) => {
  const ownedRecords = await Promise.all([
    getDocs(query(collection(db, 'posts'), where('ownerUid', '==', userId))),
    getDocs(query(collection(db, 'stores'), where('ownerUid', '==', userId))),
    getDocs(query(collection(db, 'rooms'), where('ownerUid', '==', userId))),
    getDocs(collection(db, 'rooms'))
  ]);
  const roomMessages = await Promise.all(ownedRecords[3].docs.map((room) => getDocs(
    query(collection(db, 'rooms', room.id, 'messages'), where('senderUid', '==', userId))
  )));
  const migrations = [];
  [ownedRecords[0], ownedRecords[1]].forEach((records) => records.docs.forEach((snapshot) => {
    const data = snapshot.data();
    if (['fullName', 'creatorName'].some((key) => key in data)) {
      migrations.push(updateDoc(snapshot.ref, {
        fullName: deleteField(),
        creatorName: deleteField(),
        creatorUsername: username || data.creatorUsername || 'Coriva creator'
      }));
    }
  }));
  ownedRecords[2].docs.forEach((snapshot) => {
    const data = snapshot.data();
    if (['fullName', 'creatorName'].some((key) => key in data)) {
      migrations.push(updateDoc(snapshot.ref, {
        fullName: deleteField(),
        creatorName: deleteField(),
        creatorUsername: username || data.creatorUsername || 'Coriva creator'
      }));
    }
  });
  roomMessages.flatMap((messages) => messages.docs).forEach((snapshot) => {
    const data = snapshot.data();
    if (['fullName', 'senderName'].some((key) => key in data)) {
      migrations.push(updateDoc(snapshot.ref, {
        fullName: deleteField(),
        senderName: deleteField(),
        senderUsername: username || data.senderUsername || 'Coriva member'
      }));
    }
  });
  await Promise.all(migrations);
};

const saveStores = (items = stores) => {
  const savePromise = writeOwnedDocuments('stores', items);
  savePromise.catch(showCloudError);
  return savePromise;
};

const saveProfile = () => {
  const user = auth.currentUser;
  if (!user || !currentProfile) return Promise.reject(new Error('Sign in to save your profile.'));
  return setDoc(doc(db, 'profiles', user.uid), {
    ...currentProfile,
    uid: user.uid,
    updatedAt: serverTimestamp()
  });
};

const saveDiscoverPosts = () => {
  const savePromise = writeOwnedDocuments('posts', discoverPosts);
  savePromise.catch(showCloudError);
  return savePromise;
};

const renderPostStoreOptions = () => {
  const selectedStoreId = postStorefrontSelect.value;
  postStorefrontSelect.replaceChildren(createElement('option', '', 'No storefront selected'));
  postStorefrontSelect.options[0].value = '';

  stores.forEach((store) => {
    const option = createElement('option', '', `${store.name} · ${store.category}`);
    option.value = store.id;
    postStorefrontSelect.append(option);
  });

  if (stores.some((store) => store.id === selectedStoreId)) {
    postStorefrontSelect.value = selectedStoreId;
  }

  document.getElementById('postStoreHint').textContent = stores.length
    ? 'Link a storefront to give viewers a direct shopping button.'
    : 'Create a storefront first to add a direct shopping button.';
};

const renderRooms = () => {
  roomList.replaceChildren();
  const matchingRooms = rooms.filter((room) => (
    `${room.title || ''} ${room.description || ''} ${room.creatorUsername || ''}`
      .toLowerCase()
      .includes(discoverSearchQuery)
  ));
  if (!matchingRooms.length) {
    roomList.append(createElement(
      'div',
      'empty-room-card',
      discoverSearchQuery ? 'No chat rooms match your search.' : 'No chat rooms yet. Create one to start a conversation.'
    ));
    return;
  }
  matchingRooms.forEach((room) => {
    const card = createElement('button', 'room-card');
    card.type = 'button';
    card.dataset.roomId = room.id;
    const cover = createElement('span', 'room-card-cover');
    if (room.banner) {
      const image = createElement('img');
      image.src = room.banner;
      image.alt = '';
      cover.append(image);
    } else {
      cover.append(createElement('span', 'room-card-initial', (room.title || 'R').charAt(0).toUpperCase()));
    }
    const copy = createElement('span', 'room-card-copy');
    copy.append(createElement('strong', '', room.title || 'Untitled room'));
    copy.append(createElement('span', '', room.description || 'Coriva community chat room'));
    copy.append(createElement('small', '', `Created by ${room.creatorUsername || 'Coriva creator'}`));
    card.append(cover, copy, createElement('span', 'room-card-arrow', '↗'));
    roomList.append(card);
  });
};

const renderRoomMessages = () => {
  roomMessageList.replaceChildren();
  if (!activeRoomMessages.length) {
    roomMessageList.append(createElement('p', 'store-chat-empty', 'Be the first to start the conversation.'));
    return;
  }
  const currentRoom = rooms.find((room) => room.id === activeRoomId);
  activeRoomMessages.forEach((message) => {
    const isMine = message.senderUid === auth.currentUser?.uid;
    const row = createElement('div', `room-message-row${isMine ? ' mine' : ''}`);
    const bubble = createElement(
      'article',
      `chat-message${isMine ? ' mine' : ''}`
    );
    bubble.append(createElement('strong', 'room-message-author', message.senderUsername || 'Coriva member'));
    const gifUrl = isRoomGifUrl(message.gifUrl) ? message.gifUrl : getRoomGifUrl(message.gifId);
    if (gifUrl) {
      const image = createElement('img', 'room-chat-gif');
      image.src = gifUrl;
      image.alt = message.gifTitle || 'Animated reaction';
      image.loading = 'lazy';
      bubble.append(image);
    }
    if (message.text) bubble.append(createElement('p', '', message.text));
    const timestamp = message.createdAt?.toDate?.()
      ? message.createdAt.toDate()
      : new Date(message.createdAt || Date.now());
    bubble.append(createElement('time', '', timestamp.toLocaleString()));
    const user = auth.currentUser;
    if (user && (message.senderUid === user.uid || currentRoom?.ownerUid === user.uid)) {
      const deleteButton = createElement('button', 'room-message-delete', '×');
      deleteButton.type = 'button';
      deleteButton.setAttribute('aria-label', `Delete message from ${message.senderUsername || 'Coriva member'}`);
      deleteButton.title = 'Delete message';
      deleteButton.addEventListener('click', async () => {
        if (!window.confirm('Delete this message? This cannot be undone.')) return;
        deleteButton.disabled = true;
        roomMessageStatus.textContent = '';
        roomMessageStatus.classList.remove('error');
        try {
          await deleteDoc(doc(db, 'rooms', activeRoomId, 'messages', message.id));
        } catch (error) {
          roomMessageStatus.textContent = `Unable to delete message: ${error.message}`;
          roomMessageStatus.classList.add('error');
          deleteButton.disabled = false;
        }
      });
      row.append(bubble, deleteButton);
    } else {
      row.append(bubble);
    }
    roomMessageList.append(row);
  });
  roomMessageList.scrollTop = roomMessageList.scrollHeight;
};

const openRoomPage = (room) => {
  activeRoomId = room.id;
  isManagingRoom = false;
  const isOwner = Boolean(auth.currentUser && room.ownerUid === auth.currentUser.uid);
  manageRoomButton.classList.toggle('hidden', !isOwner);
  manageRoomButton.setAttribute('aria-expanded', 'false');
  manageRoomButton.textContent = 'Manage room';
  roomManager.classList.add('hidden');
  roomHero.classList.toggle('has-banner', Boolean(room.banner));
  roomBanner.classList.toggle('hidden', !room.banner);
  if (room.banner) roomBanner.src = room.banner;
  roomPageTitle.textContent = room.title || 'Untitled room';
  roomPageDescription.textContent = room.description || 'Join the conversation.';
  roomCreatorName.textContent = `Created by ${room.creatorUsername || 'Coriva creator'}`;
  roomTitleInput.value = room.title || '';
  roomDescriptionInput.value = room.description || '';
  roomBannerInput.value = '';
  roomStatus.textContent = '';
  roomStatus.classList.remove('error');
  roomMessageStatus.textContent = '';
  roomMessageStatus.classList.remove('error');
  roomMemberHint.textContent = isAuthenticated ? 'Messages are shared with everyone in this room' : 'Sign in to send messages';
  selectedRoomGif = null;
  roomSelectedGif.classList.add('hidden');
  roomSelectedGifImage.removeAttribute('src');
  roomSelectedGifStatus.textContent = 'GIF ready to send';
  roomMessageInput.value = '';
  closeModal(createRoomModal);
  roomPage.classList.remove('hidden');
  roomPage.setAttribute('aria-hidden', 'false');

  if (activeRoomMessageUnsubscribe) activeRoomMessageUnsubscribe();
  activeRoomMessages = [];
  renderRoomMessages();
  activeRoomMessageUnsubscribe = onSnapshot(
    query(collection(db, 'rooms', room.id, 'messages')),
    (snapshot) => {
      activeRoomMessages = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        .sort((a, b) => {
          const first = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const second = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return first - second;
        });
      renderRoomMessages();
    },
    showCloudError
  );
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const renderStores = () => {
  storeList.replaceChildren();
  renderPostStoreOptions();

  if (!stores.length) {
    storeList.append(createElement(
      'div',
      'empty-state',
      'No storefronts yet. Create one to build your creator page.'
    ));
    return;
  }

  stores.forEach((store, index) => {
    const card = createElement('button', 'store-item');
    card.type = 'button';
    card.dataset.storeId = store.id;
    card.setAttribute('aria-label', `View ${store.name} storefront`);

    const art = createElement('span', `store-art art-${(index % 4) + 1}`);
    const cover = store.media?.[0]?.data || store.projectImages?.[0];
    if (cover && (!store.media?.[0]?.type || store.media[0].type.startsWith('image/'))) {
      const image = createElement('img');
      image.src = cover;
      image.alt = '';
      art.append(image);
    }
    const copy = createElement('span', 'store-copy');
    const header = createElement('span', 'store-header');
    header.append(createElement('strong', '', store.name));
    header.append(createElement('span', 'store-category-badge', store.draft ? 'Draft' : store.category || 'Creator page'));
    copy.append(header);
    copy.append(createElement('span', 'store-handle', store.handle));
    if (store.bio) copy.append(createElement('span', 'store-handle', store.bio));

    card.append(art, copy);
    storeList.append(card);
  });
};

let mediaObserver;

const createDiscoverPostCard = (post) => {
  const card = createElement('article', `discover-post${post.type === 'ad' ? ' sponsored-post' : ''}`);
  card.dataset.postId = post.id;
  const media = createElement('div', 'discover-post-media');

  if (post.mediaType.startsWith('video/')) {
    const video = createElement('video');
    video.src = post.mediaData;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', 'Creator video');
    media.append(video);
  } else {
    const image = createElement('img');
    image.src = post.mediaData;
    image.alt = 'Creator post';
    image.loading = 'lazy';
    media.append(image);
  }

  const overlay = createElement('div', 'discover-post-overlay');
  const copy = createElement('div', 'discover-post-copy');
  copy.append(createElement('span', 'post-type-label', post.type === 'ad' ? 'Sponsored' : 'Creator post'));
  copy.append(createElement('strong', 'post-creator-name', post.creatorUsername || 'Creator'));
  if (post.creatorUsername) copy.append(createElement('span', 'post-creator-handle', post.creatorUsername));
  copy.append(createElement('p', 'discover-post-caption', post.caption));

  const linkedStore = stores.find((store) => store.id === post.storeId);
  if (linkedStore) {
    const shopButton = createElement('button', 'primary-btn post-shop-button', `Shop ${linkedStore.name}`);
    shopButton.type = 'button';
    shopButton.dataset.shopStoreId = linkedStore.id;
    copy.append(shopButton);
  } else {
    const browseLink = createElement('a', 'secondary-btn post-shop-button', 'Browse storefronts');
    browseLink.href = '#storefronts';
    copy.append(browseLink);
  }

  const actions = createElement('div', 'post-action-rail');
  const likeButton = createElement('button', `post-like-button${post.liked ? ' is-liked' : ''}`);
  likeButton.type = 'button';
  likeButton.dataset.likePostId = post.id;
  likeButton.setAttribute('aria-label', post.liked ? 'Unlike post' : 'Like post');
  likeButton.setAttribute('aria-pressed', String(Boolean(post.liked)));
  likeButton.append(createElement('span', 'post-like-icon', post.liked ? '♥' : '♡'));
  likeButton.append(createElement('span', 'post-like-count', String(post.likes || 0)));
  actions.append(likeButton);

  overlay.append(copy, actions);
  media.append(overlay);
  card.append(media);
  return card;
};

const renderDiscoverFeed = () => {
  const postResults = discoverPosts.filter((post) => {
    const matchesFilter = activeFeedFilter === 'all' || activeFeedFilter === 'post';
    const linkedStore = stores.find((store) => store.id === post.storeId);
    const searchableText = [
      post.caption,
      post.creatorUsername,
      linkedStore?.name,
      linkedStore?.handle,
      linkedStore?.category,
      linkedStore?.bio
    ].filter(Boolean).join(' ').toLowerCase();
    return matchesFilter && searchableText.includes(discoverSearchQuery);
  });
  if (activeFeedFilter === 'rooms') {
    renderRooms();
    projectRoomsPanel.classList.remove('hidden');
    discoverFeed.classList.add('rooms-mode');
    discoverFeed.replaceChildren(projectRoomsPanel);
    const matchingRoomCount = rooms.filter((room) => (
      `${room.title || ''} ${room.description || ''} ${room.creatorUsername || ''}`
        .toLowerCase()
        .includes(discoverSearchQuery)
    )).length;
    discoverSearchStatus.textContent = `${matchingRoomCount} ${matchingRoomCount === 1 ? 'room' : 'rooms'} found`;
    clearDiscoverSearch.classList.toggle('hidden', !discoverSearchQuery);
    if (mediaObserver) mediaObserver.disconnect();
    return;
  }

  discoverFeed.classList.remove('rooms-mode');
  const visibleItems = postResults;
  const cards = visibleItems.map(createDiscoverPostCard);
  discoverFeed.replaceChildren(...cards);

  if (!visibleItems.length) {
    const heading = feedEmptyState.querySelector('h2');
    const message = feedEmptyState.querySelector('p');
    if (discoverSearchQuery) {
      heading.textContent = `No results for "${discoverSearchInput.value.trim()}"`;
      message.textContent = 'Try another search or clear your filters.';
    } else {
      heading.textContent = discoverPosts.length ? 'No projects yet' : 'Your Discover feed is ready';
      message.textContent = discoverPosts.length
        ? 'Publish a project to be the first in this feed.'
        : 'Share a project, promote an offer, and link it to a storefront so people can shop.';
    }
    discoverFeed.append(feedEmptyState);
  }

  discoverSearchStatus.textContent = `${visibleItems.length} ${visibleItems.length === 1 ? 'project' : 'projects'} found`;
  clearDiscoverSearch.classList.toggle('hidden', !discoverSearchQuery);

  if (mediaObserver) mediaObserver.disconnect();
  if ('IntersectionObserver' in window) {
    mediaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.65 });
    discoverFeed.querySelectorAll('video').forEach((video) => mediaObserver.observe(video));
  }
};


const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const countryById = new Map(COUNTRIES.map(country => [country.id, country]));
const getSellerCurrency = () => {
  const country = countryById.get(currentProfile?.country);
  if (!country) return null;
  const saved = currentProfile?.sellerCurrency;
  if (saved && (country.currencies.includes(saved) || !country.currencies.length)) return saved;
  return country.currencies[0] || null;
};
const updateAccountCurrency = (saved = '') => {
  const country = countryById.get(accountForm.elements.country.value);
  const select = accountForm.elements.sellerCurrency;
  select.replaceChildren();
  const codes = country ? (country.currencies.length ? country.currencies : CURRENCIES.map(item => item.code)) : [];
  if (!codes.length) {
    const option = createElement('option', '', 'Select a country first');
    option.value = '';
    select.append(option);
  } else {
    codes.forEach(code => {
      const option = createElement('option', '', code + ' — ' + (CURRENCIES.find(item => item.code === code)?.name || code));
      option.value = code;
      select.append(option);
    });
    select.value = codes.includes(saved) ? saved : codes[0];
  }
  select.disabled = codes.length <= 1;
  document.getElementById('accountCurrencyHint').textContent = !country
    ? 'Your country sets the default currency for new invoices and quotes.'
    : country.currencies.length === 1
      ? 'This currency will fill automatically on new invoices and quotes.'
      : 'Choose your billing currency once here. It will fill automatically on new invoices and quotes.';
};
const initializeAccountCountry = () => {
  const select = accountForm.elements.country;
  // The complete list is also in HTML so it is visible before app initialization.
  const existing = new Set(Array.from(select.options, option => option.value));
  COUNTRIES.forEach(country => {
    if (existing.has(country.id)) return;
    const option = createElement('option', '', country.name);
    option.value = country.id;
    select.append(option);
    existing.add(country.id);
  });
  if (!select.dataset.currencyBound) {
    select.addEventListener('change', () => updateAccountCurrency());
    select.dataset.currencyBound = 'true';
  }
};

const currencyByCode = new Map(CURRENCIES.map(currency => [currency.code, currency]));
const getInvoiceCurrency = (value) => String(value || 'USD').trim().toUpperCase();
const currencyDigits = (currency) => {
  const code = getInvoiceCurrency(currency);
  if (currencyByCode.has(code)) return currencyByCode.get(code).digits;
  try { return new Intl.NumberFormat('en', { style: 'currency', currency: code }).resolvedOptions().maximumFractionDigits; }
  catch { return 2; }
};
const invoiceMoney = (value, currency = 'USD') => {
  const code = getInvoiceCurrency(currency);
  const digits = currencyDigits(code);
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: code, currencyDisplay: 'code', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
  } catch { return code + ' ' + amount.toFixed(digits); }
};
// Currency codes and Latin digits remain readable with the PDF's built-in font.
const pdfMoney = (value, currency = 'USD') => getInvoiceCurrency(currency) + ' ' +
  new Intl.NumberFormat('en-US', { minimumFractionDigits: currencyDigits(currency), maximumFractionDigits: currencyDigits(currency) }).format(Number(value) || 0);

const populateCurrencyOptions = (form, selected = form.elements.currency.value || 'USD') => {
  const search = form.elements.currencySearch.value.trim().toLowerCase();
  const select = form.elements.currency;
  select.replaceChildren();
  const sellerCountry = countryById.get(currentProfile?.country);
  const available = sellerCountry?.currencies.length > 1
    ? CURRENCIES.filter(currency => sellerCountry.currencies.includes(currency.code) || currency.code === selected)
    : CURRENCIES;
  const matches = available.filter(currency =>
    (currency.code + ' ' + currency.name + ' ' + currency.countries.join(' ')).toLowerCase().includes(search));
  const shown = available.filter(currency => currency.code === selected || matches.includes(currency));
  shown.forEach(currency => {
    const option = createElement('option', '', currency.code + ' — ' + currency.name);
    option.value = currency.code;
    option.defaultSelected = currency.code === 'USD';
    select.append(option);
  });
  if (!currencyByCode.has(selected)) {
    const option = createElement('option', '', selected + ' — Previously saved currency');
    option.value = selected;
    select.append(option);
  }
  select.value = selected;
  form.querySelector('.currency-search-status').textContent = search
    ? matches.length + ' matching currencies. Current selection remains available.'
    : '';
};
const updateConsumerPreview = (form, draft) => {
  const totals = convertedTotals(draft);
  for (const key of ['subtotal', 'tax', 'total']) {
    form.querySelector('.consumer-' + key).textContent = totals
      ? invoiceMoney(totals[key], draft.consumerCurrency || draft.currency) : '—';
  }
};
const convertedTotals = (record) => {
  const target = record.consumerCurrency || record.currency;
  const fx = record.exchange;
  const rate = target === record.currency ? 1
    : fx?.from === record.currency && fx?.to === target ? fx.rate : NaN;
  if (!(Number.isFinite(rate) && rate > 0)) return null;
  const totals = invoiceTotals(record);
  const round = value => Number(value.toFixed(currencyDigits(target)));
  const subtotal = round(totals.subtotal * rate), tax = round(totals.tax * rate);
  return { subtotal, tax, total: round(subtotal + tax) };
};
const refreshExchange = async (form) => {
  const request = (form.exchangeRequest || 0) + 1;
  form.exchangeRequest = request;
  form.exchange = null;
  const from = form.elements.currency.value, to = form.elements.consumerCurrency.value;
  const status = form.querySelector('.exchange-status');
  status.textContent = 'Loading current exchange rate…';
  const update = () => form === invoiceForm ? updateInvoiceTotalPreview() : updateQuoteTotalPreview();
  update();
  try {
    const exchange = await getExchangeRate(from, to);
    if (form.exchangeRequest !== request) return;
    form.exchange = exchange;
    status.textContent = from === to ? 'Same currency — no conversion needed.'
      : '1 ' + from + ' = ' + Number(exchange.rate.toPrecision(8)) + ' ' + to + ' · Updated ' + new Date(exchange.asOf).toLocaleString();
  } catch (error) {
    if (form.exchangeRequest !== request) return;
    status.textContent = 'Conversion unavailable: ' + error.message;
  }
  update();
};
const prepareCurrencyPicker = (form, code = 'USD', record = null) => {
  form.elements.currencySearch.value = '';
  populateCurrencyOptions(form, getInvoiceCurrency(code));
  // Preserve the saved selection while allowing multi-currency sellers to change it.
  const sellerCountry = countryById.get(currentProfile?.country);
  const canSwitch = sellerCountry && sellerCountry.currencies.length !== 1;
  const automatic = Boolean(record || getSellerCurrency()) && !canSwitch;
  form.elements.currency.disabled = automatic;
  form.elements.currencySearch.closest('label').classList.toggle('hidden', automatic);

  const select = form.elements.consumerCurrency;
  select.replaceChildren();
  CURRENCIES.forEach(currency => {
    const option = createElement('option', '', currency.code + ' — ' + currency.name);
    option.value = currency.code;
    select.append(option);
  });
  const target = record?.consumerCurrency || code;
  if (!currencyByCode.has(target)) {
    const option = createElement('option', '', target + ' — Previously saved currency');
    option.value = target;
    select.append(option);
  }
  select.value = target;
  form.exchangeRequest = (form.exchangeRequest || 0) + 1;
  const saved = record?.exchange;
  if (saved?.from === code && saved?.to === target && Number.isFinite(saved.rate) && saved.rate > 0) {
    form.exchange = { ...saved };
    form.querySelector('.exchange-status').textContent = 'Saved rate: 1 ' + code + ' = ' + Number(saved.rate.toPrecision(8)) + ' ' + target + (saved.asOf ? ' · ' + new Date(saved.asOf).toLocaleString() : '');
  } else {
    form.exchange = null;
    // Populate the remaining editor fields before calculating its preview.
    const openingRequest = form.exchangeRequest;
    queueMicrotask(() => { if (form.exchangeRequest === openingRequest && form.elements.currency.value === code && form.elements.consumerCurrency.value === target) refreshExchange(form); });
  }
};
const bindCurrencyPicker = (form, update) => {
  prepareCurrencyPicker(form);
  form.elements.currencySearch.addEventListener('input', () => populateCurrencyOptions(form));
  form.elements.currency.addEventListener('change', () => {
    form.refreshWorkflowPricing?.();
    refreshExchange(form);
  });
  form.elements.consumerCurrency.addEventListener('change', () => refreshExchange(form));
  form.querySelector('.refresh-exchange').addEventListener('click', () => refreshExchange(form));
};
const validateExchange = (record) => {
  if (!convertedTotals(record)) throw new Error('Wait for a valid exchange rate before saving, or select the same seller and customer currency.');
};
const addPdfConversion = (pdf, record, y) => {
  if (!record.consumerCurrency || record.consumerCurrency === record.currency) return y;
  const totals = convertedTotals(record);
  if (!totals) throw new Error('This document has no valid saved exchange rate.');
  if (y > 600) { pdf.addPage(); y = 55; }
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.setTextColor(17,24,39);
  pdf.text('CUSTOMER CURRENCY: ' + record.consumerCurrency, 48, y); y += 18;
  for (const [label, key] of [['Subtotal', 'subtotal'], ['Tax', 'tax'], ['CUSTOMER TOTAL', 'total']]) {
    pdf.text(label, 48, y); pdf.text(pdfMoney(totals[key], record.consumerCurrency), 564, y, { align: 'right' }); y += 17;
  }
  pdf.setFontSize(8);
  pdf.text('1 ' + record.currency + ' = ' + Number(record.exchange.rate.toPrecision(8)) + ' ' + record.consumerCurrency, 48, y); y += 13;
  pdf.text('Rate date: ' + (record.exchange.asOf || '').slice(0,10) + ' | Rates By Exchange Rate API', 48, y); y += 13;
  pdf.textWithLink('https://www.exchangerate-api.com',48,y,{url:'https://www.exchangerate-api.com'}); y += 22;
  return y;
};

const invoiceDateLabel = (value) => {
  if (!value) return 'No due date';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const workflowPricingTotal = (documentData) => {
  const type = documentData.workflowPricingType || 'none';
  if (type === 'hourly') return (Number(documentData.workflowHourlyRate) || 0) * (Number(documentData.workflowHours) || 0);
  if (type === 'flat') return Number(documentData.workflowFlatFee) || 0;
  return 0;
};

const invoiceTotals = (invoice) => {
  const itemSubtotal = (invoice.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const workflow = workflowPricingTotal(invoice);
  const subtotal = itemSubtotal + workflow;
  const tax = subtotal * ((Number(invoice.taxRate) || 0) / 100);
  return { itemSubtotal, workflow, subtotal, tax, total: subtotal + tax };
};

const bindWorkflowPricing = (form, previewSelector = null) => {
  if (!form) return;
  if (form.refreshWorkflowPricing) { form.refreshWorkflowPricing(); return; }
  const type = form.elements.workflowPricingType;
  const hourlyFields = form.querySelectorAll('.workflow-hourly-field');
  const flatField = form.querySelector('.workflow-flat-field');
  const refresh = () => {
    const hourly = type?.value === 'hourly';
    const flat = type?.value === 'flat';
    hourlyFields.forEach((el) => el.classList.toggle('hidden', !hourly));
    flatField?.classList.toggle('hidden', !flat);
    const amount = workflowPricingTotal({ workflowPricingType: type?.value, workflowHourlyRate: form.elements.workflowHourlyRate?.value, workflowHours: form.elements.workflowHours?.value, workflowFlatFee: form.elements.workflowFlatFee?.value });
    const currency = getInvoiceCurrency(form.elements.currency?.value);
    const target = form.querySelector('.workflow-preview-amount');
    if (target) target.textContent = invoiceMoney(amount, currency);
    if (form === invoiceForm) updateInvoiceTotalPreview();
    if (form === quoteForm) updateQuoteTotalPreview();
  };
  form.refreshWorkflowPricing = refresh;
  type?.addEventListener('change', refresh);
  form.querySelectorAll('[name^="workflow"]').forEach((el) => el.addEventListener('input', refresh));
  form.elements.currency?.addEventListener('input', refresh);
  refresh();
};

const updateInvoiceTotalPreview = () => {
  if (!invoiceForm || !invoiceItems) return;
  const draft = collectInvoiceForm(true);
  const { subtotal, tax, total } = invoiceTotals(draft);
  const currency = draft.currency || 'USD';
  const subtotalEl = document.getElementById('invoicePreviewSubtotal');
  const taxEl = document.getElementById('invoicePreviewTax');
  const totalEl = document.getElementById('invoicePreviewTotal');
  if (subtotalEl) subtotalEl.textContent = invoiceMoney(subtotal, currency);
  if (taxEl) taxEl.textContent = invoiceMoney(tax, currency);
  if (totalEl) totalEl.textContent = invoiceMoney(total, currency);
  updateConsumerPreview(invoiceForm, draft);
};

const addInvoiceItemRow = (item = {}) => {
  const row = createElement('div', 'invoice-item-row');
  row.innerHTML = `
    <input name="itemDescription" maxlength="180" placeholder="Item or service" value="${escapeHtml(item.description || '')}">
    <input name="itemQuantity" type="number" min="0.01" step="0.01" value="${Number(item.quantity) || 1}" aria-label="Quantity">
    <input name="itemPrice" type="number" min="0" step="any" value="${Number(item.unitPrice) || 0}" aria-label="Unit price">
    <button type="button" class="icon-btn invoice-remove-item" aria-label="Remove item">×</button>`;
  row.querySelector('.invoice-remove-item').addEventListener('click', () => {
    row.remove();
    updateInvoiceTotalPreview();
  });
  invoiceItems.append(row);
  updateInvoiceTotalPreview();
};

const addPaymentMethodRow = (method = {}) => {
  const row = createElement('div', 'payment-method-row');
  row.innerHTML = `
    <input name="paymentName" maxlength="60" placeholder="Payment app (e.g. PayPal)" value="${escapeHtml(method.name || '')}">
    <input name="paymentUrl" type="url" maxlength="1000" placeholder="https://..." value="${escapeHtml(method.url || '')}">
    <button type="button" class="icon-btn payment-remove" aria-label="Remove payment method">×</button>`;
  row.querySelector('.payment-remove').addEventListener('click', () => row.remove());
  paymentMethods.append(row);
};

const collectInvoiceForm = (preview = false) => {
  const itemRows = Array.from(invoiceItems.querySelectorAll('.invoice-item-row'));
  const items = itemRows.map((row) => ({
    description: row.querySelector('[name="itemDescription"]').value.trim(),
    quantity: Number(row.querySelector('[name="itemQuantity"]').value),
    unitPrice: Number(row.querySelector('[name="itemPrice"]').value)
  })).filter((item) => (preview || item.description) && item.quantity > 0 && item.unitPrice >= 0);

  const methods = Array.from(paymentMethods.querySelectorAll('.payment-method-row')).map((row) => ({
    name: row.querySelector('[name="paymentName"]').value.trim(),
    url: row.querySelector('[name="paymentUrl"]').value.trim()
  })).filter((method) => method.name && method.url);

  return {
    invoiceId: invoiceForm.elements.invoiceId.value || '',
    jobId: invoiceForm.dataset.jobId || '',
    invoiceNumber: invoiceForm.elements.invoiceNumber.value.trim(),
    customerName: invoiceForm.elements.customerName.value.trim(),
    customerEmail: invoiceForm.elements.customerEmail.value.trim(),
    dueDate: invoiceForm.elements.dueDate.value,
    notes: invoiceForm.elements.notes.value.trim(),
    workflowPricingType: invoiceForm.elements.workflowPricingType.value,
    workflowHourlyRate: Number(invoiceForm.elements.workflowHourlyRate.value) || 0,
    workflowHours: Number(invoiceForm.elements.workflowHours.value) || 0,
    workflowFlatFee: Number(invoiceForm.elements.workflowFlatFee.value) || 0,
    workflowDescription: invoiceForm.elements.workflowDescription.value.trim(),
    taxRate: Number(invoiceForm.elements.taxRate.value) || 0,
    currency: getInvoiceCurrency(invoiceForm.elements.currency.value),
    consumerCurrency: invoiceForm.elements.consumerCurrency.value,
    exchange: invoiceForm.exchange ? { ...invoiceForm.exchange } : null,
    items,
    paymentMethods: methods
  };
};

const assertDocumentEditable = async (reference) => {
  const snapshot = await getDoc(reference);
  if (!snapshot.exists()) throw new Error('This document has been deleted.');
  if (snapshot.data().status === 'void') throw new Error('Voided documents cannot be edited.');
};

const appendDocumentActions = (actions, copy, record, kind, edit) => {
  const label = kind === 'quotes' ? 'quote' : 'invoice';
  const isVoid = record.status === 'void';
  copy.append(createElement('span', isVoid ? 'document-status document-status-void' : 'document-status', isVoid ? 'Voided' : 'Active'));
  edit.disabled = isVoid;
  const voidButton = createElement('button', 'secondary-btn', 'Void');
  voidButton.type = 'button';
  voidButton.disabled = isVoid;
  const deleteButton = createElement('button', 'secondary-btn document-delete', 'Delete');
  deleteButton.type = 'button';
  let busy = false;
  const perform = async (operation) => {
    if (busy) return;
    const number = record.quoteNumber || record.invoiceNumber || record.id;
    const question = operation === 'delete'
      ? `Permanently delete ${label} ${number}? This cannot be undone.`
      : `Void ${label} ${number}? It will remain in your records but cannot be edited.`;
    if (!window.confirm(question)) return;
    busy = true;
    Array.from(actions.children).forEach(button => { button.disabled = true; });
    const status = kind === 'quotes' ? quoteStatus : invoiceStatus;
    status.classList.remove('error');
    status.textContent = '';
    try {
      const store = stores.find(item => item.id === record.storeId);
      if (!store || auth.currentUser?.uid !== store.ownerUid) throw new Error('Only the storefront owner can manage this document.');
      const reference = doc(db, 'stores', store.id, kind, record.id);
      if (operation === 'delete') await deleteDoc(reference);
      else await updateDoc(reference, { status: 'void', voidedAt: serverTimestamp(), updatedAt: serverTimestamp(), ...(kind === 'quotes' ? { paymentMethods: record.paymentMethods || [] } : {}) });
      const form = kind === 'quotes' ? quoteForm : invoiceForm;
      const idField = kind === 'quotes' ? 'quoteId' : 'invoiceId';
      if (form.elements[idField].value === record.id) closeModal(kind === 'quotes' ? quoteModal : invoiceModal);
      status.textContent = `${label === 'quote' ? 'Quote' : 'Invoice'} ${operation === 'delete' ? 'deleted' : 'voided'}.`;
    } catch (error) {
      status.textContent = `Unable to ${operation} ${label}: ${error.message}`;
      status.classList.add('error');
      window.alert(status.textContent);
    } finally {
      busy = false;
      Array.from(actions.children).forEach(button => { button.disabled = false; });
      edit.disabled = isVoid;
      voidButton.disabled = isVoid;
    }
  };
  voidButton.addEventListener('click', () => perform('void'));
  deleteButton.addEventListener('click', () => perform('delete'));
  actions.append(voidButton, deleteButton);
};

const renderInvoiceList = () => {
  invoiceList.replaceChildren();
  if (!activeInvoices.length) {
    invoiceList.append(createElement('p', 'empty-state', 'No invoices yet. Create one to send a customer a polished bill.'));
    return;
  }
  activeInvoices.forEach((invoice) => {
    const { total } = invoiceTotals(invoice);
    const card = createElement('article', 'invoice-list-card');
    const copy = createElement('div', 'invoice-list-copy');
    const number = createElement('strong', '', invoice.invoiceNumber || invoice.id.slice(0, 8));
    number.classList.add('invoice-number');
    copy.append(
      number,
      createElement('span', '', invoice.customerName || 'Customer'),
      createElement('small', '', `${invoice.items?.length || 0} ${(invoice.items?.length || 0) === 1 ? 'item' : 'items'} · ${invoiceMoney(total, invoice.currency)} · ${invoiceDateLabel(invoice.dueDate)}`)
    );
    const customerTotals = convertedTotals(invoice);
    if (invoice.consumerCurrency && invoice.consumerCurrency !== invoice.currency && customerTotals) copy.append(createElement('small', '', 'Customer total: ' + invoiceMoney(customerTotals.total, invoice.consumerCurrency)));
    const actions = createElement('div', 'invoice-list-actions');
    const edit = createElement('button', 'secondary-btn', 'Edit');
    edit.type = 'button';
    edit.addEventListener('click', () => openInvoiceEditor(invoice));
    const pdf = createElement('button', 'primary-btn', 'PDF');
    pdf.type = 'button';
    pdf.addEventListener('click', () => downloadSavedDocument(invoice, 'invoices', pdf));
    actions.append(edit, pdf);
    appendDocumentActions(actions, copy, invoice, 'invoices', edit);
    card.append(copy, actions);
    invoiceList.append(card);
  });
};

const subscribeToStoreInvoices = (storeId) => {
  if (invoicesUnsubscribe) invoicesUnsubscribe();
  activeInvoiceStoreId = storeId;
  activeInvoices = [];
  renderInvoiceList();
  if (!storeId || !isAuthenticated || !auth.currentUser) return;
  invoicesUnsubscribe = onSnapshot(
    collection(db, 'stores', storeId, 'invoices'),
    (snapshot) => {
      activeInvoices = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        .sort((a, b) => String(b.invoiceNumber || '').localeCompare(String(a.invoiceNumber || '')));
      renderInvoiceList();
    },
    (error) => {
      invoiceStatus.textContent = `Unable to load invoices: ${error.message}`;
      invoiceStatus.classList.add('error');
    }
  );
};

const openInvoiceEditor = (invoice = null) => {
  if (!activeStorefrontId || !isAuthenticated || auth.currentUser?.uid !== stores.find((s) => s.id === activeStorefrontId)?.ownerUid) return;
  if (invoice?.status === 'void') return;
  closeModal(quoteModal);
  invoiceForm.reset();
  invoiceForm.dataset.jobId = invoice?.jobId || '';
  invoiceForm.savedJobDocument = null;
  invoiceForm.querySelector('.share-job-document').classList.toggle('hidden', !invoice?.jobId);
  invoiceForm.querySelector('.share-job-document').disabled = true;

  invoiceItems.replaceChildren();
  paymentMethods.replaceChildren();
  invoiceStatus.textContent = '';
  invoiceStatus.classList.remove('error');
  invoiceForm.elements.invoiceId.value = invoice?.id || '';
  invoiceForm.elements.invoiceNumber.value = invoice?.invoiceNumber || `INV-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${String(activeInvoices.length + 1).padStart(3, '0')}`;
  invoiceForm.elements.customerName.value = invoice?.customerName || '';
  invoiceForm.elements.customerEmail.value = invoice?.customerEmail || '';
  invoiceForm.elements.dueDate.value = invoice?.dueDate || '';
  invoiceForm.elements.notes.value = invoice?.notes || '';
  invoiceForm.elements.workflowPricingType.value = invoice?.workflowPricingType || 'none';
  invoiceForm.elements.workflowHourlyRate.value = invoice?.workflowHourlyRate ?? 0;
  invoiceForm.elements.workflowHours.value = invoice?.workflowHours ?? 0;
  invoiceForm.elements.workflowFlatFee.value = invoice?.workflowFlatFee ?? 0;
  invoiceForm.elements.workflowDescription.value = invoice?.workflowDescription || '';
  invoiceForm.elements.taxRate.value = invoice?.taxRate ?? 0;
  prepareCurrencyPicker(invoiceForm, invoice?.currency || getSellerCurrency() || 'USD', invoice);
  (invoice?.items?.length ? invoice.items : [{}]).forEach(addInvoiceItemRow);
  (invoice?.paymentMethods || []).forEach(addPaymentMethodRow);
  document.getElementById('invoiceModalTitle').textContent = invoice ? `Edit ${invoice.invoiceNumber}` : 'Create invoice';
  openModal(invoiceModal);
  bindWorkflowPricing(invoiceForm);
  updateInvoiceTotalPreview();
};

const externalScriptLoads = new Map();
const loadExternalScript = (src, test) => {
  if (test()) return Promise.resolve();
  if (externalScriptLoads.has(src)) return externalScriptLoads.get(src);
  const pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => finish(new Error('PDF tools took too long to load. Please retry the PDF button.')), 12000);
    const finish = (error) => {
      clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
      if (error) { script.remove(); reject(error); }
      else resolve();
    };
    script.src = src;
    script.onload = () => finish(test() ? null : new Error('PDF tools did not initialize. Please reload the page.'));
    script.onerror = () => finish(new Error('Unable to load PDF tools. Check that the vendor folder was uploaded with the project.'));
    document.head.appendChild(script);
  });
  externalScriptLoads.set(src, pending);
  pending.catch(() => externalScriptLoads.delete(src));
  return pending;
};

const pdfDownloadUrls = new Map();
const offerPdfDownload = (pdf, filename, status) => {
  const previous = pdfDownloadUrls.get(status);
  if (previous) URL.revokeObjectURL(previous);
  const url = URL.createObjectURL(pdf.output('blob'));
  pdfDownloadUrls.set(status, url);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.textContent = 'Download PDF';
  link.className = 'secondary-btn';
  status.classList.remove('error');
  status.replaceChildren(document.createTextNode('PDF ready. If the download did not start, select Download PDF. '), link);
  link.click();
};

const downloadSavedDocument = async (record, kind, button) => {
  const status = kind === 'quotes' ? quoteStatus : invoiceStatus;
  if (button.disabled) return;
  button.disabled = true;
  status.classList.remove('error');
  status.textContent = 'Preparing PDF…';
  try {
    await (kind === 'quotes' ? downloadQuotePdf(record) : downloadInvoicePdf(record));
  } catch (error) {
    status.textContent = 'Unable to download PDF: ' + error.message;
    status.classList.add('error');
    window.alert(status.textContent);
  } finally { button.disabled = false; }
};

const downloadInvoicePdf = async (invoice, { storeOverride = null, statusTarget = invoiceStatus } = {}) => {
  await loadExternalScript('./jspdf.umd.min.js', () => Boolean(window.jspdf?.jsPDF));
  if (invoice.status !== 'void' && invoice.paymentMethods?.length) {
    await loadExternalScript('./qrcode.min.js', () => Boolean(window.QRCode));
  }
  const jsPDF = window.jspdf?.jsPDF;
  if (!jsPDF) throw new Error('PDF tools are unavailable.');
  const store = storeOverride || stores.find((item) => item.id === (invoice.storeId || activeStorefrontId));
  if (!store) throw new Error('Storefront not found.');
  const { subtotal, tax, total, workflow } = invoiceTotals(invoice);
  const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 48;
  const pageWidth = 612;
  let y = 52;
  const blue = [103, 213, 255];
  const ink = [17, 24, 39];
  const muted = [95, 105, 125];
  const addText = (text, x, yy, size = 10, color = ink, options = {}) => {
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    pdf.setFont('helvetica', options.bold ? 'bold' : 'normal');
    pdf.text(String(text ?? ''), x, yy, options);
  };
  const addWrapped = (text, x, yy, width, size = 10, color = ink) => {
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(String(text || ''), width);
    pdf.text(lines, x, yy);
    return yy + lines.length * (size + 3);
  };
  addText(store.name, margin, y, 22, ink, { bold: true });
  addText(invoice.status === 'void' ? 'VOID INVOICE' : 'INVOICE', pageWidth - margin, y, 18, blue, { bold: true, align: 'right' });
  y += 22;
  addText(store.handle ? `@${String(store.handle).replace(/^@/, '')}` : 'Coriva storefront', margin, y, 9, muted);
  addText(`#${invoice.invoiceNumber}`, pageWidth - margin, y, 10, muted, { align: 'right' });
  y += 28;
  pdf.setDrawColor(220, 225, 235);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 24;
  addText('BILL TO', margin, y, 8, muted, { bold: true });
  y += 15;
  addText(invoice.customerName, margin, y, 12, ink, { bold: true });
  if (invoice.customerEmail) { y += 14; addText(invoice.customerEmail, margin, y, 9, muted); }
  addText('DUE', pageWidth - 150, y - (invoice.customerEmail ? 14 : 0), 8, muted, { bold: true });
  addText(invoiceDateLabel(invoice.dueDate), pageWidth - margin, y - (invoice.customerEmail ? 14 : 0), 10, ink, { align: 'right' });
  y += 32;
  addText('ITEM', margin, y, 8, muted, { bold: true });
  addText('QTY', 380, y, 8, muted, { bold: true, align: 'right' });
  addText('UNIT', 455, y, 8, muted, { bold: true, align: 'right' });
  addText('AMOUNT', pageWidth - margin, y, 8, muted, { bold: true, align: 'right' });
  y += 9; pdf.line(margin, y, pageWidth - margin, y); y += 19;
  (invoice.items || []).forEach((item) => {
    const descLines = pdf.splitTextToSize(item.description, 275);
    addText(descLines[0], margin, y, 10, ink, { bold: true });
    if (descLines.length > 1) addText(descLines.slice(1).join(' '), margin, y + 13, 9, muted);
    addText(item.quantity, 380, y, 10, ink, { align: 'right' });
    addText(pdfMoney(item.unitPrice, invoice.currency), 455, y, 10, ink, { align: 'right' });
    addText(pdfMoney(item.quantity * item.unitPrice, invoice.currency), pageWidth - margin, y, 10, ink, { align: 'right' });
    y += Math.max(22, descLines.length * 13 + 8);
    if (y > 700) { pdf.addPage(); y = 55; }
  });
  y += 8;
  if (invoice.workflowPricingType && invoice.workflowPricingType !== 'none') {
    addText('WORKFLOW PRICING', margin, y, 8, muted, { bold: true }); y += 16;
    const workflowLabel = invoice.workflowPricingType === 'hourly' ? `${invoice.workflowDescription || 'Hourly work'} — ${Number(invoice.workflowHours || 0).toFixed(2)} hrs × ${pdfMoney(invoice.workflowHourlyRate, invoice.currency)}/hr` : (invoice.workflowDescription || 'Workflow / project fee');
    addText(workflowLabel, margin, y, 9, ink);
    addText(pdfMoney(workflow, invoice.currency), pageWidth - margin, y, 10, ink, { align: 'right' });
    y += 22;
  }
  pdf.line(360, y, pageWidth - margin, y); y += 20;
  addText('Subtotal', margin, y, 9, muted); addText(pdfMoney(subtotal, invoice.currency), pageWidth - margin, y, 10, ink, { align: 'right' }); y += 16;
  addText(`Tax (${Number(invoice.taxRate || 0).toFixed(2)}%)`, margin, y, 9, muted); addText(pdfMoney(tax, invoice.currency), pageWidth - margin, y, 10, ink, { align: 'right' }); y += 21;
  addText('TOTAL', margin, y, 12, ink, { bold: true }); addText(pdfMoney(total, invoice.currency), pageWidth - margin, y, 13, blue, { bold: true, align: 'right' }); y += 34;
  y = addPdfConversion(pdf, invoice, y);
  if (invoice.notes) { addText('NOTES', margin, y, 8, muted, { bold: true }); y += 14; y = addWrapped(invoice.notes, margin, y, 330, 9, muted) + 12; }
  if (invoice.status !== 'void' && invoice.paymentMethods?.length) {
    addText('PAYMENT OPTIONS', margin, y, 8, muted, { bold: true }); y += 18;
    for (const method of invoice.paymentMethods) {
      if (y > 680) { pdf.addPage(); y = 55; }
      addText(method.name, margin, y + 18, 10, ink, { bold: true });
      pdf.setFontSize(7);
      pdf.setTextColor(...muted);
      pdf.textWithLink(method.url, margin, y + 33, { url: method.url });
      const qrHolder = document.createElement('div');
      new QRCode(qrHolder, { text: method.url, width: 72, height: 72, correctLevel: QRCode.CorrectLevel.M });
      const qrCanvas = qrHolder.querySelector('canvas') || qrHolder.querySelector('img');
      if (qrCanvas) {
        const data = qrCanvas.tagName === 'CANVAS' ? qrCanvas.toDataURL('image/png') : qrCanvas.src;
        pdf.addImage(data, 'PNG', pageWidth - margin - 72, y, 72, 72);
      }
      y += 90;
    }
  }
  pdf.setFontSize(8); pdf.setTextColor(...muted);
  pdf.text('Thank you for your business.', margin, 755);
  const filename = `invoice-${String(invoice.invoiceNumber || invoice.id).replace(/[^a-z0-9_-]/gi, '_')}.pdf`;
  offerPdfDownload(pdf, filename, statusTarget);
};

invoiceForm.addEventListener('input', updateInvoiceTotalPreview);

const saveInvoice = async (invoice) => {
  validateExchange(invoice);
  const user = auth.currentUser;
  const store = stores.find((item) => item.id === activeStorefrontId);
  if (!user || !store || store.ownerUid !== user.uid) throw new Error('Only the storefront owner can create invoices.');
  const data = {
    ...invoice,
    storeId: store.id,
    ownerUid: user.uid,
    updatedAt: serverTimestamp()
  };
  if (invoice.invoiceId) {
    await assertDocumentEditable(doc(db, 'stores', store.id, 'invoices', invoice.invoiceId));
    await updateDoc(doc(db, 'stores', store.id, 'invoices', invoice.invoiceId), data);
    return { ...invoice, id: invoice.invoiceId, storeId: store.id, ownerUid: user.uid };
  }
  const refDoc = await addDoc(collection(db, 'stores', store.id, 'invoices'), { ...data, createdAt: serverTimestamp() });
  return { ...invoice, id: refDoc.id, storeId: store.id, ownerUid: user.uid };
};


const quoteTotals = (quote) => invoiceTotals(quote);
const updateQuoteTotalPreview = () => {
  if (!quoteForm || !quoteItems) return;
  const draft = collectQuoteForm(true);
  const { subtotal, tax, total } = quoteTotals(draft);
  const currency = getInvoiceCurrency(quoteForm.elements.currency.value);
  document.getElementById('quotePreviewSubtotal').textContent = invoiceMoney(subtotal, currency);
  document.getElementById('quotePreviewTax').textContent = invoiceMoney(tax, currency);
  document.getElementById('quotePreviewTotal').textContent = invoiceMoney(total, currency);
  updateConsumerPreview(quoteForm, draft);
};
const addQuoteItemRow = (item = {}) => {
  const row = createElement('div', 'invoice-item-row');
  row.innerHTML = `<input name="description" placeholder="Description" maxlength="160" value="${escapeHtml(item.description || '')}" required><input name="quantity" type="number" min="0.01" step="0.01" placeholder="Qty" value="${item.quantity ?? 1}" required><input name="unitPrice" type="number" min="0" step="any" placeholder="Unit price" value="${item.unitPrice ?? ''}" required><button type="button" class="icon-btn invoice-remove-item" aria-label="Remove item">×</button>`;
  row.querySelector('.invoice-remove-item').addEventListener('click', () => { row.remove(); updateQuoteTotalPreview(); });
  row.querySelectorAll('input').forEach((input) => input.addEventListener('input', updateQuoteTotalPreview));
  quoteItems.append(row);
  updateQuoteTotalPreview();
};
const collectQuoteForm = (preview = false) => ({
  quoteId: quoteForm.elements.quoteId.value || '',
  jobId: quoteForm.dataset.jobId || '',
  quoteNumber: quoteForm.elements.quoteNumber.value.trim(),
  customerName: quoteForm.elements.customerName.value.trim(),
  customerEmail: quoteForm.elements.customerEmail.value.trim(),
  validUntil: quoteForm.elements.validUntil.value,
  notes: quoteForm.elements.notes.value.trim(),
  workflowPricingType: quoteForm.elements.workflowPricingType.value,
  workflowHourlyRate: Number(quoteForm.elements.workflowHourlyRate.value) || 0,
  workflowHours: Number(quoteForm.elements.workflowHours.value) || 0,
  workflowFlatFee: Number(quoteForm.elements.workflowFlatFee.value) || 0,
  workflowDescription: quoteForm.elements.workflowDescription.value.trim(),
  taxRate: Number(quoteForm.elements.taxRate.value) || 0,
  currency: getInvoiceCurrency(quoteForm.elements.currency.value),
  consumerCurrency: quoteForm.elements.consumerCurrency.value,
  exchange: quoteForm.exchange ? { ...quoteForm.exchange } : null,
  items: Array.from(quoteItems.querySelectorAll('.invoice-item-row')).map((row) => ({ description: row.querySelector('[name="description"]').value.trim(), quantity: Number(row.querySelector('[name="quantity"]').value), unitPrice: Number(row.querySelector('[name="unitPrice"]').value) })).filter((item) => (preview || item.description) && item.quantity > 0 && item.unitPrice >= 0)
});
const renderQuoteList = () => {
  quoteList.replaceChildren();
  if (!activeQuotes.length) { quoteList.append(createElement('p', 'empty-state', 'No quotes yet. Create one to send a customer a polished estimate.')); return; }
  activeQuotes.forEach((quote) => {
    const { total } = quoteTotals(quote); const card = createElement('article', 'invoice-list-card'); const copy = createElement('div','invoice-list-copy');
    const number = createElement('strong', '', quote.quoteNumber || quote.id.slice(0,8)); number.classList.add('invoice-number');
    copy.append(number, createElement('span', '', quote.customerName || 'Customer'), createElement('small','',`${quote.items?.length || 0} ${(quote.items?.length || 0)===1?'item':'items'} · ${invoiceMoney(total, quote.currency)} · ${quote.validUntil ? `Valid until ${invoiceDateLabel(quote.validUntil)}` : 'No expiration'}`));
    const customerTotals = convertedTotals(quote); if (quote.consumerCurrency && quote.consumerCurrency !== quote.currency && customerTotals) copy.append(createElement('small', '', 'Customer total: ' + invoiceMoney(customerTotals.total, quote.consumerCurrency)));
    const actions=createElement('div','invoice-list-actions'); const edit=createElement('button','secondary-btn','Edit'); edit.type='button'; edit.addEventListener('click',()=>openQuoteEditor(quote)); const pdf=createElement('button','primary-btn','PDF'); pdf.type='button'; pdf.addEventListener('click',()=>downloadSavedDocument(quote, 'quotes', pdf)); actions.append(edit,pdf); appendDocumentActions(actions,copy,quote,'quotes',edit); card.append(copy,actions); quoteList.append(card);
  });
};
const subscribeToStoreQuotes = (storeId) => {
  if (quotesUnsubscribe) quotesUnsubscribe(); activeQuoteStoreId=storeId; activeQuotes=[]; renderQuoteList();
  if (!storeId || !isAuthenticated || !auth.currentUser) return;
  quotesUnsubscribe=onSnapshot(collection(db,'stores',storeId,'quotes'),(snapshot)=>{ activeQuotes=snapshot.docs.map((item)=>({id:item.id,...item.data()})).sort((a,b)=>String(b.quoteNumber||'').localeCompare(String(a.quoteNumber||''))); renderQuoteList(); },(error)=>{ quoteStatus.textContent=`Unable to load quotes: ${error.message}`; quoteStatus.classList.add('error'); });
};
const openQuoteEditor = (quote=null) => {
  if (!activeStorefrontId || !isAuthenticated || auth.currentUser?.uid !== stores.find((s)=>s.id===activeStorefrontId)?.ownerUid) return;
  if (quote?.status === 'void') return;
  closeModal(invoiceModal);
  quoteForm.reset();
  quoteForm.dataset.jobId = quote?.jobId || '';
  quoteForm.savedJobDocument = null;
  quoteForm.querySelector('.share-job-document').classList.toggle('hidden', !quote?.jobId);
  quoteForm.querySelector('.share-job-document').disabled = true;
 quoteItems.replaceChildren(); quoteStatus.textContent=''; quoteStatus.classList.remove('error'); quoteForm.elements.quoteId.value=quote?.id||''; quoteForm.elements.quoteNumber.value=quote?.quoteNumber||`QUOTE-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${String(activeQuotes.length+1).padStart(3,'0')}`; quoteForm.elements.customerName.value=quote?.customerName||''; quoteForm.elements.customerEmail.value=quote?.customerEmail||''; quoteForm.elements.validUntil.value=quote?.validUntil||''; quoteForm.elements.notes.value=quote?.notes||''; quoteForm.elements.workflowPricingType.value=quote?.workflowPricingType||'none'; quoteForm.elements.workflowHourlyRate.value=quote?.workflowHourlyRate??0; quoteForm.elements.workflowHours.value=quote?.workflowHours??0; quoteForm.elements.workflowFlatFee.value=quote?.workflowFlatFee??0; quoteForm.elements.workflowDescription.value=quote?.workflowDescription||''; quoteForm.elements.taxRate.value=quote?.taxRate??0; prepareCurrencyPicker(quoteForm, quote?.currency || getSellerCurrency() || 'USD', quote); (quote?.items?.length?quote.items:[{}]).forEach(addQuoteItemRow); document.getElementById('quoteModalTitle').textContent=quote?`Edit ${quote.quoteNumber}`:'Create price quote'; openModal(quoteModal); bindWorkflowPricing(quoteForm); updateQuoteTotalPreview();
};
const saveQuote = async (quote) => {
  validateExchange(quote);
  const user=auth.currentUser; const store=stores.find((item)=>item.id===activeStorefrontId); if(!user||!store||store.ownerUid!==user.uid) throw new Error('Only the storefront owner can create quotes.');
  const data={...quote,paymentMethods:[],storeId:store.id,ownerUid:user.uid,updatedAt:serverTimestamp()};
  if(quote.quoteId){ await assertDocumentEditable(doc(db,'stores',store.id,'quotes',quote.quoteId)); await updateDoc(doc(db,'stores',store.id,'quotes',quote.quoteId),data); return {...quote,id:quote.quoteId,storeId:store.id,ownerUid:user.uid}; }
  const refDoc=await addDoc(collection(db,'stores',store.id,'quotes'),{...data,createdAt:serverTimestamp()}); return {...quote,id:refDoc.id,storeId:store.id,ownerUid:user.uid};
};
const downloadQuotePdf = async (quote, { storeOverride = null, statusTarget = quoteStatus } = {}) => {
  await loadExternalScript('./jspdf.umd.min.js',()=>Boolean(window.jspdf?.jsPDF));
  const jsPDF=window.jspdf?.jsPDF; if(!jsPDF) throw new Error('PDF tools are unavailable.'); const store=storeOverride || stores.find((item)=>item.id===(quote.storeId||activeStorefrontId)); if(!store) throw new Error('Storefront not found.'); const {subtotal,tax,total,workflow}=quoteTotals(quote); const pdf=new jsPDF({unit:'pt',format:'letter'}); const margin=48,pageWidth=612; let y=52; const blue=[103,213,255],ink=[17,24,39],muted=[95,105,125];
  const addText=(text,x,yy,size=10,color=ink,options={})=>{pdf.setFontSize(size);pdf.setTextColor(...color);pdf.setFont('helvetica',options.bold?'bold':'normal');pdf.text(String(text??''),x,yy,options)};
  const addWrapped=(text,x,yy,width,size=10,color=ink)=>{pdf.setFontSize(size);pdf.setTextColor(...color);pdf.setFont('helvetica','normal');const lines=pdf.splitTextToSize(String(text||''),width);pdf.text(lines,x,yy);return yy+lines.length*(size+3)};
  addText(store.name,margin,y,22,ink,{bold:true}); addText(quote.status === 'void' ? 'VOID QUOTE' : 'PRICE QUOTE',pageWidth-margin,y,18,blue,{bold:true,align:'right'}); y+=22; addText(store.handle?`@${String(store.handle).replace(/^@/,'')}`:'Coriva storefront',margin,y,9,muted); addText(`#${quote.quoteNumber}`,pageWidth-margin,y,10,muted,{align:'right'}); y+=28; pdf.setDrawColor(220,225,235); pdf.line(margin,y,pageWidth-margin,y); y+=24;
  addText('PREPARED FOR',margin,y,8,muted,{bold:true}); y+=15; addText(quote.customerName,margin,y,12,ink,{bold:true}); if(quote.customerEmail){y+=14;addText(quote.customerEmail,margin,y,9,muted)} addText('VALID UNTIL',pageWidth-150,y-(quote.customerEmail?14:0),8,muted,{bold:true}); addText(quote.validUntil?invoiceDateLabel(quote.validUntil):'No expiration',pageWidth-margin,y-(quote.customerEmail?14:0),10,ink,{align:'right'}); y+=32;
  addText('ITEM',margin,y,8,muted,{bold:true}); addText('QTY',380,y,8,muted,{bold:true,align:'right'}); addText('UNIT',455,y,8,muted,{bold:true,align:'right'}); addText('AMOUNT',pageWidth-margin,y,8,muted,{bold:true,align:'right'}); y+=9; pdf.line(margin,y,pageWidth-margin,y); y+=19;
  (quote.items||[]).forEach(item=>{const descLines=pdf.splitTextToSize(item.description,275);addText(descLines[0],margin,y,10,ink,{bold:true});if(descLines.length>1)addText(descLines.slice(1).join(' '),margin,y+13,9,muted);addText(item.quantity,380,y,10,ink,{align:'right'});addText(pdfMoney(item.unitPrice,quote.currency),455,y,10,ink,{align:'right'});addText(pdfMoney(item.quantity*item.unitPrice,quote.currency),pageWidth-margin,y,10,ink,{align:'right'});y+=Math.max(22,descLines.length*13+8);if(y>700){pdf.addPage();y=55}});
  y+=8;
  if (quote.workflowPricingType && quote.workflowPricingType !== 'none') {
    addText('WORKFLOW PRICING', margin, y, 8, muted, {bold:true}); y+=16;
    const workflowLabel = quote.workflowPricingType === 'hourly' ? `${quote.workflowDescription || 'Hourly work'} — ${Number(quote.workflowHours || 0).toFixed(2)} hrs × ${pdfMoney(quote.workflowHourlyRate, quote.currency)}/hr` : (quote.workflowDescription || 'Workflow / project fee');
    addText(workflowLabel, margin, y, 9, ink); addText(pdfMoney(workflow, quote.currency), pageWidth-margin, y, 10, ink, {align:'right'}); y+=22;
  }
  pdf.line(360,y,pageWidth-margin,y);y+=20;addText('Subtotal',margin,y,9,muted);addText(pdfMoney(subtotal,quote.currency),pageWidth-margin,y,10,ink,{align:'right'});y+=16;addText(`Tax (${Number(quote.taxRate||0).toFixed(2)}%)`,margin,y,9,muted);addText(pdfMoney(tax,quote.currency),pageWidth-margin,y,10,ink,{align:'right'});y+=21;addText('ESTIMATED TOTAL',margin,y,12,ink,{bold:true});addText(pdfMoney(total,quote.currency),pageWidth-margin,y,13,blue,{bold:true,align:'right'});y+=34;
  y = addPdfConversion(pdf, quote, y);
  if(quote.notes){addText('NOTES / TERMS',margin,y,8,muted,{bold:true});y+=14;y=addWrapped(quote.notes,margin,y,440,9,muted)+12} addText('This quote is an estimate and is not an invoice.',margin,y,8,muted);pdf.setFontSize(8);pdf.setTextColor(...muted);pdf.text('Thank you for considering our work.',margin,755);
  const filename=`quote-${String(quote.quoteNumber||quote.id).replace(/[^a-z0-9_-]/gi,'_')}.pdf`;offerPdfDownload(pdf, filename, statusTarget);
};

const renderStorefrontPage = (store) => {
  activeStorefrontId = store.id;
  const isOwner = Boolean(
    isAuthenticated
    && auth.currentUser
    && store.ownerUid === auth.currentUser.uid
  );
  if (isOwner) {
    if (activeInvoiceStoreId !== store.id) subscribeToStoreInvoices(store.id);
    if (activeQuoteStoreId !== store.id) subscribeToStoreQuotes(store.id);
  } else {
    if (invoicesUnsubscribe) invoicesUnsubscribe();
    invoicesUnsubscribe = null;
    activeInvoiceStoreId = null;
    activeInvoices = [];
    activeQuotes = [];
    if (quotesUnsubscribe) quotesUnsubscribe();
    quotesUnsubscribe = null;
    renderInvoiceList();
    renderQuoteList();
  }
  const editor = document.querySelector('.storefront-editor');
  if (!isOwner) isManagingStorefront = false;
  manageStorefrontButton.classList.toggle('hidden', !isOwner);
  manageStorefrontButton.setAttribute('aria-expanded', String(isOwner && isManagingStorefront));
  manageStorefrontButton.textContent = isManagingStorefront ? 'Done managing' : 'Manage storefront';
  editor.classList.toggle('hidden', !isOwner || !isManagingStorefront);
  storefrontCreatePost.classList.toggle('hidden', !isOwner || !isManagingStorefront);
  storefrontMessageButton.classList.toggle('hidden', isOwner);
  document.getElementById('requestEstimateButton').classList.toggle('hidden', isOwner);
  storefrontMessageButton.dataset.messageStoreId = store.id;

  document.getElementById('storeTemplateTitle').textContent = store.name;
  document.getElementById('storefrontHandle').textContent = store.handle || '';
  const storefrontSocialUrls = store.socialLinks?.length
    ? store.socialLinks
    : isOwner
      ? getProfileSocialUrls(currentProfile)
      : [];
  storefrontSocials.replaceChildren();
  (Array.isArray(storefrontSocialUrls) ? storefrontSocialUrls : [])
    .map(createSocialAnchor)
    .filter(Boolean)
    .forEach((link) => storefrontSocials.append(link));
  storefrontSocials.classList.toggle('hidden', !storefrontSocials.childElementCount);
  storefrontBio.textContent = store.bio || 'This creator has not added a bio yet.';
  storefrontHero.classList.toggle('has-banner', Boolean(store.banner));
  storefrontBanner.classList.toggle('hidden', !store.banner);
  if (store.banner) storefrontBanner.src = store.banner;
  storefrontLogo.replaceChildren();
  if (store.logo) {
    const logoImage = createElement('img');
    logoImage.src = store.logo;
    logoImage.alt = `${store.name} logo`;
    storefrontLogo.append(logoImage);
  } else {
    storefrontLogo.textContent = store.name.charAt(0).toUpperCase();
  }

  const posts = discoverPosts.filter((post) => (
    post.storeId === store.id
    || (store.ownerUid && post.ownerUid === store.ownerUid)
  ));
  storefrontPosts.replaceChildren();
  if (!posts.length) {
    storefrontPosts.append(createElement(
      'p',
      'storefront-posts-empty',
      isOwner ? 'Your work and posts will appear here. Publish a post to start building your portfolio.' : 'No posts have been shared here yet.'
    ));
  } else {
    posts.forEach((post) => {
      const card = createElement('article', 'storefront-post-card');
      const media = post.mediaType?.startsWith('video/')
        ? createElement('video', 'storefront-post-media')
        : createElement('img', 'storefront-post-media');
      media.src = post.mediaData;
      if (media.tagName === 'VIDEO') {
        media.controls = true;
        media.playsInline = true;
      } else {
        media.alt = `${store.name} project`;
        media.loading = 'lazy';
      }
      const copy = createElement('div', 'storefront-post-copy');
      copy.append(createElement('span', 'post-type-label', post.type === 'ad' ? 'Sponsored' : 'Creator post'));
      copy.append(createElement('p', '', post.caption || 'Project from the creator'));
      card.append(media, copy);
      storefrontPosts.append(card);
    });
  }

  storeTemplateForm.elements.storeId.value = store.id;
  storeTemplateForm.elements.storeBio.value = store.bio || '';
  storefrontBioEditor.classList.add('hidden');
  storefrontBioAction.setAttribute('aria-expanded', 'false');
  storefrontBioAction.querySelector('.upload-plus').textContent = '+';
  storefrontBioActionLabel.textContent = store.bio ? 'Edit Bio' : 'Add Bio';
  storeLogoInput.value = '';
  storeBannerInput.value = '';
  storeTemplateMedia.value = '';
  storeTemplateSocialLinks.replaceChildren();
  storefrontSocialUrls.forEach((url) => addSocialLinkInput(url, storeTemplateSocialLinks));
  const existingMedia = store.media?.length
    ? store.media
    : (store.projectImages || []).map((data) => ({ type: 'image/jpeg', data }));
  renderStoreTemplateMedia(existingMedia);
  storeTemplateStatus.textContent = '';
  storeTemplateStatus.classList.remove('error');
  storefrontHero.dataset.storeId = store.id;
};

const renderStoreDetails = (store) => {
  storeDetailContent.replaceChildren();

  const header = createElement('div', 'detail-heading');
  header.append(createElement('div', 'brand-mark small-brand', store.name.charAt(0).toUpperCase()));
  const headingCopy = createElement('div');
  headingCopy.append(createElement('h2', '', store.name));
  if (store.handle) headingCopy.append(createElement('p', 'detail-handle', store.handle));
  header.append(headingCopy);
  storeDetailContent.append(header);
  storeDetailContent.append(createElement('h3', 'detail-section-title', 'About'));
  storeDetailContent.append(createElement('p', 'detail-bio', store.bio || 'This creator has not added a bio yet.'));

  const mediaItems = store.media?.length
    ? store.media
    : (store.projectImages || []).map((data) => ({ type: 'image/jpeg', data }));
  storeDetailContent.append(createElement('h3', 'detail-section-title', 'Photos and videos'));
  if (mediaItems.length) {
    const gallery = createElement('div', 'storefront-media-gallery');
    mediaItems.forEach((item, index) => {
      const mediaItem = createElement('div', 'storefront-media-item');
      const media = createElement(item.type.startsWith('video/') ? 'video' : 'img');
      media.src = item.data;
      if (media.tagName === 'VIDEO') {
        media.controls = true;
        media.playsInline = true;
      } else {
        media.alt = `${store.name} media ${index + 1}`;
      }
      mediaItem.append(media);
      gallery.append(mediaItem);
    });
    storeDetailContent.append(gallery);
  } else {
    storeDetailContent.append(createElement('p', 'storefront-media-empty', 'Photos and videos will appear here.'));
  }

  const socialUrls = Array.isArray(store.socialLinks) ? store.socialLinks : getProfileSocialUrls(currentProfile);
  const contactLinks = socialUrls
    .map(createSocialAnchor)
    .filter(Boolean);

  storeDetailContent.append(createElement('h3', 'detail-section-title', 'Social links'));
  const links = createElement('div', 'social-links');
  if (contactLinks.length) links.append(...contactLinks);
  else links.append(createElement('p', 'storefront-media-empty', 'No social links added yet.'));
  storeDetailContent.append(links);

  const messageButton = createElement('button', 'primary-btn full-width storefront-message-button', 'Start live chat with the creator');
  messageButton.type = 'button';
  messageButton.dataset.messageStoreId = store.id;
  storeDetailContent.append(messageButton);
};

const renderStoreChat = () => {
  storeChatThread.replaceChildren();
  const messages = chats[activeChatConversationId] || [];
  if (!messages.length) {
    storeChatThread.append(createElement('p', 'store-chat-empty', 'Start a conversation about this storefront.'));
    return;
  }

  messages.forEach((message) => {
    const bubble = createElement('div', `chat-message${message.senderUid === auth.currentUser?.uid ? ' mine' : ''}`);
    bubble.append(createElement('p', '', message.text));
    const createdAt = message.createdAt?.toDate ? message.createdAt.toDate() : new Date(message.createdAt);
    bubble.append(createElement('time', '', createdAt.toLocaleString()));
    storeChatThread.append(bubble);
  });
  storeChatThread.scrollTop = storeChatThread.scrollHeight;
};

const openStoreChat = (store) => {
  if (!requireAuth('signin')) return;
  activeChatConversationId = `${store.id}_${auth.currentUser.uid}`;
  const conversationRef = doc(db, 'chats', activeChatConversationId);
  const participants = [...new Set([auth.currentUser.uid, store.ownerUid].filter(Boolean))];
  setDoc(conversationRef, { storeId: store.id, participants }, { merge: true })
    .then(() => {
      if (activeChatUnsubscribe) activeChatUnsubscribe();
      activeChatUnsubscribe = onSnapshot(
        query(collection(db, 'chats', activeChatConversationId, 'messages')),
        (snapshot) => {
          chats[activeChatConversationId] = snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort((a, b) => {
              const first = a.createdAt?.toDate?.() || new Date(a.createdAt);
              const second = b.createdAt?.toDate?.() || new Date(b.createdAt);
              return first - second;
            });
          renderStoreChat();
        },
        showCloudError
      );
    })
    .catch(showCloudError);
  document.getElementById('storeChatTitle').textContent = `Chat with ${store.name}`;
  chatStoreContext.textContent = `${store.handle} · ${store.category}`;
  renderStoreChat();
  closeModal(storeDetailModal);
  closeModal(storeTemplateModal);
  openModal(storeChatModal);
};

const renderManagedStores = () => {
  managedStoreList.replaceChildren();
  const ownedStores = stores.filter((store) => store.ownerUid === auth.currentUser?.uid);
  if (!ownedStores.length) {
    managedStoreList.append(createElement('p', 'empty-state', 'You have no storefronts to manage yet.'));
    return;
  }

  ownedStores.forEach((store) => {
    const row = createElement('div', 'managed-store-row');
    const description = createElement('div', 'managed-store-copy');
    description.append(createElement('strong', '', store.name));
    description.append(createElement('span', '', `${store.handle} · ${store.category}`));
    const actions = createElement('div', 'managed-store-actions');
    const editButton = createElement('button', 'secondary-btn', 'Edit');
    editButton.type = 'button';
    editButton.dataset.editStore = store.id;
    const deleteButton = createElement('button', 'ghost-btn danger-btn', 'Delete');
    deleteButton.type = 'button';
    deleteButton.dataset.deleteStore = store.id;
    actions.append(editButton, deleteButton);
    row.append(description, actions);
    managedStoreList.append(row);
  });
};

const renderManagedPosts = () => {
  managedPostList.replaceChildren();
  const creatorPosts = discoverPosts.filter((post) => (
    post.ownerUid === auth.currentUser?.uid
  ));

  if (!creatorPosts.length) {
    managedPostList.append(createElement('p', 'empty-state', 'You have no posts to manage yet.'));
    return;
  }

  creatorPosts.forEach((post) => {
    const row = createElement('div', 'managed-post-row');
    const preview = post.mediaType.startsWith('video/')
      ? createElement('video', 'managed-post-preview')
      : createElement('img', 'managed-post-preview');
    preview.src = post.mediaData;
    if (preview.tagName === 'VIDEO') {
      preview.muted = true;
      preview.playsInline = true;
      preview.preload = 'metadata';
    } else {
      preview.alt = 'Post media preview';
    }

    const copy = createElement('div', 'managed-post-copy');
    copy.append(createElement('span', 'post-type-label', post.type === 'ad' ? 'Sponsored' : 'Creator post'));
    copy.append(createElement('p', '', post.caption));
    const deleteButton = createElement('button', 'ghost-btn danger-btn', 'Delete');
    deleteButton.type = 'button';
    deleteButton.dataset.deletePost = post.id;
    row.append(preview, copy, deleteButton);
    managedPostList.append(row);
  });
};

const readImageFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Unable to read image file'));
  reader.readAsDataURL(file);
});

const uploadDataUrl = async (path, dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const fileRef = ref(storage, path + '/' + crypto.randomUUID());
  await uploadBytes(fileRef, blob, { contentType: blob.type });
  return getDownloadURL(fileRef);
};

// Save each selected branding image immediately; failed writes never become local saved state.
const imageSaves = new Map();
const persistSelectedImage = ({ input, ownerUid, path, status, saveButton, commit, apply }) => {
  const file = input.files?.[0];
  if (!file || imageSaves.has(input)) return;
  if (auth.currentUser?.uid !== ownerUid) {
    status.textContent = 'Sign in as the owner to change this image.'; status.classList.add('error'); return;
  }
  if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
    status.textContent = 'Choose an image up to 2 MB.'; status.classList.add('error'); input.value = ''; return;
  }
  status.textContent = 'Saving image… Please wait before leaving this page.';
  status.classList.remove('error');
  input.disabled = true;
  if (saveButton) saveButton.disabled = true;
  const operation = (async () => {
    try {
      const data = await readImageFile(file);
      const url = await uploadDataUrl(path, data);
      await commit(url);
      apply(url);
      input.value = '';
      status.textContent = 'Image saved.';
      status.classList.remove('error');
    } catch (error) {
      input.value = '';
      status.textContent = 'Image was not saved: ' + error.message + '. Check Firebase Storage setup and rules, then select the image again.';
      status.classList.add('error');
    } finally {
      input.disabled = false;
      imageSaves.delete(input);
      if (saveButton && !Array.from(imageSaves.keys()).some(other => other.form === input.form)) saveButton.disabled = false;
    }
  })();
  imageSaves.set(input, operation);
  return operation;
};
window.addEventListener('beforeunload', event => {
  if (imageSaves.size) { event.preventDefault(); event.returnValue = ''; }
});

const uploadMediaItem = async (storeId, item, index) => ({
  ...item,
  data: await uploadDataUrl(
    `users/${auth.currentUser.uid}/stores/${storeId}/media/${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`}`,
    item.data
  )
});

let templatePreviewUrls = [];

const renderStoreTemplateMedia = (mediaItems) => {
  templatePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
  templatePreviewUrls = [];
  storeTemplateMediaPreview.replaceChildren();

  mediaItems.slice(0, 6).forEach((item) => {
    const isFile = item instanceof File;
    const type = isFile ? item.type : item.type;
    const src = isFile ? URL.createObjectURL(item) : item.data;
    if (isFile) templatePreviewUrls.push(src);
    const preview = createElement('div', 'template-media-item');
    const mediaElement = createElement(type.startsWith('video/') ? 'video' : 'img');
    mediaElement.src = src;
    if (mediaElement.tagName === 'VIDEO') {
      mediaElement.muted = true;
      mediaElement.playsInline = true;
      mediaElement.controls = true;
    } else {
      mediaElement.alt = 'Storefront media preview';
    }
    preview.append(mediaElement);
    storeTemplateMediaPreview.append(preview);
  });
};

const openStoreTemplate = (store) => {
  editingStoreId = store.id;
  isManagingStorefront = false;
  closeModal(storeModal);
  closeModal(manageStoresModal);
  closeModal(storeDetailModal);
  renderStorefrontPage(store);
  openModal(storeTemplateModal);
};

const requireAuth = (mode = 'signin') => {
  if (isAuthenticated) return true;
  openModal(loginModal);
  setAuthMode(mode);
  return false;
};

const prepareNewStore = () => {
  if (!requireAuth('signup')) return;
  editingStoreId = null;
  storeForm.reset();
  storeModalTitle.textContent = 'Name your storefront';
  storeSubmitButton.textContent = 'Continue';
  openModal(storeModal);
};

const openPostComposer = () => {
  if (!requireAuth('signup')) return;

  renderPostStoreOptions();
  postUploadStatus.textContent = '';
  postUploadStatus.classList.remove('error');
  openModal(createPostModal);
};

if (postForm) {
  postForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(postForm);
    const mediaFile = formData.get('media');

    if (!mediaFile?.size || mediaFile.size > 2 * 1024 * 1024) {
      postUploadStatus.textContent = 'Choose a media file up to 2 MB.';
      postUploadStatus.classList.add('error');
      return;
    }

    if (!mediaFile.type.startsWith('image/') && !['video/mp4', 'video/webm'].includes(mediaFile.type)) {
      postUploadStatus.textContent = 'Use an image, MP4, or WebM video.';
      postUploadStatus.classList.add('error');
      return;
    }

    try {
      const postRef = doc(collection(db, 'posts'));
      const mediaRef = ref(storage, `users/${auth.currentUser.uid}/posts/${postRef.id}/media`);
      await uploadBytes(mediaRef, mediaFile, { contentType: mediaFile.type });
      const mediaData = await getDownloadURL(mediaRef);
      discoverPosts.unshift({
        id: postRef.id,
        type: formData.get('postType').toString(),
        caption: formData.get('caption').toString().trim(),
        mediaType: mediaFile.type,
        mediaData,
        storeId: formData.get('storeId').toString(),
        creatorUsername: currentProfile?.username || '',
        ownerUid: auth.currentUser.uid,
        liked: false,
        likes: 0,
        createdAt: new Date().toISOString()
      });
      await saveDiscoverPosts();
      activeFeedFilter = 'all';
      document.querySelectorAll('[data-feed-filter]').forEach((button) => {
        button.classList.toggle('active', button.dataset.feedFilter === 'all');
      });
      renderDiscoverFeed();
      if (activeStorefrontId) {
        const activeStore = stores.find((item) => item.id === activeStorefrontId);
        if (activeStore && !storeTemplateModal.classList.contains('hidden')) renderStorefrontPage(activeStore);
      }
      postForm.reset();
      closeModal(createPostModal);
    } catch (error) {
      postUploadStatus.textContent = `Unable to save post: ${error.message}`;
      postUploadStatus.classList.add('error');
    }
  });
}

discoverFeed.addEventListener('click', (event) => {
  const openStoreButton = event.target.closest('[data-open-store-id]');
  if (openStoreButton) {
    const store = stores.find((item) => item.id === openStoreButton.dataset.openStoreId);
    if (store) openStoreTemplate(store);
    return;
  }

  const shopButton = event.target.closest('[data-shop-store-id]');
  if (shopButton) {
    const store = stores.find((item) => item.id === shopButton.dataset.shopStoreId);
    if (store) openStoreTemplate(store);
    return;
  }

  const likeButton = event.target.closest('[data-like-post-id]');
  if (!likeButton) return;
  const post = discoverPosts.find((item) => item.id === likeButton.dataset.likePostId);
  if (!post) return;
  if (!requireAuth('signin')) return;

  post.liked = !post.liked;
  post.likes = Math.max(0, (post.likes || 0) + (post.liked ? 1 : -1));
  likeButton.classList.toggle('is-liked', post.liked);
  likeButton.setAttribute('aria-pressed', String(post.liked));
  likeButton.setAttribute('aria-label', post.liked ? 'Unlike post' : 'Like post');
  likeButton.querySelector('.post-like-icon').textContent = post.liked ? '♥' : '♡';
  likeButton.querySelector('.post-like-count').textContent = String(post.likes);
  updateDoc(doc(db, 'posts', post.id), { liked: post.liked, likes: post.likes }).catch(showCloudError);
  saveDiscoverPosts();
});

let postWheelScrollLocked = false;
discoverFeed.addEventListener('wheel', (event) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(event.deltaY) < 24) return;
  const cards = Array.from(discoverFeed.children)
    .filter((child) => child.matches('.discover-post, .discover-service-card, .empty-feed-card'));
  if (cards.length < 2) return;

  if (postWheelScrollLocked) {
    event.preventDefault();
    return;
  }

  const feedTop = discoverFeed.getBoundingClientRect().top;
  const currentIndex = cards.reduce((closestIndex, card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().top - feedTop);
    const closestDistance = Math.abs(cards[closestIndex].getBoundingClientRect().top - feedTop);
    return distance < closestDistance ? index : closestIndex;
  }, 0);
  const nextIndex = currentIndex + Math.sign(event.deltaY);
  if (!cards[nextIndex]) return;

  event.preventDefault();
  const targetTop = discoverFeed.scrollTop
    + cards[nextIndex].getBoundingClientRect().top
    - feedTop;
  postWheelScrollLocked = true;
  discoverFeed.scrollTo({ top: targetTop, behavior: 'smooth' });
  window.setTimeout(() => { postWheelScrollLocked = false; }, 650);
}, { passive: false });

const prepareStoreEdit = (store) => {
  openStoreTemplate(store);
};

const setAuthenticated = (profile) => {
  isAuthenticated = true;
  currentProfile = profile;
  clearCloudStatus();
  document.getElementById('loginButton').classList.add('hidden');
  document.getElementById('logoutButton').classList.remove('hidden');
  document.getElementById('accountButton').classList.remove('hidden');
  document.getElementById('manageStoresButton').classList.remove('hidden');
  document.getElementById('managePostsButton').classList.remove('hidden');
  const isCreator = currentProfile.accountType !== 'shopper';
  ['newStoreButton', 'newStoreMiniButton', 'openPostModalButton', 'createPostButton', 'feedCreatePost']
    .forEach((id) => document.getElementById(id)?.classList.toggle('hidden', !isCreator));
  renderProfileArea();
  renderManagedStores();
  renderManagedPosts();
};

const setLoggedOut = () => {
  isAuthenticated = false;
  currentProfile = null;
  if (activeChatUnsubscribe) {
    activeChatUnsubscribe();
    activeChatUnsubscribe = null;
  }
  activeChatConversationId = null;
  if (roomPage && !roomPage.classList.contains('hidden')) {
    roomMemberHint.textContent = 'Sign in to send messages';
    manageRoomButton.classList.add('hidden');
    roomManager.classList.add('hidden');
    isManagingRoom = false;
  }
  try {
    localStorage.removeItem(profileStorageKey);
    localStorage.removeItem('aethelWelcomeSeen');
  } catch {}
  document.getElementById('loginButton').classList.remove('hidden');
  document.getElementById('logoutButton').classList.add('hidden');
  document.getElementById('accountButton').classList.add('hidden');
  document.getElementById('manageStoresButton').classList.add('hidden');
  document.getElementById('managePostsButton').classList.add('hidden');
  ['newStoreButton', 'newStoreMiniButton', 'openPostModalButton', 'createPostButton', 'feedCreatePost']
    .forEach((id) => document.getElementById(id)?.classList.add('hidden'));
  renderProfileArea();
  if (activeStorefrontId) {
    const activeStore = stores.find((item) => item.id === activeStorefrontId);
    if (activeStore) renderStorefrontPage(activeStore);
  }
};

const openAccountSettings = () => {
  if (!requireAuth('signin')) return;
  accountForm.elements.country.value = currentProfile?.country || '';
  updateAccountCurrency(currentProfile?.sellerCurrency || '');
  accountForm.elements.fullName.value = currentProfile?.fullName || '';
  accountForm.elements.username.value = currentProfile?.username || '';
  accountForm.elements.email.value = currentProfile?.email || '';
  accountForm.elements.role.value = currentProfile?.role || 'Web designer';
  accountForm.elements.focus.value = currentProfile?.focus || 'Landing pages';
  profileSocialLinkFields.replaceChildren();
  const socialUrls = getProfileSocialUrls(currentProfile);
  (socialUrls.length ? socialUrls : ['']).forEach((url) => addSocialLinkInput(url, profileSocialLinkFields));
  document.getElementById('accountSaveStatus').textContent = '';
  passwordResetForm.reset();
  passwordResetStatus.textContent = '';
  openModal(accountModal);
};

const setAuthMode = (mode) => {
  const isSignup = mode === 'signup';

  if (authTitle) {
    authTitle.textContent = isSignup
      ? `Join Coriva as a ${pendingAccountType}`
      : 'Welcome back';
  }

  if (isSignup) signupAccountTypeInput.value = pendingAccountType;
  if (authFooterText) {
    authFooterText.innerHTML = isSignup
      ? 'Already have an account? <a href="#" id="loginModeLink">Sign in</a>'
      : 'Need an account? <a href="#" id="createAccountLink">Create one</a>';
  }

  const signInPanel = document.getElementById('loginForm');
  const signUpPanel = document.getElementById('signupForm');

  if (signInPanel) signInPanel.classList.toggle('hidden', isSignup);
  if (signUpPanel) signUpPanel.classList.toggle('hidden', !isSignup);

  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authMode === mode;
    tab.classList.toggle('active', isActive);
  });

  const footerLink = document.getElementById(isSignup ? 'loginModeLink' : 'createAccountLink');
  if (footerLink) {
    footerLink.addEventListener('click', (event) => {
      event.preventDefault();
      setAuthMode(isSignup ? 'signin' : 'signup');
    });
  }
};

const bindLoginModal = () => {
  if (closeLoginModal) {
    closeLoginModal.addEventListener('click', () => closeModal(loginModal));
  }

  if (loginModal) {
    loginModal.addEventListener('click', (event) => {
      if (event.target === loginModal) closeModal(loginModal);
    });
  }

  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
  });

  topActions.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.id === 'loginButton') {
      openModal(loginModal);
      setAuthMode('signin');
    } else if (button.id === 'logoutButton') {
      signOut(auth).catch(showCloudError);
    } else if (button.id === 'accountButton') {
      openAccountSettings();
    } else if (button.id === 'manageStoresButton') {
      if (!requireAuth('signin')) return;
      renderManagedStores();
      openModal(manageStoresModal);
    } else if (button.id === 'managePostsButton') {
      if (!requireAuth('signin')) return;
      renderManagedPosts();
      openModal(managePostsModal);
    } else if (button.id === 'newStoreButton') {
      prepareNewStore();
    }
  });

  document.querySelectorAll('[data-welcome-type]').forEach((button) => {
    button.addEventListener('click', () => {
      setSignupAccountType(button.dataset.welcomeType);
      try {
        localStorage.setItem('aethelWelcomeSeen', 'true');
      } catch {}
      closeModal(firstVisitWelcome);
      openModal(loginModal);
      setAuthMode('signup');
    });
  });

  document.querySelectorAll('[data-signup-type]').forEach((button) => {
    button.addEventListener('click', () => setSignupAccountType(button.dataset.signupType));
  });

  document.getElementById('addProfileSocialLink').addEventListener('click', () => addSocialLinkInput());
  profileLoginButton.addEventListener('click', () => {
    openModal(loginModal);
    setAuthMode('signin');
  });
  profileEditButton.addEventListener('click', openAccountSettings);
  becomeCreatorButton.addEventListener('click', () => {
    currentProfile = {
      ...currentProfile,
      accountType: 'creator',
      role: currentProfile.role || 'Web designer',
      focus: currentProfile.focus || 'Landing pages'
    };
    saveProfile().catch(showCloudError);
    setAuthenticated(currentProfile);
    prepareNewStore();
  });
  document.getElementById('closePostModal').addEventListener('click', () => closeModal(createPostModal));
  document.getElementById('closeStoreChat').addEventListener('click', () => closeModal(storeChatModal));
  document.getElementById('closeStoreChat').addEventListener('click', () => closeModal(storeChatModal));
  document.getElementById('addStoreSocialLink').addEventListener('click', () => {
    addSocialLinkInput('', storeTemplateSocialLinks);
  });
  document.getElementById('newRoomButton').addEventListener('click', () => {
    if (!requireAuth('signin')) return;
    createRoomStatus.textContent = '';
    createRoomStatus.classList.remove('error');
    createRoomForm.reset();
    openModal(createRoomModal);
  });
  document.getElementById('closeCreateRoom').addEventListener('click', () => closeModal(createRoomModal));
  createRoomModal.addEventListener('click', (event) => {
    if (event.target === createRoomModal) closeModal(createRoomModal);
  });
  roomMessageInput.addEventListener('paste', async (event) => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;
    const gifUrl = getPastedRoomGifUrl(clipboardData);
    if (gifUrl) {
      event.preventDefault();
      selectedRoomGif = { url: gifUrl, title: 'Pasted GIF' };
      roomSelectedGifImage.src = gifUrl;
      roomSelectedGifStatus.textContent = 'GIF ready to send';
      roomSelectedGif.classList.remove('hidden');
      return;
    }

    const clipboardFiles = [
      ...Array.from(clipboardData.files || []),
      ...Array.from(clipboardData.items || [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter(Boolean)
    ];
    const gifFile = clipboardFiles.find((file) => file.type === 'image/gif');
    if (!gifFile) return;
    event.preventDefault();
    if (!auth.currentUser) {
      requireAuth('signin');
      return;
    }
    if (gifFile.size > 2 * 1024 * 1024) {
      roomStatus.textContent = 'GIFs must be 2 MB or smaller.';
      roomStatus.classList.add('error');
      return;
    }

    const pendingGif = { url: '', title: 'Pasted GIF', uploading: true };
    selectedRoomGif = pendingGif;
    roomSelectedGifImage.removeAttribute('src');
    roomSelectedGifStatus.textContent = 'Adding GIF...';
    roomSelectedGif.classList.remove('hidden');
    try {
      const gifRef = ref(storage, `users/${auth.currentUser.uid}/chat-gifs/${crypto.randomUUID()}.gif`);
      await uploadBytes(gifRef, gifFile, { contentType: 'image/gif' });
      pendingGif.url = await getDownloadURL(gifRef);
      pendingGif.uploading = false;
      if (selectedRoomGif === pendingGif) {
        roomSelectedGifImage.src = pendingGif.url;
        roomSelectedGifStatus.textContent = 'GIF ready to send';
      }
    } catch (error) {
      if (selectedRoomGif === pendingGif) {
        selectedRoomGif = null;
        roomSelectedGif.classList.add('hidden');
      }
      roomStatus.textContent = `Unable to add GIF: ${error.message}`;
      roomStatus.classList.add('error');
    }
  });
  document.getElementById('removeRoomGif').addEventListener('click', () => {
    selectedRoomGif = null;
    roomSelectedGif.classList.add('hidden');
    roomSelectedGifImage.removeAttribute('src');
  });
  roomList.addEventListener('click', (event) => {
    const card = event.target.closest('[data-room-id]');
    const room = rooms.find((item) => item.id === card?.dataset.roomId);
    if (room) openRoomPage(room);
  });
  document.getElementById('closeRoomPage').addEventListener('click', () => {
    roomPage.classList.add('hidden');
    roomPage.setAttribute('aria-hidden', 'true');
    if (activeRoomMessageUnsubscribe) {
      activeRoomMessageUnsubscribe();
      activeRoomMessageUnsubscribe = null;
    }
    activeRoomId = null;
  });
  manageRoomButton.addEventListener('click', () => {
    const room = rooms.find((item) => item.id === activeRoomId);
    if (!room || !auth.currentUser || room.ownerUid !== auth.currentUser.uid) return;
    isManagingRoom = !isManagingRoom;
    roomManager.classList.toggle('hidden', !isManagingRoom);
    manageRoomButton.setAttribute('aria-expanded', String(isManagingRoom));
    manageRoomButton.textContent = isManagingRoom ? 'Done managing' : 'Manage room';
  });
  deleteRoomButton.addEventListener('click', () => {
    const room = rooms.find((item) => item.id === activeRoomId);
    if (!room || !auth.currentUser || room.ownerUid !== auth.currentUser.uid) return;
    deleteRoomStatus.textContent = '';
    deleteRoomStatus.classList.remove('error');
    confirmDeleteRoomButton.disabled = false;
    openModal(deleteRoomConfirmModal);
  });
  document.getElementById('cancelDeleteRoom').addEventListener('click', () => {
    closeModal(deleteRoomConfirmModal);
  });
  deleteRoomConfirmModal.addEventListener('click', (event) => {
    if (event.target === deleteRoomConfirmModal) closeModal(deleteRoomConfirmModal);
  });
  confirmDeleteRoomButton.addEventListener('click', async () => {
    const room = rooms.find((item) => item.id === activeRoomId);
    if (!room || !auth.currentUser || room.ownerUid !== auth.currentUser.uid) {
      closeModal(deleteRoomConfirmModal);
      return;
    }
    confirmDeleteRoomButton.disabled = true;
    deleteRoomStatus.textContent = 'Deleting chat room...';
    deleteRoomStatus.classList.remove('error');
    try {
      const messages = await getDocs(collection(db, 'rooms', room.id, 'messages'));
      for (let offset = 0; offset < messages.docs.length; offset += 400) {
        const batch = writeBatch(db);
        messages.docs.slice(offset, offset + 400).forEach((message) => batch.delete(message.ref));
        await batch.commit();
      }
      if (room.banner) {
        await deleteObject(ref(storage, `users/${auth.currentUser.uid}/rooms/${room.id}/banner`));
      }
      await deleteDoc(doc(db, 'rooms', room.id));
      rooms = rooms.filter((item) => item.id !== room.id);
      if (activeRoomMessageUnsubscribe) {
        activeRoomMessageUnsubscribe();
        activeRoomMessageUnsubscribe = null;
      }
      activeRoomId = null;
      isManagingRoom = false;
      roomPage.classList.add('hidden');
      roomPage.setAttribute('aria-hidden', 'true');
      closeModal(deleteRoomConfirmModal);
      renderRooms();
      renderDiscoverFeed();
    } catch (error) {
      deleteRoomStatus.textContent = `Unable to delete chat room: ${error.message}`;
      deleteRoomStatus.classList.add('error');
      confirmDeleteRoomButton.disabled = false;
    }
  });
  roomBannerInput.addEventListener('change', () => {
    const room = rooms.find(item => item.id === activeRoomId);
    if (!room) return;
    persistSelectedImage({
      input: roomBannerInput, ownerUid: room.ownerUid,
      path: 'users/' + room.ownerUid + '/rooms/' + room.id + '/banner',
      status: roomStatus, saveButton: saveRoomSettingsButton,
      commit: url => updateDoc(doc(db, 'rooms', room.id), { banner: url, updatedAt: serverTimestamp() }),
      apply: url => {
        rooms = rooms.map(item => item.id === room.id ? { ...item, banner: url } : item);
        if (activeRoomId === room.id) { roomBanner.src = url; roomBanner.classList.remove('hidden'); roomHero.classList.add('has-banner'); }
        renderRooms();
      }
    });
  });
  saveRoomSettingsButton.addEventListener('click', async () => {
    await Promise.all(imageSaves.values());
    const room = rooms.find((item) => item.id === activeRoomId);
    if (!room || !auth.currentUser || room.ownerUid !== auth.currentUser.uid) return;
    const title = roomTitleInput.value.trim();
    if (!title) {
      roomStatus.textContent = 'Add a title for this chat room.';
      roomStatus.classList.add('error');
      roomTitleInput.focus();
      return;
    }
    const bannerFile = roomBannerInput.files?.[0];
    try {
      const banner = bannerFile
        ? await uploadDataUrl(
            `users/${auth.currentUser.uid}/rooms/${room.id}/banner`,
            await readImageFile(bannerFile)
          )
        : room.banner || '';
      const updatedRoom = {
        ...room,
        title,
        description: roomDescriptionInput.value.trim(),
        banner,
        updatedAt: serverTimestamp()
      };
      await updateDoc(doc(db, 'rooms', room.id), {
        title: updatedRoom.title,
        description: updatedRoom.description,
        banner: updatedRoom.banner,
        updatedAt: updatedRoom.updatedAt
      });
      rooms = rooms.map((item) => item.id === room.id ? updatedRoom : item);
      roomBannerInput.value = '';
      roomStatus.textContent = 'Room settings saved.';
      roomStatus.classList.remove('error');
      renderRooms();
      openRoomPage(updatedRoom);
      isManagingRoom = true;
      roomManager.classList.remove('hidden');
      manageRoomButton.textContent = 'Done managing';
      manageRoomButton.setAttribute('aria-expanded', 'true');
    } catch (error) {
      roomStatus.textContent = `Unable to save room settings: ${error.message}`;
      roomStatus.classList.add('error');
    }
  });
  createRoomForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireAuth('signin')) return;
    const user = auth.currentUser;
    if (!user) {
      createRoomStatus.textContent = 'Sign in to make a chat room.';
      createRoomStatus.classList.add('error');
      return;
    }
    const formData = new FormData(createRoomForm);
    const title = formData.get('title').toString().trim();
    if (!title) {
      createRoomStatus.textContent = 'Add a title for this chat room.';
      createRoomStatus.classList.add('error');
      return;
    }
    const roomRef = doc(collection(db, 'rooms'));
    const room = {
      id: roomRef.id,
      title,
      description: formData.get('description').toString().trim(),
      banner: '',
      ownerUid: user.uid,
      creatorUsername: currentProfile.username || '',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(roomRef, { ...room, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      rooms = [room, ...rooms.filter((item) => item.id !== room.id)];
      renderRooms();
      openRoomPage(room);
    } catch (error) {
      createRoomStatus.textContent = `Unable to create chat room: ${error.message}`;
      createRoomStatus.classList.add('error');
    }
  });
  roomMessageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireAuth('signin')) return;
    if (!activeRoomId || !auth.currentUser) return;
    const text = roomMessageInput.value.trim();
    if (!text && !selectedRoomGif) return;
    if (selectedRoomGif?.uploading) {
      roomStatus.textContent = 'Wait for the GIF to finish uploading.';
      roomStatus.classList.add('error');
      return;
    }
    try {
      await addDoc(collection(db, 'rooms', activeRoomId, 'messages'), {
        senderUid: auth.currentUser.uid,
        senderUsername: currentProfile?.username || 'Coriva member',
        text,
        ...(selectedRoomGif ? {
          gifUrl: selectedRoomGif.url,
          gifTitle: selectedRoomGif.title || 'Pasted GIF'
        } : {}),
        createdAt: serverTimestamp()
      });
      roomMessageForm.reset();
      selectedRoomGif = null;
      roomSelectedGif.classList.add('hidden');
      roomSelectedGifImage.removeAttribute('src');
      roomSelectedGifStatus.textContent = 'GIF ready to send';
    } catch (error) {
      roomStatus.textContent = `Unable to send message: ${error.message}`;
      roomStatus.classList.add('error');
    }
  });
  [createPostModal, storeTemplateModal].forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.querySelectorAll('#openPostModalButton, #createPostButton, #feedCreatePost').forEach((button) => {
    button.addEventListener('click', openPostComposer);
  });
  closeStoreTemplate.addEventListener('click', () => closeModal(storeTemplateModal));
  manageStorefrontButton.addEventListener('click', () => {
    const store = stores.find((item) => item.id === activeStorefrontId);
    const isOwner = Boolean(
      store
      && isAuthenticated
      && auth.currentUser
      && store.ownerUid === auth.currentUser.uid
    );
    if (!isOwner) return;
    isManagingStorefront = !isManagingStorefront;
    document.querySelector('.storefront-editor').classList.toggle('hidden', !isManagingStorefront);
    storefrontCreatePost.classList.toggle('hidden', !isManagingStorefront);
    manageStorefrontButton.setAttribute('aria-expanded', String(isManagingStorefront));
    manageStorefrontButton.textContent = isManagingStorefront ? 'Done managing' : 'Manage storefront';
  });
  storefrontBioAction.addEventListener('click', () => {
    const isOpening = storefrontBioEditor.classList.contains('hidden');
    storefrontBioEditor.classList.toggle('hidden', !isOpening);
    storefrontBioAction.setAttribute('aria-expanded', String(isOpening));
    storefrontBioAction.querySelector('.upload-plus').textContent = isOpening ? '−' : '+';
    storefrontBioActionLabel.textContent = isOpening
      ? 'Close Bio Editor'
      : storeTemplateForm.elements.storeBio.value.trim() ? 'Edit Bio' : 'Add Bio';
    if (isOpening) storeTemplateForm.elements.storeBio.focus();
  });
  storeTemplateForm.elements.storeBio.addEventListener('input', (event) => {
    storefrontBio.textContent = event.currentTarget.value.trim() || 'This creator has not added a bio yet.';
  });
  storefrontCreatePost.addEventListener('click', () => {
    const store = stores.find((item) => item.id === activeStorefrontId);
    if (!store || !requireAuth('signup')) return;
    openPostComposer();
    postStorefrontSelect.value = store.id;
  });

  discoverSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    discoverSearchQuery = discoverSearchInput.value.trim().toLowerCase();
    renderDiscoverFeed();
  });
  discoverSearchInput.addEventListener('input', () => {
    discoverSearchQuery = discoverSearchInput.value.trim().toLowerCase();
    renderDiscoverFeed();
  });
  clearDiscoverSearch.addEventListener('click', () => {
    discoverSearchInput.value = '';
    discoverSearchQuery = '';
    renderDiscoverFeed();
    discoverSearchInput.focus();
  });

  document.querySelectorAll('[data-feed-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFeedFilter = button.dataset.feedFilter;
      document.querySelectorAll('[data-feed-filter]').forEach((filterButton) => {
        filterButton.classList.toggle('active', filterButton === button);
      });
      renderDiscoverFeed();
    });
  });

  document.getElementById('closeStoreDetail').addEventListener('click', () => closeModal(storeDetailModal));
  document.getElementById('closeManageStores').addEventListener('click', () => closeModal(manageStoresModal));
  document.getElementById('closeManagePosts').addEventListener('click', () => closeModal(managePostsModal));
  document.getElementById('closeAccount').addEventListener('click', () => closeModal(accountModal));

  [storeDetailModal, storeChatModal, manageStoresModal, managePostsModal, accountModal].forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });
};

const bindStoreModal = () => {
  const openerButtons = document.querySelectorAll('#newStoreMiniButton, #feedCreateStore');
  openerButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!requireAuth('signup')) return;
      prepareNewStore();
    });
  });

  if (closeStoreModal) {
    closeStoreModal.addEventListener('click', () => closeModal(storeModal));
  }

  if (storeModal) {
    storeModal.addEventListener('click', (event) => {
      if (event.target === storeModal) closeModal(storeModal);
    });
  }
};

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;
    authStatus.textContent = '';
    authStatus.classList.add('hidden');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal(loginModal);
      clearCloudStatus();
    } catch (error) {
      authStatus.textContent = getAuthErrorMessage(error, 'sign in');
      authStatus.classList.remove('hidden');
    }
  });
}

if (signupForm) {
  const signupPasswordInput = document.getElementById('signupPassword');
  const signupConfirmPasswordInput = document.getElementById('signupConfirmPassword');
  const passwordMatchMessage = document.getElementById('passwordMatchMessage');

  const validateSignupPasswordMatch = () => {
    if (!signupPasswordInput || !signupConfirmPasswordInput) return true;

    const hasMismatch = signupConfirmPasswordInput.value.length > 0
      && signupPasswordInput.value !== signupConfirmPasswordInput.value;
    signupConfirmPasswordInput.setCustomValidity(hasMismatch ? 'Passwords do not match' : '');
    signupConfirmPasswordInput.classList.toggle('password-mismatch', hasMismatch);
    signupConfirmPasswordInput.setAttribute('aria-invalid', String(hasMismatch));

    if (passwordMatchMessage) {
      passwordMatchMessage.textContent = hasMismatch ? 'Passwords do not match.' : '';
      passwordMatchMessage.classList.toggle('hidden', !hasMismatch);
    }

    return !hasMismatch;
  };

  if (signupPasswordInput && signupConfirmPasswordInput) {
    signupPasswordInput.addEventListener('input', validateSignupPasswordMatch);
    signupConfirmPasswordInput.addEventListener('input', validateSignupPasswordMatch);
  }

  signupForm.addEventListener('submit', async (event) => {
    if (!validateSignupPasswordMatch()) {
      event.preventDefault();
      signupConfirmPasswordInput?.reportValidity();
      return;
    }

    event.preventDefault();
    const formData = new FormData(signupForm);
    const profile = {
      fullName: formData.get('fullName').toString().trim(),
      username: formData.get('username').toString().trim(),
      email: formData.get('email').toString().trim(),
      role: formData.get('accountType') === 'creator' ? formData.get('role').toString() : '',
      focus: formData.get('accountType') === 'creator' ? formData.get('focus').toString() : '',
      accountType: formData.get('accountType').toString(),
      socialLinks: [],
      profilePicture: ''
    };
    authStatus.textContent = '';
    authStatus.classList.add('hidden');
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        profile.email,
        formData.get('password').toString()
      );
      currentProfile = { ...profile, uid: credential.user.uid };
      await saveProfile();
      setAuthenticated(currentProfile);
      closeModal(loginModal);
      clearCloudStatus();
    } catch (error) {
      authStatus.textContent = getAuthErrorMessage(error, 'create your account');
      authStatus.classList.remove('hidden');
    }
  });
}

if (accountForm) {
  accountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await Promise.all(imageSaves.values());
    const formData = new FormData(accountForm);
    const socialInputs = Array.from(accountForm.querySelectorAll('.profile-social-input'));
    const invalidSocialInput = socialInputs.find((input) => input.value.trim() && !getSocialService(input.value));
    const saveStatus = document.getElementById('accountSaveStatus');

    if (invalidSocialInput) {
      invalidSocialInput.setCustomValidity('Enter a valid HTTP or HTTPS profile URL.');
      invalidSocialInput.reportValidity();
      return;
    }

    const photoFile = formData.get('profilePicture');
    if (photoFile?.size > 2 * 1024 * 1024) {
      saveStatus.textContent = 'Profile photos must be 2 MB or smaller.';
      saveStatus.classList.add('error');
      return;
    }

    try {
      const profileImage = photoFile?.size
        ? await readImageFile(photoFile)
        : currentProfile?.profilePicture || '';
      const profilePicture = await uploadDataUrl(
        `users/${auth.currentUser.uid}/profile/avatar`,
        profileImage
      );
      currentProfile = {
        ...currentProfile,
        country: accountForm.elements.country.value,
        sellerCurrency: accountForm.elements.sellerCurrency.value,
        fullName: formData.get('fullName').toString().trim(),
        username: formData.get('username').toString().trim(),
        email: formData.get('email').toString().trim(),
        role: formData.get('role').toString(),
        focus: formData.get('focus').toString(),
        socialLinks: socialInputs
          .map((input) => input.value.trim())
          .filter(Boolean)
          .map((url) => new URL(url).href),
        profilePicture
      };
      await saveProfile();
      renderProfileArea();
      document.getElementById('profilePictureInput').value = '';
      saveStatus.textContent = 'Profile saved.';
      saveStatus.classList.remove('error');
    } catch (error) {
      saveStatus.textContent = `Unable to save profile: ${error.message}`;
      saveStatus.classList.add('error');
    }
  });
}

if (passwordResetForm) {
  const newPasswordInput = passwordResetForm.elements.newPassword;
  const confirmPasswordInput = passwordResetForm.elements.confirmPassword;
  const validateNewPassword = () => {
    const hasMismatch = confirmPasswordInput.value.length > 0
      && newPasswordInput.value !== confirmPasswordInput.value;
    confirmPasswordInput.setCustomValidity(hasMismatch ? 'New passwords do not match' : '');
    passwordResetStatus.textContent = hasMismatch ? 'New passwords do not match.' : '';
    passwordResetStatus.classList.toggle('error', hasMismatch);
    return !hasMismatch;
  };

  newPasswordInput.addEventListener('input', validateNewPassword);
  confirmPasswordInput.addEventListener('input', validateNewPassword);
  passwordResetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateNewPassword()) {
      confirmPasswordInput.reportValidity();
      return;
    }

    const user = auth.currentUser;
    if (!user?.email) {
      passwordResetStatus.textContent = 'Sign in again before changing your password.';
      passwordResetStatus.classList.add('error');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordResetForm.elements.currentPassword.value
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPasswordInput.value);
      passwordResetForm.reset();
      passwordResetStatus.textContent = 'Password updated.';
      passwordResetStatus.classList.remove('error');
    } catch (error) {
      passwordResetStatus.textContent = `Unable to update password: ${error.message}`;
      passwordResetStatus.classList.add('error');
    }
  });
}

storeList.addEventListener('click', (event) => {
  const card = event.target.closest('[data-store-id]');
  if (!card) return;
  const store = stores.find((item) => item.id === card.dataset.storeId);
  if (!store) return;
  openStoreTemplate(store);
});

storeDetailContent.addEventListener('click', (event) => {
  const messageButton = event.target.closest('[data-message-store-id]');
  if (!messageButton) return;
  const store = stores.find((item) => item.id === messageButton.dataset.messageStoreId);
  if (store) openStoreChat(store);
});

storefrontMessageButton.addEventListener('click', () => {
  const store = stores.find((item) => item.id === storefrontMessageButton.dataset.messageStoreId);
  if (store) openStoreChat(store);
});

storeChatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requireAuth('signin')) return;
  const message = storeChatForm.elements.message.value.trim();
  if (!message || !activeChatConversationId) return;

  addDoc(collection(db, 'chats', activeChatConversationId, 'messages'), {
    senderUid: auth.currentUser.uid,
    text: message,
    createdAt: serverTimestamp()
  }).then(() => {
    storeChatForm.reset();
  }).catch(showCloudError);
});

managedPostList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-post]');
  if (!deleteButton) return;
  const post = discoverPosts.find((item) => item.id === deleteButton.dataset.deletePost);
  if (!post || !window.confirm('Delete this post? This cannot be undone.')) return;

  discoverPosts = discoverPosts.filter((item) => item.id !== post.id);
  deleteDoc(doc(db, 'posts', post.id)).catch(showCloudError);
  saveDiscoverPosts();
  renderManagedPosts();
  renderDiscoverFeed();
});

managedStoreList.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-store]');
  if (editButton) {
    const store = stores.find((item) => item.id === editButton.dataset.editStore);
    if (store) prepareStoreEdit(store);
    return;
  }

  const deleteButton = event.target.closest('[data-delete-store]');
  if (!deleteButton) return;
  const store = stores.find((item) => item.id === deleteButton.dataset.deleteStore);
  if (!store || !window.confirm(`Delete "${store.name}"? This cannot be undone.`)) return;
  stores = stores.filter((item) => item.id !== store.id);
  deleteDoc(doc(db, 'stores', store.id)).catch(showCloudError);
  renderStores();
  renderManagedStores();
});

if (storeForm) {
  storeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireAuth('signup') || currentProfile?.accountType === 'shopper') return;
    const formData = new FormData(storeForm);
    const name = formData.get('storeName').toString().trim();
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    const handle = currentProfile?.username || `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`;
    const store = {
      id,
      name,
      handle,
      category: 'Web Design',
      bio: '',
      logo: '',
      banner: '',
      socialLinks: getProfileSocialUrls(currentProfile),
      media: [],
      projectImages: [],
      paymentApp: '',
      paymentHandle: '',
      qrValue: '',
      qrImage: '',
      ownerUid: auth.currentUser.uid,
      draft: true
    };

    stores.unshift(store);
    try {
      await saveStores([store]);
    } catch {
      stores = stores.filter((item) => item.id !== store.id);
      renderStores();
      showCloudError(new Error('Unable to save the new storefront.'));
      return;
    }
    renderStores();
    renderManagedStores();
    storeForm.reset();
    openStoreTemplate(store);
  });
}

storeTemplateMedia.addEventListener('change', () => {
  const files = Array.from(storeTemplateMedia.files || []);
  const hasInvalidFile = files.some((file) => (
    file.size > 2 * 1024 * 1024
    || (!file.type.startsWith('image/') && !['video/mp4', 'video/webm'].includes(file.type))
  ));

  if (files.length > 6 || hasInvalidFile) {
    storeTemplateStatus.textContent = 'Choose up to 6 images or MP4/WebM videos, each 2 MB or smaller.';
    storeTemplateStatus.classList.add('error');
    storeTemplateMedia.value = '';
    renderStoreTemplateMedia([]);
    return;
  }

  storeTemplateStatus.textContent = '';
  storeTemplateStatus.classList.remove('error');
  renderStoreTemplateMedia(files);
});

const previewStoreBrandImage = async (input, target, isLogo) => {
  const file = input.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
    storeTemplateStatus.textContent = 'Choose an image file up to 2 MB.';
    storeTemplateStatus.classList.add('error');
    input.value = '';
    return;
  }
  try {
    const data = await readImageFile(file);
    if (isLogo) {
      const image = createElement('img');
      image.src = data;
      image.alt = `${document.getElementById('storeTemplateTitle').textContent} logo`;
      target.replaceChildren(image);
    } else {
      target.src = data;
      target.classList.remove('hidden');
      storefrontHero.classList.add('has-banner');
    }
    storeTemplateStatus.textContent = '';
    storeTemplateStatus.classList.remove('error');
  } catch {
    storeTemplateStatus.textContent = 'Unable to read that image. Try another file.';
    storeTemplateStatus.classList.add('error');
  }
};

const saveStoreBrandImage = (input, field) => {
  const store = stores.find(item => item.id === activeStorefrontId);
  if (!store) return;
  persistSelectedImage({
    input, ownerUid: store.ownerUid,
    path: 'users/' + store.ownerUid + '/stores/' + store.id + '/branding/' + field,
    status: storeTemplateStatus, saveButton: document.getElementById('publishStoreTemplate'),
    commit: url => updateDoc(doc(db, 'stores', store.id), { [field]: url }),
    apply: url => {
      stores = stores.map(item => item.id === store.id ? { ...item, [field]: url } : item);
      if (activeStorefrontId === store.id) {
        if (field === 'logo') {
          const image = createElement('img'); image.src = url; image.alt = store.name + ' logo'; storefrontLogo.replaceChildren(image);
        } else { storefrontBanner.src = url; storefrontBanner.classList.remove('hidden'); storefrontHero.classList.add('has-banner'); }
      }
      renderStores(); renderManagedStores();
    }
  });
};
storeLogoInput.addEventListener('change', () => saveStoreBrandImage(storeLogoInput, 'logo'));
storeBannerInput.addEventListener('change', () => saveStoreBrandImage(storeBannerInput, 'banner'));

document.getElementById('profilePictureInput').addEventListener('change', () => {
  const user = auth.currentUser;
  if (!user) return;
  persistSelectedImage({
    input: document.getElementById('profilePictureInput'), ownerUid: user.uid,
    path: 'users/' + user.uid + '/profile/avatar',
    status: document.getElementById('accountSaveStatus'),
    saveButton: accountForm.querySelector('button[type="submit"]'),
    commit: url => setDoc(doc(db, 'profiles', user.uid), { profilePicture: url, updatedAt: serverTimestamp() }, { merge: true }),
    apply: url => { if (auth.currentUser?.uid === user.uid) { currentProfile = { ...currentProfile, profilePicture: url }; renderProfileArea(); } }
  });
});

storeTemplateForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await Promise.all(imageSaves.values());
  const store = stores.find((item) => item.id === editingStoreId);
  if (!store) return;
  if (
    !isAuthenticated
    || !auth.currentUser
    || auth.currentUser.uid !== store.ownerUid
  ) {
    storeTemplateStatus.textContent = 'Only the storefront creator can edit this page.';
    storeTemplateStatus.classList.add('error');
    return;
  }

  const socialInputs = Array.from(storeTemplateForm.querySelectorAll('.profile-social-input'));
  const invalidSocialInput = socialInputs.find((input) => input.value.trim() && !getSocialService(input.value));
  if (invalidSocialInput) {
    invalidSocialInput.setCustomValidity('Enter a valid HTTP or HTTPS social URL.');
    invalidSocialInput.reportValidity();
    return;
  }

  const files = Array.from(storeTemplateMedia.files || []);
  const logoFile = storeLogoInput.files?.[0];
  const bannerFile = storeBannerInput.files?.[0];
  if (
    files.length > 6
    || files.some((file) => file.size > 2 * 1024 * 1024)
    || [logoFile, bannerFile].some((file) => file && (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024))
  ) {
    storeTemplateStatus.textContent = 'Choose up to 6 media files and image branding files, all up to 2 MB each.';
    storeTemplateStatus.classList.add('error');
    return;
  }

  try {
    const selectedMedia = files.length
      ? await Promise.all(files.map(async (file) => ({ type: file.type, data: await readImageFile(file) })))
      : store.media?.length
        ? store.media
        : (store.projectImages || []).map((data) => ({ type: 'image/jpeg', data }));
    const media = await Promise.all(selectedMedia.map((item, index) => uploadMediaItem(store.id, item, index)));
    const [logo, banner] = await Promise.all([
      logoFile
        ? uploadDataUrl(`users/${auth.currentUser.uid}/stores/${store.id}/branding/logo`, await readImageFile(logoFile))
        : store.logo || '',
      bannerFile
        ? uploadDataUrl(`users/${auth.currentUser.uid}/stores/${store.id}/branding/banner`, await readImageFile(bannerFile))
        : store.banner || ''
    ]);
    const updatedStore = {
      ...store,
      bio: storeTemplateForm.elements.storeBio.value.trim(),
      logo,
      banner,
      socialLinks: socialInputs.map((input) => input.value.trim()).filter(Boolean).map((url) => new URL(url).href),
      media,
      projectImages: media.filter((item) => item.type.startsWith('image/')).map((item) => item.data),
      draft: false
    };

    await saveStores([updatedStore]);
    stores = stores.map((item) => item.id === updatedStore.id ? updatedStore : item);
    renderStores();
    renderManagedStores();
    renderPostStoreOptions();
    renderStorefrontPage(updatedStore);
  } catch (error) {
    storeTemplateStatus.textContent = `Unable to save storefront: ${error.message}`;
    storeTemplateStatus.classList.add('error');
  }
});


createInvoiceButton?.addEventListener('click', () => {
  try {
    openInvoiceEditor();
  } catch (error) {
    console.error('Unable to initialize invoice editor:', error);
    if (invoiceStatus) {
      invoiceStatus.textContent = `Invoice editor opened with limited initialization: ${error.message}`;
      invoiceStatus.classList.add('error');
    }
  }
});

createQuoteButton?.addEventListener('click', () => { try { openQuoteEditor(); } catch (error) { console.error(error); quoteStatus.textContent=`Quote editor opened with limited initialization: ${error.message}`; quoteStatus.classList.add('error'); } });
addQuoteItem?.addEventListener('click', () => addQuoteItemRow());
quoteForm?.addEventListener('input', updateQuoteTotalPreview);
quoteForm?.addEventListener('change', updateQuoteTotalPreview);
closeQuoteModal?.addEventListener('click', () => closeModal(quoteModal));
cancelQuote?.addEventListener('click', () => closeModal(quoteModal));
quoteForm?.addEventListener('submit', async (event) => {
  event.preventDefault(); quoteStatus.textContent=''; quoteStatus.classList.remove('error');
  try { const quote=collectQuoteForm(); if(!quote.customerName||!quote.quoteNumber||!quote.items.length) throw new Error('Add a customer, quote number, and at least one complete item.'); if(quote.taxRate<0||quote.taxRate>100) throw new Error('Tax must be between 0 and 100%.'); quoteStatus.textContent='Saving quote…'; const saved=await saveQuote(quote); quoteForm.elements.quoteId.value=saved.id; markJobDocumentSaved(quoteForm, saved); quoteStatus.textContent='Quote saved. Preparing PDF…'; try { await downloadQuotePdf(saved); } catch (error) { quoteStatus.textContent='Quote saved, but the PDF could not be downloaded: '+error.message; quoteStatus.classList.add('error'); } }
  catch(error){ quoteStatus.textContent=`Unable to save quote: ${error.message}`; quoteStatus.classList.add('error'); }
});

addInvoiceItem?.addEventListener('click', () => addInvoiceItemRow());
addPaymentMethod?.addEventListener('click', () => addPaymentMethodRow());
closeInvoiceModal?.addEventListener('click', () => closeModal(invoiceModal));
cancelInvoice?.addEventListener('click', () => closeModal(invoiceModal));

invoiceForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  invoiceStatus.textContent = '';
  invoiceStatus.classList.remove('error');
  try {
    const invoice = collectInvoiceForm();
    if (!invoice.customerName || !invoice.invoiceNumber || !invoice.items.length) {
      throw new Error('Add a customer, invoice number, and at least one complete item.');
    }
    if (invoice.taxRate < 0 || invoice.taxRate > 100) throw new Error('Tax must be between 0 and 100%.');
    for (const method of invoice.paymentMethods) {
      if (!/^https?:\/\//i.test(method.url)) throw new Error('Payment links must start with http:// or https://.');
    }
    invoiceStatus.textContent = 'Saving invoice…';
    const saved = await saveInvoice(invoice);
    invoiceForm.elements.invoiceId.value = saved.id;
    markJobDocumentSaved(invoiceForm, saved);
    try {
      invoiceStatus.textContent = 'Invoice saved. Preparing PDF…';
      await downloadInvoicePdf(saved);
    } catch (pdfError) {
      invoiceStatus.textContent = `Invoice saved, but the PDF could not be downloaded: ${pdfError.message}`;
      invoiceStatus.classList.add('error');
      return;
    }
  } catch (error) {
    invoiceStatus.textContent = `Unable to save invoice: ${error.message}`;
    invoiceStatus.classList.add('error');
  }
});


const markJobDocumentSaved = (form, record) => {
  form.savedJobDocument = record.jobId && form.dataset.jobId === record.jobId ? record : null;
  form.querySelector('.share-job-document').disabled = !form.savedJobDocument;
};
for (const form of [invoiceForm, quoteForm]) {
  const dirty = () => { form.savedJobDocument = null; form.querySelector('.share-job-document').disabled = true; };
  form.addEventListener('input', dirty);
  form.addEventListener('change', dirty);
  form.addEventListener('click', event => {
    if (event.target.closest('.invoice-remove-item, .payment-remove, .refresh-exchange, #addInvoiceItem, #addQuoteItem, #addPaymentMethod')) dirty();
  });
}
initJobs({
  requireAuth, openModal, closeModal,
  store: () => stores.find(store => store.id === activeStorefrontId),
  compose: (kind, job) => {
    const store = stores.find(item => item.id === job.storeId);
    if (!store) { window.alert('This storefront is unavailable.'); return; }
    activeStorefrontId = store.id;
    const form = kind === 'quotes' ? quoteForm : invoiceForm;
    if (kind === 'quotes') openQuoteEditor(); else openInvoiceEditor();
    form.dataset.jobId = job.id;
    form.elements.customerName.value = job.customerName;
    form.elements.customerEmail.value = job.customerEmail || '';
    form.elements.notes.value = 'Requested work: ' + job.description;
    form.querySelector('.share-job-document').classList.remove('hidden');
    form.querySelector('.share-job-document').disabled = true;
  },
  savedDocument: kind => (kind === 'quotes' ? quoteForm : invoiceForm).savedJobDocument,
  download: (kind, record, storeName, statusTarget) => {
    const options = { storeOverride: { id: record.storeId, name: storeName }, statusTarget };
    return kind === 'quotes' ? downloadQuotePdf(record, options) : downloadInvoicePdf(record, options);
  }
});

initializeAccountCountry();
bindCurrencyPicker(invoiceForm, updateInvoiceTotalPreview);
bindCurrencyPicker(quoteForm, updateQuoteTotalPreview);

bindLoginModal();
bindStoreModal();
renderStores();
renderDiscoverFeed();
setLoggedOut();

onSnapshot(collection(db, 'stores'), (snapshot) => {
  stores = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  renderStores();
  renderManagedStores();
  if (activeStorefrontId && !storeTemplateModal.classList.contains('hidden')) {
    const activeStore = stores.find((item) => item.id === activeStorefrontId);
    if (activeStore) renderStorefrontPage(activeStore);
  }
}, showCloudError);

onSnapshot(collection(db, 'posts'), (snapshot) => {
  discoverPosts = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => {
      const first = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const second = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return second - first;
    });
  renderDiscoverFeed();
  renderManagedPosts();
  if (activeStorefrontId && !storeTemplateModal.classList.contains('hidden')) {
    const activeStore = stores.find((item) => item.id === activeStorefrontId);
    if (activeStore) renderStorefrontPage(activeStore);
  }
}, showCloudError);

onSnapshot(collection(db, 'rooms'), (snapshot) => {
  rooms = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => {
      const first = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const second = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return second - first;
    });
  renderRooms();
  if (activeRoomId && !roomPage.classList.contains('hidden')) {
    const activeRoom = rooms.find((item) => item.id === activeRoomId);
    if (activeRoom) {
      const wasManaging = isManagingRoom;
      const isOwner = activeRoom.ownerUid === auth.currentUser?.uid;
      roomHero.classList.toggle('has-banner', Boolean(activeRoom.banner));
      roomBanner.classList.toggle('hidden', !activeRoom.banner);
      if (activeRoom.banner) roomBanner.src = activeRoom.banner;
      roomPageTitle.textContent = activeRoom.title || 'Untitled room';
      roomPageDescription.textContent = activeRoom.description || 'Join the conversation.';
      roomCreatorName.textContent = `Created by ${activeRoom.creatorUsername || 'Coriva creator'}`;
      manageRoomButton.classList.toggle('hidden', !isOwner);
      if (wasManaging && isOwner) {
        roomTitleInput.value = activeRoom.title || '';
        roomDescriptionInput.value = activeRoom.description || '';
        isManagingRoom = true;
        roomManager.classList.remove('hidden');
        manageRoomButton.textContent = 'Done managing';
        manageRoomButton.setAttribute('aria-expanded', 'true');
      } else {
        isManagingRoom = false;
        roomManager.classList.add('hidden');
        manageRoomButton.textContent = 'Manage room';
        manageRoomButton.setAttribute('aria-expanded', 'false');
      }
    }
  }
}, showCloudError);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    setLoggedOut();
    if (activeRoomId) renderRoomMessages();
    if (!readStoredValue('aethelWelcomeSeen', false)) openModal(firstVisitWelcome);
    return;
  }
  try {
    const profileSnapshot = await getDoc(doc(db, 'profiles', user.uid));
    currentProfile = profileSnapshot.exists()
      ? { ...profileSnapshot.data(), uid: user.uid, email: user.email }
      : {
          uid: user.uid,
          email: user.email || '',
          fullName: '',
          username: '',
          role: 'Web designer',
          focus: 'Landing pages',
          accountType: 'creator',
          socialLinks: [],
          profilePicture: ''
        };
    if (!profileSnapshot.exists()) await saveProfile();
    setAuthenticated(currentProfile);
    migrateLegacyPublicNames(user.uid, currentProfile.username).catch(showCloudError);
    closeModal(firstVisitWelcome);
    if (activeStorefrontId) {
      const activeStore = stores.find((item) => item.id === activeStorefrontId);
      if (activeStore) renderStorefrontPage(activeStore);
    }
    if (activeRoomId) {
      const activeRoom = rooms.find((item) => item.id === activeRoomId);
      if (activeRoom) openRoomPage(activeRoom);
    }
  } catch (error) {
    showCloudError(error);
    setAuthenticated({
      uid: user.uid,
      email: user.email || '',
      fullName: '',
      username: '',
      accountType: 'creator',
      socialLinks: []
    });
  }
}, showCloudError);

const storyPills = document.querySelectorAll('.story');
storyPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    storyPills.forEach((item) => item.classList.remove('active'));
    pill.classList.add('active');
  });
});
