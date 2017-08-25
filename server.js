const express = require('express')
const request = require('request')
const R = require('ramda')
const moment = require('moment')
const app = express()

app.post('/closest-bus', function (req, res) {

  request('http://v0.ovapi.nl/tpc/30008208', function (error, response, body) {
    let data = JSON.parse(body);
    console.log(data['30008208'].Passes);

    const getNextBus = R.pipe(
      R.values,
      R.map(function (pass) {
        console.log(pass);
        return moment(pass.ExpectedDepartureTime);
      }),
      R.sort(function (a,b) { return a > b}),
      R.filter(function (pass) {
        console.log(pass.diff(moment()))
        return pass.diff(moment()) > 0;
      }),
      R.head
    );

    let next_time = moment(getNextBus(data['30008208'].Passes));

    res.json({
      speech: `Bus 65 will depart ${next_time.fromNow()} at ${next_time.format('hh:mm:ss')}`,
      displayText: `Bus 65 will depart ${next_time.fromNow()} at ${next_time.format('hh:mm:ss')}`,
      data: {},
      contextOut: [],
      source: "GVB.nl"
    });

  });



})

app.listen(8080, function () {
  console.log('Example app listening on port 3000!')
})
