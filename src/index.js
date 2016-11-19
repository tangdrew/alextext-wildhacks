MessagingSkill = require('./MessagingSkill');

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Messaging Skill.
    console.log("EVENT");
    console.log(event);
    if(event.request.type == 'IntentRequest') {
        var skill = new MessagingSkill();
        skill.execute(event, context);
    }
    else {
        console.log('HTTP Request');
    }
};
