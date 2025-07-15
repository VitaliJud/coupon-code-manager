# Coupon Manager
This is a coupon manager app built with the [BigCommerce NextJS Sample App](https://github.com/bigcommerce/sample-app-nodejs). This app enables users to view, bulk generate, and bulk export coupon codes for [Coupon Promotions](https://support.bigcommerce.com/s/article/Coupon-Promotions).

This app is provided `as-is` with no guarantees.

-----

## App Overview

Coupon Manager is a Next.js application that integrates with the BigCommerce
Promotions API.  After installing the app in a store, merchants can view coupon
promotions, search for specific promotions by coupon code or name, and manage
coupon codes for a promotion.  Codes can be generated in bulk, imported from a
CSV template or exported for reporting.

### How it Works

1. During installation or when the app is launched from the BigCommerce control
   panel the app authenticates the store and creates a signed context token.  The
   token is required for all subsequent API requests and is stored in the URL
   query string.
2. Once authenticated the dashboard loads the list of coupon promotions.  From
   there a promotion can be opened to view the associated coupon codes.
3. Codes may be generated directly inside the app, imported from a CSV file or
   exported as a CSV for external use.

### Importing Codes

Use the "Import Coupons" button on a promotion page to upload a CSV file.  The
CSV must follow the template provided in the repository under `public` as
`coupon-codes-import-template.csv`.  At minimum a column named `code` is
required.  Optional columns `max_uses` and `max_uses_per_customer` may be
included to set limits per code.


# App Installation

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VitaliJud/coupon-code-manager&env=CLIENT_ID,CLIENT_SECRET,AUTH_CALLBACK,JWT_KEY,FIRE_API_KEY,FIRE_DOMAIN,FIRE_PROJECT_ID,DB_TYPE&envDescription=Doc%20for%20setting%20up%20ENV%20Variable&envLink=https%3A%2F%2Fdeveloper.bigcommerce.com%2Fapi-docs%2Fapps%2Ftutorials%2Fbuild-a-nextjs-sample-app%2Fstep-3-integrate%23set-up-firebase-database&project-name=coupon-code-manager&repository-name=coupon-code-manager)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/VitaliJud/coupon-code-manager)
## Vercel Installation

To get BigCommerce App running for free using Cloud servers with Vercel and Firebase, follow these instructions:

1. Fork or Clone Repository
2. [Start New Project on Vercel](https://vercel.com/docs/concepts/deployments/git#deploying-a-git-repository)
3. Create an Account or Login as existing
4. Select Current Repository as your New Project
5. Assign domain if needed or continue with shared Vercelapp
6. [Register a draft app.](https://developer.bigcommerce.com/api-docs/apps/quick-start#register-a-draft-app)
    - Configure Callback URLs based on your Vercel's Project domain
    - Example callbacks `'https://{project_id}.vercel.app/api/{auth||load||uninstall}'`
    - Get Client ID and Secret Key from you BC App credentials
7. [Create Firebase Account](https://console.firebase.google.com/)
    - Add New Project > Disable Analytics > Create
    - Select All Products > Cloud Firestore > Get Started
    - Select Rules tab > adjust 'allow read, write: if `false`' to > '`true`'
    - Select Authetication from All Products > Get Started
8. Get Firebase credentials
    - View Project Overview > Project Settings > General
    - Make note of variable `ProjectID` | `Web API Key` | `authDomain` - '{projectId}.firebaseapp.com'
9. Update Vercel Environment Variables
    - FIRE_DOMAIN - authDomain in Firebase
    - FIRE_PROJECT_ID - projectId in Firebase
    - FIRE_API_KEY - Web API Key in Firebase
    - DB_TYPE - `firebase`
    - AUTH_CALLBACK - Callback URL saved in BC App
    - JWT_KEY - any 32-character, JWT key should be at least 32 random characters (256 bits) for HS256
    - CLIENT_ID - BC App Client ID in Devtools
    - CLIENT_SECRET - BC App Client Secret in Devtools
10. [Install the app and launch.](https://developer.bigcommerce.com/api-docs/apps/quick-start#install-the-app)

-----

## Local Installation

To get the app running locally, follow these instructions:

1. [Use Node 18 and NPM 8+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-node-js)
2. Install npm packages
    - `npm install`
3. [Add and start ngrok.](https://www.npmjs.com/package/ngrok#usage) Note: use port 3000 to match Next's server.
    - `npm install ngrok`
    - `ngrok http 3000`
4. [Register a draft app.](https://developer.bigcommerce.com/api-docs/apps/quick-start#register-a-draft-app)
     - For steps 5-7, enter callbacks as `'https://{ngrok_id}.ngrok.io/api/{auth||load||uninstall}'`. 
     - Get `ngrok_id` from the terminal that's running `ngrok http 3000`.
     - e.g. auth callback: `https://12345.ngrok.io/api/auth`
5. Copy .env-sample to `.env`.
     - If deploying on Heroku, skip `.env` setup.  Instead, enter `env` variables in the Heroku App Dashboard under `Settings -> Config Vars`.
6. [Replace client_id and client_secret in .env](https://devtools.bigcommerce.com/my/apps) (from `View Client ID` in the dev portal).
7. Update AUTH_CALLBACK in `.env` with the `ngrok_id` from step 5.
8. Enter a jwt secret in `.env`.
    - JWT key should be at least 32 random characters (256 bits) for HS256
9. Specify DB_TYPE in `.env`
    - If using Firebase, enter your firebase config keys. See [Firebase quickstart](https://firebase.google.com/docs/firestore/quickstart)
    - If using MySQL, enter your mysql database config keys (host, database, user/pass and optionally port). Note: if using Heroku with ClearDB, the DB should create the necessary `Config Var`, i.e. `CLEARDB_DATABASE_URL`.
10. Start your dev environment in a **separate** terminal from `ngrok`. If `ngrok` restarts, update callbacks in steps 4 and 7 with the new ngrok_id.
    - `npm run dev`
11. [Install the app and launch.](https://developer.bigcommerce.com/api-docs/apps/quick-start#install-the-app)


[![Deploy](https://store-lorovork97.mybigcommerce.com/content/Vercel%20Deploy.svg)](https://vercel.com/new/clone?repository-url=https://github.com/VitaliJud/coupon-code-manager)

## Authentication and Load Troubleshooting

If the app fails to load inside the BigCommerce control panel it is often due to
an invalid context token or missing environment variables.  Ensure that
`CLIENT_ID`, `CLIENT_SECRET` and `AUTH_CALLBACK` are correctly configured in your
deployment environment.  When launching the app, the `context` query parameter
must be preserved on all page requests.  Removing it will result in API errors
and a blank dashboard.
