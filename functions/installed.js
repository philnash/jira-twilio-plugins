const utils = require(Runtime.getAssets()["/utils.js"].path);

exports.handler = async function (context, event, callback) {
  await utils.updateOrCreateDocument(
    context,
    utils.settingsKey(event.clientKey),
    event
  );
  callback(null, "");
};
