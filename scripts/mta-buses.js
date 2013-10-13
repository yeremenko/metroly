// Scrape the MTA routes site: http://bustime.mta.info/routes/
// This is a temporary solution, while the MTA works on getting
// all bus lines added to the Bus Time program.

var scrape = require('scrape');

var mta = {};

mta.sortDbByBorough = function (buslines) {
  var collected = [];
  buslines.forEach(function (bus) {
    collected.push(bus.name);
  });

  return mta.sortByBorough(collected);
}

mta.sortByBorough = function (buslines) {
  var buses = {};
  buses.brooklyn = [];
  buses.bronx = [];
  buses.queens = [];
  buses.manhattan = [];
  buses.staten_island = [];
  buses.express = [];

  buslines.forEach(function (bus) {
    var busSubstr = bus.substr(0, 2);
    if (busSubstr.search('bx') > -1) {
      buses.bronx.push(bus);
    } else if (busSubstr.search('b') > -1) {
      buses.brooklyn.push(bus);
    } else if (busSubstr.search('m') > -1) {
      buses.manhattan.push(bus);
    } else if (busSubstr.search('q') > -1) {
      buses.queens.push(bus);
    } else if (busSubstr.search('s') > -1) {
      buses.staten_island.push(bus);
    } else if (busSubstr.search('x') > -1) {
      buses.express.push(bus);
    }
  });

  return buses;
}

mta.getBusLines = function (cb) {

  scrape.request('http://bustime.mta.info/routes/', function (err, $) {
    if (err) return console.error(err);

    var collected = [];

    $('ul.routeList li').each(function (li) {
      var nameLink = li.find('p.name').find('a')[0];
      var href = nameLink.attribs.href;
      var busline = href.split('#')[1].toLowerCase();
      collected.push(busline);
    });

    cb(mta.sortByBorough(collected));
  });
}

module.exports = mta;

function saveToDb (buses, cb) {
  var mongoose = require('mongoose')
    , config = require('../config')
    , city;

  mongoose.connect(config.MONGO_URL);
  require('../schemas.js')(null, mongoose);

  var busline, BusLine = mongoose.model('BusLine');

  console.log('Got this data ');

  for (city in buses) {
    console.log('iter');

    buses[city].forEach(function (busline) {
      BusLine.findOne({name: busline}, function (err, bus) {
        console.log('inside of findOne');

        if (err) return console.error(err);

        if (bus) {
          return console.log(busline, ' already exists.');
        } else {
          console.log('will try to save ');
          var bus = new BusLine();
          bus.name = busline;
          bus.agency = 'mta';
          bus.city = 'nyc';
          bus.save();
          console.log('Saved ', busline);
        }
      });
    })
  }
}

function main () {

  var buslines
    , program = require('commander')

  program
    .command('run')
    .description('Runs the mta bus route scraper')
    .action (function (name) {
      mta.getBusLines(function (buses) {
        var readline = require('readline');

        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        console.log(buses);

        rl.question('Do those buses look good? (y/n) ', function (answer) {

          if (answer === 'y') {
            saveToDb(buses, function () {
              console.log('called!');
            });
            console.log('Will save to the database.');
          } else {
            console.log('Will not save.');
          }
          rl.close();
        });

      });
    });

  program.parse(process.argv);
}

if (require.main === module) {
  main();
}