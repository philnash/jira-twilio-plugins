# Jira plugin examples with Twilio

This is a repository of example [Jira](https://www.atlassian.com/software/jira) plugins that combine Jira and [Twilio](https://www.twilio.com).

There are 2 plugins available right now.

1. [A basic plugin](./basic-plugin/): shows how to create a plugin, add an HTML form and send an SMS message when you submit the form
2. [Jira Issues by SMS](./sms-issues): adds a phone number field to Jira issues and allows you to:
   - send SMS messages from the issue
   - receive SMS issues and add comments back to the issue

The plugins are built using Node.js, [Twilio Functions](https://www.twilio.com/docs/runtime/functions) and the [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit).