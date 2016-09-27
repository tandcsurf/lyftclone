// node server and API plumbing for lyft clone
// basic function: take address submitted as URL, add it to an object that the driver's side of the app listens for

// passenger client side:
// submitting an address as url serves as both intent to be picked up, as well as location for pick-up;
// format: (http://www.lyftcloneAPIserver.com)/1234+streetname+streettype (ie: st, blvd, ln);
// ***improvement: HTML input+button that, on submit, formats the input address into an API-friendly read, adds it to the API web address, and fires it off

// driver client side:
// submitting a url with one-word code to check for available passengers.
// format: (http://www.lyftcloneAPIserver.com)/driver/pickups?/
// ***improvement: create button "i'm available" that makes an API request to server every 30 seconds (use date object?);
// ***improvment2: create button "off duty" to terminate the 30 second request cycle.

// API:

// passenger server side:
// grab URL and parse. Delete forward slash, add appropriate spacing between street name, and street type;
// store end result in an array;
// ***improvement: test for different variations of streettype and standardize them (ie: check for "street" and pass it as "st");

// driver server side:
// grab URL and parse. Delete forward slash, check for string "pickups?";
// if "pickups?" submitted, check passenger address array for changes. If change found, respond to driver client side with address;
// ***improvement: create button "i'm available" that makes an API request to server every 30 seconds. (use date object?);
// ***improvment2: create button "off duty" to terminate the 30 second request cycle.

const http = require('http');
const PORT = 1337;
//create a server with a response handler function as a callback, because node.
var pickups = ["20 whatever street", "30 whatever avenue"];
http.createServer((req, res) => {
//parameters for the head of the response
  res.writeHead(200, {
  'Content-Type': 'text/plain'
  });
  //URL after stripping default forward slash
  var url = req.url.slice(1);
  var onAddressAvail;
  urlTest(url);
  //is it a driver API call or passenger API call? test for driver first
  function urlTest (url) {
    if (url === "pickups?") {
      // check pickups array, return oldest address to driver client
      onAddressAvail = pickups[0];
      if (onAddressAvail === undefined) {
        onAddressAvail = "No pickups needed, sorry dude.";
      }
      pickups.shift();

      console.log(pickups);
      //further functionality: create "accept job" button to remove that address from array
    }
  //if a passenger API call, and the address contains a number, store address in pickups
    else if (url !== "pickups?") {
      //use regExp to check for numbers in URL string
      var hasNumber = /\d/;
      if (hasNumber.test(url) === true) {
        //clean up url for array with regExp
        url = url.replace(/\+/g, " ");
        pickups.push(url);
        //display a verification of the address submitted to the passenger client
        onAddressAvail = "Sending a driver to you at: " + pickups[pickups.length - 1];
        console.log(pickups[0]);
        console.log(pickups);
      }
      else {
        onAddressAvail = "Address must contain a number, followed by the street name, followed by street type"
        // alert error clarifying proper syntax, taunt end user about missing their flight or being late to work if they don't play ball with our syntax that we worked very hard to develop
      }
    }
      // store URL, parsed to look nice, into pickups array.
      // due to variance of submits, may need to simplify this conditional.
      // ^ nested if statements, taking it one at a time? ie number + anystring + approved street type
  }
    res.end(onAddressAvail);
  }).listen(PORT, '127.0.0.1', ()=>{
    console.log('It works!');
  });
