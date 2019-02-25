"use strict";

var binding = require('bindings')('node_dht_sensor');

var DHT = function (type, pin) {
	this.read = function () {
		return binding.readSpec(type, pin);
	};
};

var DHT11 = function (pin) {
	return new DHT(11, pin);
};

var DHT22 = function (pin) {
	return new DHT(22, pin);
};

exports.DHT11 = DHT11;
exports.DHT22 = DHT22;