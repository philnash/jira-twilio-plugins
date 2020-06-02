exports.handler = function (context, event, callback) {
  callback(null, {
    name: "Twilio Issues SMS",
    description: "A way to send SMS messages from within your Jira application",
    key: context.APP_KEY,
    baseUrl: context.BASE_URL || context.DOMAIN_NAME,
    authentication: {
      type: "jwt",
    },
    lifecycle: {
      installed: "/installed",
      uninstalled: "/uninstalled",
    },
    scopes: ["read", "write"],
    apiVersion: 1,
    modules: {
      generalPages: [
        {
          url: "/settings.html",
          key: "settings",
          location: "system.top.navigation.bar",
          name: {
            value: "Twilio Settings",
          },
        },
      ],
      webPanels: [
        {
          url: "/issue.html?issueKey={issue.key}",
          location: "atl.jira.view.issue.right.context",
          layout: {
            width: "10px",
            height: "100%",
          },
          weight: 50,
          name: {
            value: "Send SMS via Twilio",
          },
          key: "my-web-panel",
        },
      ],
    },
  });
};
