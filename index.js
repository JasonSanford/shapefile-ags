#!/usr/bin/env node

var fs = require('fs');

var minimist    = require('minimist');
var AgsStream   = require('ags-stream');
var terraformer = require('terraformer-arcgis-parser');
var shpwrite    = require('shp-write');

var argv = minimist(process.argv.slice(2));

if (argv._.length < 1) {
  console.log('A url must be passed.');
  return;
}

var where      = argv.where;
var serviceUrl = argv._[0];
var chunkSize  = argv['chunk-size'] || 50;
var outSR      = argv['out-sr'];

var options = {
  outSR     : outSR,
  where     : where,
  chunkSize : chunkSize
};

var agsStream = new AgsStream(serviceUrl, options);
var features  = [];

agsStream.on('data', function (data) {
  data.forEach(function (feature) {
    var geojsonFeature = terraformer.parse(feature);

    // JSZip chokes on properties with null values. Remove them.
    Object.keys(geojsonFeature.properties).forEach(function (key) {
      if (geojsonFeature.properties[key] === null) {
        delete geojsonFeature.properties[key];
      }
    });

    features.push(geojsonFeature);
  });
});

agsStream.on('error', function (error) {
  console.log('Oh boy, this happened: ', error);
});

agsStream.on('end', function () {
  var featureCollection = {
    type     : 'FeatureCollection',
    features : features
  };

  var zipped = shpwrite.zip(featureCollection);
  fs.writeFileSync('shapefile.zip', zipped);
});

agsStream.read()