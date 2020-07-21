# Basic Jira SMS plugin

This is a basic [Jira](https://www.atlassian.com/software/jira) plugin that adds a form into Jira that can be used to send messages via SMS using the [Twilio Programmable Messaging API](https://www.twilio.com/docs/sms) and hosted with [Twilio Functions](https://www.twilio.com/docs/runtime/functions).

## What you need

* A Twilio Account (sign up for a [free Twilio account here](https://www.twilio.com/try-twilio))
* A [Twilio phone number](https://www.twilio.com/console/phone-numbers/incoming) that can send SMS messages
* An [Atlassian Cloud instance](http://go.atlassian.com/cloud-dev) that you can deploy plugins to for testing

For developing locally:

* [Node.js](https://nodejs.org/)

## Running the plugin

Clone the repository and change into the `basic-plugin` directory:

```bash
git clone https://github.com/philnash/jira-twilio-plugins.git
cd jira-twilio-plugins/basic-plugin
```

Install the dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the `.env` file with your application details. Your `ACCOUNT_SID` and `AUTH_TOKEN` can be found in your [Twilio console](https://www.twilio.com/console), you will need to buy a new Twilio number or choose an existing one that can send SMS messages and fill that in as the `TWILIO_PHONE_NUMBER`. The `APP_KEY` should be a unique identifier for your Jira plugin (it goes in [the app descriptor](https://developer.atlassian.com/cloud/jira/platform/app-descriptor/)).

Start the application:

```bash
npm start -- --ngrok
```

This will give you an [ngrok](https://ngrok.com/) URL for your application so you can use it with your Atlassian Cloud instance. Grab the URL for the `/atlassian-connect`  path.

In your Atlassian Cloud instance, click on *Apps* > *Manage your apps*. When the page loads, click on *Upload app* and enter the URL.


## Deployment

Deployment is to the [Twilio Runtime](https://www.twilio.com/docs/runtime) using the [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit).

Deploy by running:

```bash
npm deploy
```

The tool will display your application's deployed URLs. Pick the `/atlassian-connect` URL and use it in the same way as the ngrok URL in local deployment above.

## License

[MIT](../LICENSE)