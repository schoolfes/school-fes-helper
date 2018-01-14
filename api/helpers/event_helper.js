'use strict';

var rp = require('request-promise');
var moment = require('moment');

var Event = function (response) {
    this.name = response.japanese_name;
    this.beginning = moment(response.beginning);
    this.end = moment(response.end);
};

function getLatestEvent() {
    return new Promise(function (resolve, reject) {
        rp({
            uri: 'http://schoolido.lu/api/cacheddata/',
            json: true
        })
            .then(function (response) {
                var current_event_japanese_name = response.current_event_jp.japanese_name;
                return rp({
                    uri: 'http://schoolido.lu/api/events/' + current_event_japanese_name,
                    json: true
                });
            })
            .then(function (response) {
                var event = new Event(response);
                resolve(event);
            })
            .catch(function (err) {
                console.log(err);
                reject(err);
            });
    });
}

module.exports = {
    getLatestEvent
};
