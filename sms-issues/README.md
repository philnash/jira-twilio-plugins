# Jira Issues by SMS plugin

This is a Jira plugin that can send and receive messages to a phone number listed on a [Jira](https://www.atlassian.com/software/jira) issue using the [Twilio Programmable Messaging API](https://www.twilio.com/docs/sms) and hosted with [Twilio Functions](https://www.twilio.com/docs/runtime/functions).

## What you need

* A Twilio Account (sign up for a [free Twilio account here](https://www.twilio.com/try-twilio))
* A [Twilio phone number](https://www.twilio.com/console/phone-numbers/incoming) that can send and receive SMS messages
* A [Jira](https://www.atlassian.com/software/jira) instance

For developing locally:

* [Node.js](https://nodejs.org/)
* [ngrok](https://ngrok.com/)

## Running the plugin

Clone the repository and change into the `sms-issues` directory:

```bash
git clone https://github.com/philnash/jira-twilio-plugins.git
cd jira-twilio-plugins/sms-issues
```

Install the dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the `.env` file with your application details. Your `ACCOUNT_SID` and `AUTH_TOKEN` can be found in your [Twilio console](https://www.twilio.com/console).

You can create a new [Twilio Sync Service in the Twilio console](https://www.twilio.com/console/sync/services). You will need to enter the Service SID

The `APP_KEY` should be a unique identifier for your Jira plugin (it goes in [the app descriptor](https://developer.atlassian.com/cloud/jira/platform/app-descriptor/)).

Start the application:

```bash
npm start -- --ngrok
```

This will give you an [ngrok](https://ngrok.com/) URL for your application so you can use it with your Atlassian Cloud instance. Grab the URL for the `/atlassian-connect`  path.

In your Atlassian Cloud instance, click on *Apps* > *Manage your apps*. When the page loads, click on *Upload app* and enter the URL.

See below for [how to use the plugin](#using-the-plugin).

## Deployment

Deployment is to the [Twilio Runtime](https://www.twilio.com/docs/runtime) using the [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit).

Deploy by running:

```bash
npm deploy
```

The tool will display your application's deployed URLs. Pick the `/atlassian-connect` URL and use it in the same way as the ngrok URL in local deployment above.

## Using the plugin

Once the plugin is installed, either from a local or deployed version, you will need to set it up within your Atlassian Cloud instance.

### Configuring your Twilio account for the plugin

After the installation is complete, you will see a link to *Configure* the plugin, click *Configure* and you will be brought to a form with four fields, asking for a Twilio Phone Number, Account Sid, API Key and API Secret. These settings do not have to come from the same account that you deployed the application with.

You can get your Account Sid from your [Twilio console](https://www.twilio.com/console/). You can [create an API key and secret from the console here](https://www.twilio.com/console/sync/project/api-keys). The phone number needs to be a Twilio number that can send and receive SMS messages.

When you submit this form, your phone number will be updated with a new webhook URL for incoming SMS messages.

### Configuring your Jira account for the plugin

The plugin makes available a new Phone Number field that you will need to make available to issues so that you can send and receive SMS messages from the issue dashboard.

Open your Jira project settings and head to *View Field Configuration* for Issues. Find the *Phone Number* field and add it to the screens you wish to use it on.

### Using the plugin

Create a new issue and give it a phone number in the *Phone Number* field. On the issue view you will now see a widget with the title *Send SMS via Twilio*. Click on the widget and you will see a form which you can fill in with a message.

Submitting the form will send the message to the Phone Number listed on the issue from the Twilio Phone Number configured earlier. The message will also be noted in the issue's comments.

You can also reply back to the message, which will submit the reply as a comment on the issue too.

## License

[MIT](../LICENSE)