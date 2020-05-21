const jwt = require("atlassian-jwt");

const settingsKey = (key) => `${key}-settings`;

const findOrCreateDocument = async (context, key) => {
  const client = context.getTwilioClient();
  const syncService = client.sync.services(context.SYNC_SERVICE_SID);
  try {
    const document = await syncService.documents(key).fetch();
    return document.data;
  } catch (error) {
    const document = await syncService.documents.create({
      uniqueName: key,
      data: {},
    });
    return document.data;
  }
};

const updateOrCreateDocument = async (context, key, data) => {
  const client = context.getTwilioClient();
  const syncService = client.sync.services(context.SYNC_SERVICE_SID);
  let document;
  try {
    document = await syncService.documents(key).fetch();
    console.log({ ...document.data, ...data });
    await document.update({ data: { ...document.data, ...data } });
    return document;
  } catch (error) {
    document = await syncService.documents.create({
      uniqueName: key,
      data,
    });
    return document;
  }
};

const decode = async function (token, context) {
  if (typeof token === "undefined") {
    return [false, "No token supplied"];
  }
  const unverifiedClaims = jwt.decode(token, "", true);
  const clientKey = unverifiedClaims.iss;
  const doc = await findOrCreateDocument(context, settingsKey(clientKey));
  if (typeof doc.sharedSecret === "undefined") {
    return [false, "Could not find client ID"];
  }
  try {
    const claims = jwt.decode(token, doc.sharedSecret);
    return [true, claims];
  } catch (e) {
    console.error(e);
    return [false, e.message];
  }
};

const encode = function (data, secret) {
  return jwt.encode(data, secret);
};

module.exports = {
  findOrCreateDocument,
  updateOrCreateDocument,
  settingsKey,
  encode,
  decode,
};
