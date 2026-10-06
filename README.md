# Coriva

## Firebase setup

The app uses Firebase Authentication (email/password), Cloud Firestore for profiles, storefronts, posts, chat rooms and messages, and Cloud Storage for uploaded media. Registered names stay in the owner-only profile document; public posts, rooms, and messages use usernames. On sign-in, the app removes legacy registered-name fields from that user's existing public posts, rooms, and messages. The web app configuration is in `firebase.js`; its API key identifies the Firebase app and is not a server secret. Access is enforced by the Firestore and Storage security rules.

Before using cloud features:

1. In the Firebase console for `aethel-30d56`, open **Authentication → Get started → Sign-in method** and enable **Email/Password**. Also confirm `aethel-30d56.firebaseapp.com` (and your deployed site's host) appear under **Authentication → Settings → Authorized domains**.
2. Create a Cloud Firestore database and a Cloud Storage bucket.
3. Deploy the included access rules from this directory:

   ```sh
   firebase login
   firebase deploy --only firestore:rules,storage
   ```

4. Serve the site over HTTP (ES modules do not work from a `file://` URL), for example:

   ```sh
   python3 -m http.server 8000
   ```

The app reports Firebase connection and permission errors in its status banner. Room chat accepts emoji input from the device keyboard and GIFs pasted as HTTPS `.gif` links or animated GIF files. Pasted GIF files are stored in Cloud Storage (up to 2 MB); no Klipy API key or Firebase Function is required. Profile, storefront, chat-room, post, and chat data is stored in Firestore; uploaded images and videos are stored in Cloud Storage so they do not exceed Firestore's document-size limit.


## Storefront invoices

Storefront owners can create itemized invoices from **Manage storefront → Invoices**. Each invoice supports customer details, invoice number, due date, notes, quantity/unit-price line items, tax, currency, and multiple payment-app links. Every payment link is rendered as a clickable URL and QR code in the generated PDF. PDFs are generated in the browser and download directly so the storefront owner can send them to the customer.

The invoice records are stored in `stores/{storeId}/invoices` and are restricted by the Firestore rules to the storefront owner. The browser loads jsPDF and QRCode.js from cdnjs for PDF/QR generation; production deployments should pin or self-host these dependencies if your deployment policy requires it.

After changing Firestore rules, deploy them with:

```sh
firebase deploy --only firestore:rules
```

## Live totals and document management
Invoice and quote previews update while entering quantities, prices, workflow charges,
tax, and currency, even before descriptions are completed. Saved invoices and quotes
have confirmed Void and Delete actions. Voiding retains an uneditable record, labels
its PDF as void, and removes invoice payment links/QR codes. Deleting permanently
removes the saved record; previously sent PDFs are unaffected.

Deploy the updated void-protection rules: `firebase deploy --only firestore:rules`.

The item × button removes any invoice or quote row, including the last row, and immediately recalculates totals. Use + Add item to add a replacement. Saving still requires at least one complete item. Mobile rows keep a 44px removal button visible.

PDF download fix: upload the included vendor folder along with script.js and index.html. PDF and QR tools are served locally, with timeout/retry handling. A visible Download PDF link remains in the editor after generation. Invoice/quote IDs are retained after saving so retries update the saved document.

Invoice and quote creation use dedicated button handlers. Opening either editor closes the other, and new documents reset their own saved IDs. Their forms, Firestore collections, lists, and PDF actions remain separate.

## International billing currencies
Invoices and quotes include a searchable selector for 176 current ISO 4217
currency/fund/metal codes from SIX List One (published 2026-09-17).
Testing and no-currency codes are excluded. Search by code, name, or country.
Selected codes remain on saved documents and PDFs. Previously saved codes remain editable.
Amounts use the official minor-unit precision, including zero-, three-, and four-decimal currencies.
Changing currency labels entered amounts; it does not perform exchange-rate conversion.
Upload currencies.js along with the other project files.
Source: https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml

## Automatic seller/customer currency conversion
Enter prices and workflow fees in seller currency; choose customer currency to convert
subtotal, tax and total automatically. Uses the latest available daily ExchangeRate-API
rates (no API key), cached until the provider's next update. Upload exchange-rates.js.
Internet access to https://open.er-api.com is required for new conversions.
Saved documents retain their rate, timestamp and currency pair; editing preserves the
saved rate until you change currencies or select Refresh exchange rate. PDFs and lists
show customer totals. Refresh uses the latest cached provider publication.
Unavailable pairs or network failures are shown explicitly and block saving a cross-currency
document until a valid rate is available. Same-currency documents work without a rate service.
The full currency selector remains available, but the provider does not cover all ISO fund/metal codes.
Customer subtotal and tax are rounded to the target currency's minor units; total is their sum.
Payment links are unchanged: conversion does not alter amounts configured in external payment apps.

## Seller country and automatic currency
Account settings now save country/territory and seller currency to the profile.
Countries with one currency fill it automatically; countries with multiple currencies
let the seller choose a default once. Territories without an assigned currency allow
an explicit choice. New invoices and quotes use that profile default automatically,
leaving only customer currency to select. Existing documents keep their saved seller
currency. Profiles without a country retain manual seller currency selection.
Upload countries.js with the rest of the files. Existing profile rules allow these fields.

## Switching seller currency
Sellers in countries with multiple currencies can change their default at any time
in Account settings, or choose another supported seller currency directly in a new
or editable invoice/quote. Existing document currency is preserved on open.
Switching triggers a fresh conversion for the new pair; entered seller prices remain
unchanged and should be reviewed. Customer currency and conversion update normally.
Voided documents remain uneditable.

Account settings embeds all 249 country/territory choices directly in index.html, alphabetically ordered. JavaScript initialization preserves existing choices and selections without duplicating options.

## Coriva branding
The UI, welcome screens, community labels, document branding, and monograms use Coriva. Existing Firebase project identifiers and browser storage keys are retained for account and data continuity.

## Notifications and estimate requests
See [NOTIFICATIONS-SETUP.md](NOTIFICATIONS-SETUP.md) for the new workflows, required Firebase functions deployment, and payment-status behavior. All workflow alerts are delivered in the site Notifications page.

## Persistent branding images
Room banners, storefront logos/banners, and account profile photos save immediately
after selection. Wait for Image saved before leaving. Upload failures are reported;
the previous saved image remains unchanged. Replacements use unique Storage paths
to avoid stale cached images. Firebase Storage must be enabled and storage.rules
deployed. Existing 2 MB image limits apply. Selecting an image no longer requires
saving other form fields to persist it.
