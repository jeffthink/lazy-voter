'use strict';

const puppeteer = require('puppeteer');

const checkRegistration = async (details) => {
  let success = false;
  let browser = null;

  try {
    // TODO add proper dev vs. prod flag here

    // In dev, use local chromium and show browser to see what puppeteer is doing...
    // browser = await puppeteer.launch({ headless: false});

    // In prod, use Browserless service since running puppeteer via 
    // GCF is slow and a bit painful
    browser = await puppeteer.connect({
      browserWSEndpoint: 'wss://chrome.browserless.io?token=3efd9618-4abd-45d0-899a-1ab06be0e7d4'+
      '&--window-size=1920x1080' +
      '&--no-sandbox=true' +
      '&--disable-setuid-sandbox=true' +
      '&--disable-dev-shm-usage=true' +
      '&--disable-accelerated-2d-canvas=true' +
      '&--disable-gpu=true'
    });

    let page = await browser.newPage();
    await page.goto('https://verify.vote.org');

    // It's silly that vote.org requires an email, so this is temp workaround
    const email = `jeff+${Math.floor(Math.random() * 100) + 1}@nighttrainconsulting.com`
    details.email = email;

    // Fill out all the fields
    // Note - Use querySelector approach in order to do 1 big call 
    // vs. several sequential await keyboard.type calls.

    // Worth calling out that using Promise.all with await keyboard.type
    // calls doesn't work since the fake keyboard can't handle parallel
    // calls!
    await page.evaluate(d => {
      document.querySelector('#first_name').value = d.name.first;
      document.querySelector('#last_name').value = d.name.last;

      document.querySelector('#street_address').value = d.address.streetAddress;
      document.querySelector('#apartment').value = d.address.subpremise || '';
      document.querySelector('#city').value = d.address.city;
      document.querySelector('#zip_5').value = d.address.zip;
      document.querySelector('select#state').value = d.address.state;

      document.querySelector('select#date_of_birth_month').value = d.birthDate.month;
      document.querySelector('select#date_of_birth_day').value = d.birthDate.day;
      document.querySelector('select#date_of_birth_year').value = d.birthDate.year;

      document.querySelector('#email').value = d.email;
    }, details);

    page.click('input[name="commit"]');
    await page.waitForSelector('h2');

    success = !!(await page.$('h2.registered-lead'))
  } catch (error) {
    console.log(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
    return success;
  }
};

module.exports.checkRegistration = async (details) => {
  return await checkRegistration(details);
};

/*
// TODO - pull this into a test structure

const success = {
  name: {
    first: 'Jeffrey',
    last: 'Bordogna'
  },
  address: {
    streetAddress: '100 Kelsey Ct',
    city: 'Charlottesville',
    state: 'Virginia',
    zip: '22903'
  },
  birthDate: {
    month: '10',
    day: '12',
    year: '1984'
  }
};

const failure = {
  name: {
    first: 'Jeffrey',
    last: 'Bordogna'
  },
  address: {
    streetAddress: '10000 Kelsey Ct',
    city: 'Charlottesville',
    state: 'Virginia',
    zip: '22903'
  },
  birthDate: {
    month: '9',
    day: '12',
    year: '1984'
  }
};

module.exports.checkRegistration(failure);
*/