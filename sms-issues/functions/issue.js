const { readFile } = require('fs').promises;

exports.handler = async function (context, event, callback) {
  let html = await readFile(Runtime.getAssets()["/issue.html"].path, 'utf-8');
  const fieldKey = `${context.APP_KEY}__phone-number`;
  html = html.replace("FIELD_KEY", fieldKey);
  const response = new Twilio.Response();
  response.setStatusCode(200);
  response.appendHeader('Content-Type', 'text/html');
  response.setBody(html);
  callback(null, response);
}
