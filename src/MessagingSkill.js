/**
 * Author: Andrew Tang
 * This is an AlexaSkill that sends messages as a Messaging bot.
 * This project was forked off of the HistoryBuff sample project
 * from Amazon at (https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/historyBuff)
 */


/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.ask.skill.ea33393c-60e7-48f5-ba16-32d361b6013b';

/**
 * Twilio Credentials
 */
var accountSid = 'AC938472e9120f0c46d2f7e15a61825d4a';
var authToken = "9fede4428c7bd0fc4586a0954da61b9a";
var client = require('twilio')(accountSid, authToken);

var https = require('https');

/**
* Contact "Database"
*/

var contacts = {
    cary: "16302615888", 
    tang: "+18327889328",
    dan: "+16308541819", 
    mom: "+16308541819",
    susie: "+13234811364",
    coby: "+16508147855",
    twilio: "+12242035200",
    tristan: "+14044220074"
}

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
    "StartReadConversationIntent": function(intent, session, response) {
        handleStartReadConversationIntent(intent, session, response);
    },
    "ReadConversationIntent": function(intent, session, response) {
        handleReadConversationIntent(intent, session, response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

function sendText(msgBody, recipient, callback) {
    console.log(recipient)
    console.log(contacts[recipient])
    client.messages.create({ 
        to: contacts[recipient], 
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

function getTexts(limit, callback) {
    client.messages.list({
        to: "+12242035200"
    },function(err, data) {
        var msgArr = []
        for(var i = 0; i < limit; i ++) {
            msgArr.push(data.messages[i]);
        }
        callback(msgArr.reverse());
    });
}

function getConversation(person, limit, callback) {
    client.messages.list({
        to: contacts[person]
    },function(err, data1) { // data1 has all the messages 
        client.messages.list({
        from: contacts[person]
        },function(err, data2) {
            var msgArr = []
            var n = 0;
            var i = 0;
            var j = 0;
            while(n<limit) {
                if (Date.parse(data1.messages[i].date_sent) > 
                    Date.parse(data2.messages[i].date_sent))  
                {
                    msgArr.push(data1.messages[i]);
                    i++;
                } else {
                    msgArr.push(data2.messages[j]);
                    j++;
                }
                console.log(msgArr[n].date_sent)
                console.log(msgArr[n].body)
                n++;
            }
            callback(msgArr.reverse());}    
    )
})
}

function numberToContactName(number) {
    for(name in contacts) {
        if(contacts[name] == number){
            return name;
        }
    }
    return 'Unknown';
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
        getTexts(numMessages, function(msgArr){
            var speechStr = '';
            msgArr.forEach(function(msg) {
                var name = numberToContactName(msg.from);
                speechStr = speechStr + '<p>' + name + ' sent you ' + msg.body + '</p>';
            });

            speechOutput = {
                speech: "<speak> <p>Reading Messages</p> " + speechStr + " </speak>",
                type: AlexaSkill.speechOutputType.SSML
            }
            response.tell(speechOutput);
        })
    }
    
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
    session.attributes = {sessionRecipient: recipient};
    response.ask(output);
}

function handleSendMessageRequest(intent, session, response) {
    var message = intent.slots.message.value;
    var recipient = session.attributes.sessionRecipient.toLowerCase();
    console.log('MESSAGE: ', message);

    sendText(message, recipient, function() {
        var speechOutput = {
            speech: "<speak> Sending " + message + " to " + recipient + " </speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        response.tell(speechOutput);
    });
}
function handleStartReadConversationIntent(intent, session, response) {
    var contact = null;

    if ("value" in intent.slots.contact) {
        contact = intent.slots.contact.value.toLowerCase();
        console.log("Contact is ", contact);
    } else if (contacts[contact]) {
        var speechOutput = {
            speech: "<speak> Reading conversation with " + contact + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        session.attributes = {sessionContact: contact};
        respons.ask(output);
    }
    else {
        var followUp = {
            speech: "<speak> Make sure to tell me which conversation to read from! </speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        response.tell(followUp);
    }
}
function handleReadConversationIntent(intent, session, response) {
    var numMessages = intent.slots.numMessages.value;
    var contact = session.attributes.sessionContact.toLowerCase();
    console.log('Reading Conversation with ', contact);
    getConversation(contact, numMessages, function() {
        // var speechStr = '';
        // msgArr.forEach(function(msg) {
        //     var name = numberToContactName(msg.from_);
        //     speechStr = speechStr + '<p>' + name + ' sent you ' + msg.body + '</p>';
        // });
        
        var speechOutput = {
            speech: "<speak>reading conversation kind of</speak>",
            type: AlexaSkill.speechOutputType.SSML
        }
        response.tell(speechOutput);
    });
}

module.exports = MessagingSkill;
getConversation("Dan", 5, function(msgArr) {
    console.log(msgArr[0].body);
});
