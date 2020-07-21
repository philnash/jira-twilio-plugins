exports.handler = function (context, event, callback) {
  callback(null, {
    name: "Twilio Issues SMS",
    description: "A way to send SMS messages from within your Jira application",
    key: context.APP_KEY,
    baseUrl: 'https://' + context.DOMAIN_NAME,
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
      jiraIssueFields: [
        {
          key: "phone-number",
          name: {
            value: "Phone number",
          },
          description: {
            value: "Phone number in e.164 format",
          },
          type: "string",
        },
      ],
      configurePage: {
        url: "/settings.html",
        key: "settings",
        name: {
          value: "Twilio Settings",
        },
      },
      webPanels: [
        {
          url: "/issue?issueKey={issue.key}",
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
