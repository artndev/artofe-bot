## Quick Overview

_Artofe — yours way into coffee! Authentic Coffee Arabica_

The Telegram bot with a discount system built for the better user experience in a cafe.

## Tech Stack

**Front-end:** React + Vite, Redux, SASS & SCSS, Tailwind CSS, shadcn/ui, Telegram Web Apps.
</br>
**Back-end:** Express.js, MySQL.

## Dependencies

- Install [Git](https://git-scm.com/) on your machine to clone the Github repository.
- Install [Node.js](https://nodejs.org/) on your machine to build and run the application locally.

## Clone Repository

Create a new directory where you want to deploy the application, then clone the Github repository into it:

```bash
git clone https://github.com/artndev/artofe-bot.git .
```

Navigate to the project directory:

```bash
cd root
```

Change the working branch from _master_ (production branch) to _dev-public_ (public development branch) due to the specialties of the production and development environments:

```bash
git checkout dev-public
```

## Configure Environmental Variables

Open the _.env.local_ file located in the _client_ directory and fill in the required environmental variables:

```env
# Your Stripe credentials can be found at:
# https://dashboard.stripe.com/test/dashboard
# https://dashboard.stripe.com/test/settings/user
VITE_STRIPE_PUBLISHABLE_KEY=...
VITE_STRIPE_ACCOUNT_ID=...
```

Open the _.env.local_ file located in the _server_ directory and fill in the required environmental variables:

```env
# Your bot token can be obtained via @BotFather:
# https://t.me/BotFather
BOT_TOKEN=...

# Your Stripe credentials can be found at:
# https://dashboard.stripe.com/test/dashboard
STRIPE_SECRET=...

# UUIDv4 secret used for generating tokens
# To generate UUIDv4 secret, follow link below:
# https://www.uuidgenerator.net/version4.
JWT_SECRET=...

# Port remains untouchable
PORT=8000

# Your DB credentials
# Table schemas can be found in server\src\schemas
MYSQL_HOST=...
MYSQL_PORT=...
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DBNAME=...
```

## Configure Ngrok

Authorize in [the ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken) to fetch your authorization token in order to create a reverse proxy for running the application locally.

Open the _ngrok.yaml_ file located in the _server_ directory and fill in the required data:

```yaml
version: '3'
agent:
  authtoken: <your-authtoken>
```

Fetch a free domain from [the ngrok dashboard](https://dashboard.ngrok.com/domains) to make the server running on it.

Open the _package.json_ file located in the _server_ directory and fill in the required data:

```json
...
"scripts": {
  ...
  "remote": "ngrok http --url=<your-domain> 8000 --config ngrok.yaml"
},
...
```

Push front-end to a web hosting platform, such as [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/) or [Heroku](https://www.heroku.com/), to keep it up-to-date with any back-end changes.

Open the _config.json_ file located in the _server/src_ directory and fill in the required data:

```json
{
  ...
  "CLIENT_URL": <your-front-end-domain>,
  "SERVER_URL": <your-back-end-domain>,
  ...
}

```

Open the _config.json_ file located in the _client/src_ directory and fill in the required data:

```json
{
  "SERVER_URL": <your-back-end-domain>,
  ...
}
```

## Run Application with Node.js

Return to the root directory:

```bash
cd ../../
```

Use the command below to run the application with Node.js:

```bash
npm run start
```

## Access Application

Once the build is completed successfully, the application will be available at https://t.me/your-bot-username.
