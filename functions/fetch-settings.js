const utils = require(Runtime.getAssets()["/utils.js"].path);

exports.handler = async function (context, event, callback) {
  try {
    const claims = await utils.decode(event.jwt, context);
    const clientKey = claims.iss;
    const settings = await utils.findOrCreateDocument(
      context,
      utils.settingsKey(clientKey)
    );
    callback(null, settings);
  } catch (error) {
    callback(error);
    return;
  }
};
