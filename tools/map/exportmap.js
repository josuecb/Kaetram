#!/usr/bin/env node
var util = require('util'),
    Log = require('log'),
    path = require("path"),
    fs = require("fs"),
    file = require('../file'),
    processMap = require('./processmap'),
    log = new Log(Log.DEBUG),
    source = process.argv[2];

function getMap() {
    var self = this;

    file.exists(source, function(exists) {
        if (!exists) {
            log.error('The file: ' + source + ' could not be found.');
            return;
        }

        fs.readFile(source, function(error, file) {
            onMap(JSON.parse(file.toString()));
        });
    });
}

function onMap(data) {
    parseClient(data, '../../client/data/maps/world_client');
    parseServer(data, '../../server/data/map/world_server.json');
}

function parseClient(data, destination) {
    var map = JSON.stringify(processMap(data, {
        mode: 'client'
    }));

    fs.writeFile(destination + '.json', map, function(err, file) {
        if (err)
            log.error(JSON.stringify(err));
        else
            log.info('[Client] Map saved at: ' + destination + '.json');
    });


    //Transform into a .js for Web Worker (will be removed when region parsing is ready)
    map = 'var mapData = ' + map;

    fs.writeFile(destination + '.js', map, function(err, file) {
        if (err)
            log.error(JSON.stringify(err));
        else
            log.info('[Client] Map saved at: ' + destination + '.js');
    });
}

function parseServer(data, destination) {
    var map = JSON.stringify(processMap(data, {
        mode: 'server'
    }));

    fs.writeFile(destination, map, function(err, file) {
        if (err)
            log.error(JSON.stringify(err));
        else
            log.info('[Server] Map saved at: ' + destination + '.json');
    });
}

getMap();
