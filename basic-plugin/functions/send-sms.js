exports.handler = async (context, event, callback) => {
    const to = event["phone-number"];
    const body = event.message;
    const client = context.getTwilioClient();
    try {
      await client.messages.create({
        to,
        body,
        from: context.TWILIO_PHONE_NUMBER,
      });
      const response = new Twilio.Response();
      response.setStatusCode(303);
      response.appendHeader("Location", "/form.html");
      callback(null, response);
    } catch (error) {
      callback(error);
    }
  };
  