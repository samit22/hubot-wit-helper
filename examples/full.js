// Description:
//   Test bot
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
//
// Author:
//   Guillaume <guillaume@wuips.com>

'use strict';

(() => {

    const witHelper = require('hubot-wit-helper');

    const TOKEN = (() => {

        const token = process.env.WIT_TOKEN;

        if (!token) {
            throw new Error('WIT_TOKEN missing');
        }

        return token;
    })();

    const actions = {
        say(session, context, message, cb) {

            //res object is attached to the session
            session.res.reply(message);

            cb();
        },
        merge(session, context, entities, message, cb) {

            const loc = witHelper.firstEntityValue(entities, 'location');

            if (loc) {
                context.loc = loc;
            }

            cb(context);
        },
        error(session, context, error) {
            console.error(error.message);
            session.res.send('Something went wrong with Wit.ai :scream:');
        }
    };

    const bot = robot => {

        const witRobot = new witHelper.Robot(TOKEN, actions, robot);

        //will listen for "@testbot: hey you"
        const reg = /(\ *@(.*):\ +(hey)(.*))/i;

        witRobot.getMessage = (res) => { //custom getMessage
            return res.match[3]; //return "you"
        };

        witRobot.getSession = (res) => { //custom getSession
            //for example, use Slack room id instead of user id
            return res.enveloppe.room;
        };

        witRobot.respond(reg, (err, context, res) => {

            console.log(`[USER] ${witRobot.getMsg(res)}`);

            if (err) {
                console.error(err);
                return;
            }

            //do stuff if you want

        });

    };

    module.exports = bot;

})();
