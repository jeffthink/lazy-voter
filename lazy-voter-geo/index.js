'use strict';

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDWqFPxv4gn1cYRpGc6aZORKTFj6SUyj4E',
  Promise: Promise
});

const geocode = (address) => {
  return googleMapsClient.geocode({
      address,
      components: { country: 'us' }
    })
    .asPromise()
};

module.exports.geocode = async (address) => {
  const response = await geocode(address);

  const first = response.json.results[0];
  if (!first) {
    return;
  }

  if (!first.types.includes('premise') && !first.types.includes('subpremise')) {
    return;
  }

  const addressComponents = first.address_components;
  let subpremise, streetNumber, streetName, city, state, zip;

  addressComponents.forEach(component => {
    if(component.types.includes('subpremise')) {
      subpremise = component.long_name;
    } else if (component.types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (component.types.includes('route')) {
      streetName = component.long_name;
    } else if (component.types.includes('locality')) {
      city = component.long_name;
    } else if (component.types.includes('administrative_area_level_1')) {
      state = component.long_name;
    } else if (component.types.includes('postal_code')) {
      zip = component.long_name;
    }
  });

  const enrichedAddress = {
    streetAddress: `${streetNumber} ${streetName}`,
    subpremise,
    city,
    state,
    zip,
    formatted: first.formatted_address
  };
  return enrichedAddress;
};

/*
// TODO - pull this into a test structure
const success = '1600 Pennsylvania Ave NW, Washington, DC 20500';
const failure = '100000 Ksadf Casdfa, Fakeland ZZ, 23222';

module.exports.checkRegistration(failure);
*/