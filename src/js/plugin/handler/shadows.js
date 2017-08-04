'use strict';

var _ = require('../../lib/helper');
var cls = require('../../lib/class');
var instances = require('../instances');

var THROTTLE_SPEED = 1500;

function bindReachStartEndEventshandler(element, i) {
  i.event.bind(element, 'ps-y-reach-start-more', _.throttle(function () {
    cls.add(element, 'ps-y-reach-start-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-x-reach-start-more', _.throttle(function () {
    cls.add(element, 'ps-x-reach-start-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-y-reach-end-more', _.throttle(function () {
    cls.add(element, 'ps-y-reach-end-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-x-reach-end-more', _.throttle(function () {
    cls.add(element, 'ps-x-reach-end-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-y-reach-start', _.throttle(function () {
    cls.remove(element, 'ps-y-reach-start-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-x-reach-start', _.throttle(function () {
    cls.remove(element, 'ps-x-reach-start-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-y-reach-end', _.throttle(function () {
    cls.remove(element, 'ps-y-reach-end-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-x-reach-end', _.throttle(function () {
    cls.remove(element, 'ps-x-reach-end-more');
  }), THROTTLE_SPEED);
}

function bindReachStartEndEventshandlerMulti(element, i, elements) {
  i.event.bind(element, 'ps-y-reach-start-more', _.throttle(function () {
    cls.addMulti(elements, 'ps-y-reach-start-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-x-reach-start-more', _.throttle(function () {
    cls.addMulti(elements, 'ps-x-reach-start-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-y-reach-end-more', _.throttle(function () {
    cls.addMulti(elements, 'ps-y-reach-end-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-x-reach-end-more', _.throttle(function () {
    cls.addMulti(elements, 'ps-x-reach-end-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-y-reach-start', _.throttle(function () {
    cls.removeMulti(elements, 'ps-y-reach-start-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-x-reach-start', _.throttle(function () {
    cls.removeMulti(elements, 'ps-x-reach-start-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-y-reach-end', _.throttle(function () {
    cls.removeMulti(elements, 'ps-y-reach-end-more');
  }), THROTTLE_SPEED);
  i.event.bind(element, 'ps-x-reach-end', _.throttle(function () {
    cls.removeMulti(elements, 'ps-x-reach-end-more');
  }), THROTTLE_SPEED);
}

module.exports = function (element, extraElements) {
  var i = instances.get(element);
  if (typeof extraElements !== 'undefined') {
    var tempElements = extraElements.slice();
    tempElements.push(element);
    bindReachStartEndEventshandlerMulti(element, i, tempElements);
  } else {
    bindReachStartEndEventshandler(element, i);
  }
};
