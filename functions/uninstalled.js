const utils = require(Runtime.getAssets()["/utils.js"].path);

exports.handler = async function (context, event, callback) {
  const settings = await utils.findOrCreateDocument(
    context,
    utils.settingsKey(event.clientKey)
  );
  await utils.deleteDocument(context, settings.phoneNumber);
  await utils.deleteDocument(context, utils.settingsKey(event.clientKey));
  callback(null, "");
};
