# Lazy Voter

This DialogFlow application makes it easy to see if you're registered to vote by reducing the number of steps down to:

1. First name
2. Last name
3. Full address
4. Birth date

This works via voice or text inputs, and can be initiated using Google Assistant. It should be trivial to add Alexa, Cortana, SMS, messenger, etc. using Dialogflow integrations, but sadly not Siri.

It leverages the Vote.org verify tool (by using the headless chrome Puppeteer library) in order to perform the registration itself.

## Trying it out

* Open up Google Assistant
* Say / type "Talk to Lazy Voter"
* Follow the directions

## Developing

* `git clone `
* `npm install`
* Type some stuff :)

## Dependencies

* Google Dialogflow for handling voice/text conversational UI
* Google Cloud Functions for production deployment
* Serverless framework for GCF lifecycle
* Google Maps Geocoder API for handling address parsing
* Puppeteer for filling in Voter.org web form via headless browser
* Browserless for running the Puppeteer browser in production

## Open Questions

* How do you enable a continous delivery environment with the various dependencies above?
* Can Puppeteer be run performantly directly in GCF vs. using Browserless (see [this issue](https://github.com/GoogleChrome/puppeteer/issues/3120)?
* Can we get access to an api for voter registration check vs. using web form to do so?
* Do we need an email address for voter registration?  If so, how best to ask for that via voice? (Right now, I'm using my email address...)