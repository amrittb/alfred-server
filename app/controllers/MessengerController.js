const request = require('request');

const InstructionBuilder = require('./../lib/InstructionBuilder');

const Instruction = require('./../models/Instruction');

var MessengerController = {};

MessengerController.getMessage = function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.FB_HUB_VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
};

MessengerController.postMessage = function (req, res) {
  var data = req.body;
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          var senderID = event.sender.id;
          var recipientID = event.recipient.id;
          var timeOfMessage = event.timestamp;
          var message = event.message;
          
          sendTypingOnMessage(senderID);

          console.log("Received message for user %d and page %d at %d with message:", 
            senderID, recipientID, timeOfMessage);
          console.log(JSON.stringify(message));
          
          var okResponses = [
            "Sure. Master",
            "As you command.",
            "As per your wish.",
            "Consider it done. Master"
          ];
          
          var messageData = {
            recipient: {
              id: senderID
            },
            message: {
              text: okResponses[0]
            }
          };
          
          
          if(message.nlp && message.nlp.entities) {
            var instructionData = InstructionBuilder.buildFromWitNlpEntities(message.nlp.entities);

            Instruction.create(instructionData);

            messageData.message.text = okResponses[Math.floor(Math.random() * okResponses.length)];
          } else {
            messageData.message.text = "Sorry. I don't quite understand you."
          }
            
          var messageId = message.mid;

          var messageText = message.text;
          var messageAttachments = message.attachments;

          if (messageText) {
            request({
              uri: 'https://graph.facebook.com/v2.6/me/messages',
              qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
              method: 'POST',
              json: messageData

            }, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                console.log("Successfully sent generic message with id %s to recipient %s", 
                  messageId, recipientId);
              } else {
                console.error("Unable to send message.");
                console.error(response);
                console.error(error);
              }
            });
          } else {
            console.log("Webhook received unknown event: ", event);
          }
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
};

function sendTypingOnMessage(recipientId) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    }

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Successfully sent typing on");
    } else {
      console.error("Unable to send message.");
    }
  });
}

module.exports = MessengerController;