const Twilio = require("twilio");
const utils = require(Runtime.getAssets()["/utils.js"].path);

exports.handler = async function (context, event, callback) {
  try {
    const claims = utils.decode(event.jwt, context);
    const clientKey = claims.iss;
    const settings = await utils.findOrCreateDocument(
      context,
      utils.settingsKey(clientKey)
    );
    const client = new Twilio(settings.apiKey, settings.apiSecret, {
      accountSid: settings.accountSid,
    });
    try {
      const message = client.messages.create({
        from: settings.phoneNumber,
        to: event.phoneNumber,
        body: event.message,
      });
      const comment = utils.createComment(
        settings.baseUrl,
        context.APP_KEY,
        settings.sharedSecret,
        event.issueKey,
        "Text message sent from: ",
        settings.phoneNumber,
        event.message
      );
      await Promise.all([message, comment]);
      callback(null, { success: true });
    } catch (error) {
      console.error(error);
      callback(null, { success: false, message: error.message });
    }
  } catch (error) {
    callback(error);
    return;
  }
};
