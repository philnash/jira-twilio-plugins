const utils = require(Runtime.getAssets()["/utils.js"].path);

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
  callback(null, settings);
};
