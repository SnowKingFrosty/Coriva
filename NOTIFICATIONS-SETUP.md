# Coriva notifications and estimate requests setup

This release adds server-side Firebase functions. Uploading the website files alone
will not activate estimate requests, job conversations, document sharing, or notifications.
Existing invoice creation and PDF downloads continue to use the existing app.

## 1. Install server dependencies

Use Node.js 22 and Firebase CLI on your development machine. From the project root:

```bash
npm --prefix functions ci
firebase use aethel-30d56
```

Enable the Firebase Blaze billing plan for Cloud Functions. The deployed functions
use region `us-central1`, matching firebase.js. Review your Firebase costs before deployment.

## 2. Deploy the backend and rules

```bash
firebase deploy --only firestore:rules,functions
```

Upload all updated website files to your existing host, including jobs.js,
firebase.js, script.js, index.html, styles.css, currencies.js, countries.js,
exchange-rates.js, and vendor/. Do not publish the functions folder, .env files,
node_modules, or local credentials as static website assets. Hard-refresh the site.

## How it works

1. A signed-in customer chooses Request an estimate on a storefront and enters
   a 20–2,000 character description. Guests are prompted to sign in.
2. Both parties see the request in Notifications. The seller receives an in-app notification.
3. The seller chooses Accept or Reject. The customer receives an in-app update.
4. Accept opens a private conversation visible only to the two participants.
5. The seller chooses Create quote, fills out pricing, saves it, and selects
   Share with customer. The customer receives an in-app notification and can
   download the PDF from that job. Create invoice follows the same flow.
6. Changes to a shared document become visible when it is next downloaded;
   customer notifications announce updates. Deleted/voided documents cannot be
   retrieved or reported paid. Share only after reviewing the intended recipient.
7. The customer pays using the invoice's external payment details and selects
   I have paid. The seller gets a payment-reported notification, verifies their
   payment account, and selects Confirm payment received. The customer receives
   confirmation. This does not charge anyone or verify a payment automatically.

Payment-app links currently have no provider webhook credentials. Automatic,
provider-verified payment notifications require a separate provider integration;
this version explicitly labels customer reports and seller confirmations.

Notifications show the latest 100 events and messages show the latest 100 entries.
Accepted jobs remain in Your requests. Notifications and conversations are available
to creator and shopper accounts. Request submissions are limited to 10 per customer
per UTC day. Requests and messages use stable retry IDs to avoid duplicate records.
All job request, message, quote, and payment alerts are in-app only.

## Deployment smoke test

Use two test accounts and a test storefront:

- Customer submits one request; seller sees exactly one new request notification.
- Customer cannot accept/reject; seller cannot request their own storefront.
- Accept opens the same job conversation on both accounts; Reject stays closed.
- A third account cannot read the job, messages, notifications, or shared PDFs.
- Share a quote and invoice; verify the customer sees the correct document.
- Report payment as the customer, then confirm as seller; check both notifications.
- Void a shared invoice and verify it cannot be downloaded or reported paid.
- Verify notification links and mobile form layout.

## Verification completed for this package

- Full JavaScript initialization and request/quote UI actions in a DOM test.
- Firestore emulator tests for request acceptance/rejection, message retries, sharing,
  payment reports/confirmation, and private-data access rules.
- JavaScript syntax checks.

These are local tests. No live Firebase deployment was performed.

## Upgrading from the email-enabled release

If you previously deployed the email sender, remove it to stop existing cloud email
triggers. Removing the code locally alone does not remove a deployed function.

```bash
firebase functions:delete emailJobRequest --region us-central1
```

Then deploy the updated backend and rules using the command above. Fresh installs
do not need the deletion step. No SMTP credentials or site URL parameter are required.
Unused CORIVA_SMTP secrets and CORIVA_SITE_URL environment settings can be removed
from your Firebase configuration after the old email function has been deleted.
