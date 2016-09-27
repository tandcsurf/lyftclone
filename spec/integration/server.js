const expect = require('chai').expect;
const request = require('request');

'use strict'

describe('API server ',function(){

  describe('Driver requests',function(){

    it('/pickups? sends current driver pickup address in response body',function(done){

      request('http://localhost:1337/pickups?',function(error,response,body){
        expect(body).to.equal('22 whatever street');
	      done();
      });

    });

  });

  describe('Passenger requests',function(){

    it('sends new passnger pickup address in response body',function(done){

      const requestedAddress = '123 whatever street';
      const urlFormatAddress = requestedAddress.split(' ').join('+');

      request('http://localhost:1337/'+urlFormatAddress,function(error,response,body){
	console.log(body);
        expect(body).to.equal('Sending a driver to you at: ' + requestedAddress);
	done();
      });

    });

  });


});
