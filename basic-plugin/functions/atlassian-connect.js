exports.handler = function (context, event, callback) {
  callback(null, {
    name: "Twilio SMS Basic",
    description: "A way to send SMS messages from within your Jira application",
    key: context.APP_KEY,
    baseUrl: 'https://' + context.DOMAIN_NAME,
    authentication: {
      type: "none",
    },
    modules: {
      generalPages: [
        {
          url: "/form.html",
          key: "form",
          location: "system.top.navigation.bar",
          name: {
            value: "Twilio SMS",
          },
        },
      ],
    },
  });
};
