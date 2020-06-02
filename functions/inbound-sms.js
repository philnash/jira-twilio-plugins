const Twilio = require("twilio");
const utils = require(Runtime.getAssets()["/utils.js"].path);

exports.handler = async function (context, event, callback) {
  const phoneNumber = event.From;
  const { clientKey } = await utils.findOrCreateDocument(context, event.To);
  if (typeof clientKey === "undefined") {
    callback(new Error("Could not find client key from phone number."));
    return;
  }
  const settings = await utils.findOrCreateDocument(
    context,
    utils.settingsKey(clientKey)
  );
  if (typeof settings.apiKey === "undefined") {
    callback(new Error("Could not find client settings from key."));
    return;
  }

  const client = new Twilio(settings.apiKey, settings.apiSecret, {
    accountSid: settings.accountSid,
  });

  let message;
  try {
    message = await client.messages(event.MessageSid).fetch();
  } catch (error) {
    callback(error);
    return;
  }

  let issueRequest;
  try {
    issueRequest = await utils.findIssueByPhoneNumber(
      settings.baseUrl,
      context.APP_KEY,
      settings.sharedSecret,
      phoneNumber
    );
    if (issueRequest.body.issues.length === 0) {
      throw new Error("Could not find an issue with that phone number listed.");
    }
  } catch (error) {
    callback(error);
    return;
  }

  try {
    await utils.createComment(
      settings.baseUrl,
      context.APP_KEY,
      settings.sharedSecret,
      issueRequest.body.issues[0].key,
      "Text message received from: ",
      phoneNumber,
      event.Body
    );
    callback(null, new Twilio.twiml.MessagingResponse());
  } catch (error) {
    callback(error);
    return;
  }
};
