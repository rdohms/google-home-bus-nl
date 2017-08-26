const express = require('express')
const request = require('request')
const R = require('ramda')
const moment = require('moment-timezone');
const app = express()

app.post('/closest-bus', function (req, res) {

  request('http://v0.ovapi.nl/tpc/30008208', function (error, response, body) {
    let data = JSON.parse(body);
    const now = moment().tz("Europe/Amsterdam");
    console.log("now:", now.format('hh:mm:ss'));

    const getNextBus = R.pipe(
      R.values,
      R.map(function (pass) {
        return moment(pass.ExpectedDepartureTime);
      }),
      R.sort(function (a,b) { return a > b}),
      R.filter(function (pass) {
        return pass.diff(now) > 0;
      }),
      R.head
    );

    let next_time = getNextBus(data['30008208'].Passes);

    console.log("next bus:", next_time.format('hh:mm:ss'));

    res.json({
      speech: `Bus 65 will depart ${next_time.from(now)} at ${next_time.format('hh:mm:ss')}`,
      displayText: `Bus 65 will depart ${next_time.from(now)} at ${next_time.format('hh:mm:ss')}`,
      data: {},
      contextOut: [],
      source: "GVB.nl"
    });

  });



})

app.listen(8080, function () {
  console.log('Example app listening on port 3000!')
})
