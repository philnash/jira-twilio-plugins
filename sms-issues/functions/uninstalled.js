const utils = require(Runtime.getAssets()["/utils.js"].path);

exports.handler = async function (context, event, callback) {
  try {
    const { clientKey } = event;
    const settings = await utils.findOrCreateDocument(
      context,
      utils.settingsKey(clientKey)
    );
    await utils.deleteDocument(context, settings.phoneNumber);
    await utils.deleteDocument(context, utils.settingsKey(clientKey));
    callback(null, "");
  } catch (error) {
    callback(error);
  }
};
