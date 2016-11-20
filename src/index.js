MessagingSkill = require('./MessagingSkill');
API = require('./API');

exports.handler = function(event, context, callback) {

    if(event.request == null) {
        console.log('HTTP Request');
        API(event, context, callback);
    }
    else {
        var skill = new MessagingSkill();
        skill.execute(event, context);
    }
    
};