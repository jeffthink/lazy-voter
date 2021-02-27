# Lazy Voter

I created this voter registration tool in 2018 as a proof-of-concept for what it would look like to 
dramatically simplify the process of checking if you were registered to vote.

In short, it worked! This DialogFlow application reduced the number of steps down to:

1. First name
2. Last name
3. Address
4. Birth date

It works via voice or text inputs, and can be initiated using Google Assistant. It should be easy to add Alexa, Cortana, SMS, messenger, etc. using Dialogflow integrations, but sadly not Siri.

It leverages the Vote.org verify tool (by using the headless chrome Puppeteer library) in order to perform the registration itself, though this ideally would be done via some more official API.

Some important considerations:

1. This was created pretty quickly, and as such is pretty crufty from an engineering perspective - it'd need a fair bit more work (e.g. testing, CI, refactoring, etc.) to be viable in a real-world setting.
2. I bet that it'd be harder to make the voice piece work well across a broad swath of names, addresses, accents, etc.
3. Although Google's Dialogflow technology is quite impressive, and I'm excited by the future of voice inputs, I've grown more and more reluctant to trust "big tech" in this sort of critical role. Future versions of this should look into alternative tools.

## Trying it out

Once everything is set up:

* Open up Google Assistant
* Say / type "Talk to Lazy Voter"
* Follow the prompts

## Developing

Given the number of dependencies (see below), the set of directions to truly get this running is a fair bit longer than I have time to dig in on right now. I'd be happy to do so if there was more interest. The good news is that once the dependencies are in place, it's quite simple to run in dev:

* `git clone `
* `npm install`
* Type some stuff in Dialogflow

## Dependencies

* Google Dialogflow for handling voice/text conversational UI
* Google Cloud Functions for production deployment
* Serverless framework for GCF lifecycle
* Google Maps Geocoder API for handling address parsing
* Puppeteer for filling in Voter.org web form via headless browser
* Browserless for running the Puppeteer browser in production

## Open Questions

* Can we get things like name / address / etc. via some api from the phone (or another authentication approach)? Even better to leverage something like Login.org!
* How do you enable a continous delivery environment with the various dependencies above?
* Can Puppeteer be run performantly directly in GCF vs. using Browserless (see [this issue](https://github.com/GoogleChrome/puppeteer/issues/3120))?
* Can we get access to an api for voter registration check vs. using web form to do so?
* Do we need an email address for voter registration?  If so, how best to ask for that via voice? (Right now, I'm faking it...)