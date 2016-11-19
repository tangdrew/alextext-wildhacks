/**
 * Author: Andrew Tang
 * This is an AlexaSkill that sends messages as a Messaging bot.
 * This project was forked off of the HistoryBuff sample project
 * from Amazon at (https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/historyBuff)
 */


/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.ask.skill.0e9e92cd-c015-4796-87a4-1a9dfadafdc7';

/**
 * Twilio Credentials
 */
var accountSid = 'AC938472e9120f0c46d2f7e15a61825d4a';
var authToken = "9fede4428c7bd0fc4586a0954da61b9a";
var client = require('twilio')(accountSid, authToken);

var https = require('https');

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * MessagingSkill is a child of AlexaSkill.
 *
 */
var MessagingSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MessagingSkill.prototype = Object.create(AlexaSkill.prototype);
MessagingSkill.prototype.constructor = MessagingSkill;

MessagingSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("MessagingSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

MessagingSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("MessagingSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
};

MessagingSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

MessagingSkill.prototype.intentHandlers = {
    // register custom intent handlers
    "StartMessageIntent": function (intent, session, response) {
        handleStartMessageRequest(intent, session, response);
    },
    "ReadMessagesIntent": function (intent, session, response) {
        handleReadMessagesRequest(intent, session, response);
    },
    "SendMessageIntent": function(intent, session, response) {
        handleSendMessageRequest(intent, session, response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

function sendText(msgBody, callback) {
    client.messages.create({ 
        to: "+18327889328", 
        from: "+12242035200", 
        body: msgBody
    }, function(err, message) { 
        if(err){
            console.log(err);
            console.log(message.sid); 
        }
        else {
            callback();
        }
    });
}

function handleReadMessagesRequest(intent, session, response) {
    var numMessages = 5;
    var speechOutput = null;

    if("value" in intent.slots.numMessages) {
        numMessages = intent.slots.numMessages.value;
    }

    if(numMessages > 20) {
        speechOutput = {
            speech: "<speak> The limit is 20 messages </speak>",
            type: AlexaSkill.speechOutputType.SSML
        }
    }
    else {
        speechOutput = {
            speech: "<speak> Reading " + numMessages + " messages </speak>",
            type: AlexaSkill.speechOutputType.SSML
        }
    }

    response.tell(speechOutput);
}

function handleStartMessageRequest(intent, session, response) {
    var recipient = null;

    if ("value" in intent.slots.recipient) {
        recipient = intent.slots.recipient.value;
    }
    else {
        var followUp = {
            speech: "<speak> Hey, try that again and include who you want to send your message to. </speak>",
            type: AlexaSkill.speechOutputType.SSML
        }
        response.tell(followUp);
    }

    var output = {
        speech: "<speak>What is the message you want to send to " + recipient + " </speak>",
        type: AlexaSkill.speechOutputType.SSML
    }

    response.ask(output);
}

function handleSendMessageRequest(intent, session, response) {
    var message = intent.slots.message.value;
    sendText(message, function() {
        var speechOutput = {
            speech: "<speak> " + message + " </speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        response.tell(speechOutput);
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Messaging Skill.
    var skill = new MessagingSkill();
    skill.execute(event, context);
};

sendText("dinner time", function(){
    console.log('done');
})
