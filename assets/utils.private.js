const jwt = require("atlassian-jwt");
const got = require("got");

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

const deleteDocument = async (context, key) => {
  const client = context.getTwilioClient();
  const syncService = client.sync.services(context.SYNC_SERVICE_SID);
  try {
    await syncService.documents(key).remove();
    return;
  } catch (error) {
    return;
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

const jiraIssueUrl = (baseUrl, issueKey) =>
  `${baseUrl}/rest/api/3/issue/${issueKey}/comment`;

const buildTokenData = function (req, appKey) {
  return {
    iss: appKey,
    iat: Date.now(),
    exp: Date.now() + 3 * 60 * 1000,
    qsh: jwt.createQueryStringHash(req),
  };
};

const buildCommentBody = function (text, phoneNumber, comment) {
  return {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            { text: text, type: "text" },
            { text: phoneNumber, type: "text", marks: [{ type: "strong" }] },
          ],
        },
        {
          type: "blockquote",
          content: [
            { type: "paragraph", content: [{ text: comment, type: "text" }] },
          ],
        },
      ],
    },
  };
};

const buildApiOptions = (url, token, body) => {
  return {
    method: "POST",
    url: `${url}?jwt=${token}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    json: body,
    responseType: "json",
  };
};

const createComment = async (
  baseUrl,
  appKey,
  sharedSecret,
  issueKey,
  text,
  phoneNumber,
  comment
) => {
  const url = `${baseUrl}/rest/api/3/issue/${issueKey}/comment`;
  const body = buildCommentBody(text, phoneNumber, comment);
  const req = jwt.fromMethodAndPathAndBody("post", url, body);
  const tokenData = buildTokenData(req, appKey);
  const token = encode(tokenData, sharedSecret);

  return got(buildApiOptions(url, token, body));
};

const findIssueByPhoneNumber = (baseUrl, appKey, sharedSecret, phoneNumber) => {
  const url = `${baseUrl}/rest/api/3/search?jql="Phone number" ~ "${phoneNumber}" ORDER BY priority DESC, updated DESC&maxResults=1`;
  const req = jwt.fromMethodAndUrl("GET", url);
  const tokenData = buildTokenData(req, appKey);
  const token = encode(tokenData, sharedSecret);

  return got({
    method: "GET",
    url: `${url}&jwt=${token}`,
    headers: {
      Accept: "application/json",
    },
    responseType: "json",
  });
};

module.exports = {
  findOrCreateDocument,
  updateOrCreateDocument,
  deleteDocument,
  settingsKey,
  encode,
  decode,
  createComment,
  findIssueByPhoneNumber,
};
