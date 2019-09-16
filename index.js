'use strict';

const {
  dialogflow,
  Image
} = require('actions-on-google');

const geo = require('lazy-voter-geo');
const register = require('lazy-voter-register');
const moment = require('moment');

const app = dialogflow({
  debug: true
});

app.intent('Check Registration', (conv, params) => {
  conv.ask(`Hello there! Let's check if you are registered to vote.`);
  conv.ask(`First things first - what's the first name on your official ID`);
});

app.intent('Handle Name', (conv, params) => {
  const hasNameYet = conv.data.name;
  if (hasNameYet) {
    conv.data.name.last = params.person.name;
    conv.ask('Got it - Now, what is your full address?');
  } else {
    conv.data.name = {
      first: params.person.name
    };
    conv.ask(`Hi ${conv.data.name.first}!`);
    conv.ask('How about your last name?');
  }
});

app.intent('Handle Address', async (conv, params) => {
  const address = params.address;
  if (address) {
    const enrichedAddress = await geo.geocode(address);
    if (enrichedAddress) {
      conv.data.address = enrichedAddress;
      conv.ask(`Nice - ${enrichedAddress.city}!`);
      conv.ask('What date were you born?');
    } else {
      conv.ask(`Hmm..let\'s try again`);
    }
  } else {
    conv.ask(`Let\'s try again`);
  }
});

app.intent('Handle Birthdate', async (conv, params) => {
  if (params.date) {
    const datetime = moment(params.date);
    const enrichedDate = {
      day: datetime.format('D'),
      month: datetime.format('M'),
      year: datetime.format('YYYY'),
      formatted: datetime.format('YYYY-MM-DD')
    };
    conv.data.birthDate = enrichedDate;

    conv.ask(`Nice - ${enrichedDate.year}!  I'm checking your registration now...`);

    const registrationResult = await register.checkRegistration(conv.data);

    if (registrationResult) {
      conv.ask(`Woo hoo - you're registered!`);
      conv.close(new Image({
        url: 'http://giphygifs.s3.amazonaws.com/media/lF1XZv45kIwMw/giphy.gif',
        alt: 'Woo hoo!',
      }));
    } else {
      conv.ask(`Doesn't look like you're registered at this address :( Try another address?`);
    }
  } else {
    conv.ask(`Let\'s try again`);
  }
});

exports.checkRegistration = app