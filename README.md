# Coupon Manager patch branch
This is a coupon manager app built with the [BigCommerce NextJS Sample App](https://github.com/bigcommerce/sample-app-nodejs). This app enables users to view, bulk generate, and bulk export coupon codes for [Coupon Promotions](https://support.bigcommerce.com/s/article/Coupon-Promotions).

This app is provided `as-is` with no guarantees.

-----

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

1. [Use Node 10+ and NPM 7+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-node-js)
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
