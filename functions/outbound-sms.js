const Twilio = require("twilio");
const utils = require(Runtime.getAssets()["/utils.js"].path);

const sendMessage = (client, from, to, body) => {
  return client.messages.create({ from, to, body });
};

exports.handler = async function (context, event, callback) {
  const [success, claims] = await utils.decode(event.jwt, context);
  if (!success) {
    console.error(claims);
    callback(claims);
    return;
  }
  const clientKey = claims.iss;
  const settings = await utils.findOrCreateDocument(
    context,
    utils.settingsKey(clientKey)
  );
  const client = new Twilio(settings.apiKey, settings.apiSecret, {
    accountSid: settings.accountSid,
  });
  try {
    const message = sendMessage(
      client,
      settings.phoneNumber,
      event.phoneNumber,
      event.message
    );
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
    return;
  }
};
