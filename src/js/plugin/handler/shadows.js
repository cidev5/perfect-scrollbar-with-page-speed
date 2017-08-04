'use strict';

var cls = require('../../lib/class');
var instances = require('../instances');

function bindReachStartEndEventshandler(element, i) {
  i.event.bind(element, 'ps-y-reach-start-more', function () {
    cls.add(element, 'ps-y-reach-start-more');
  });
  i.event.bind(element, 'ps-x-reach-start-more', function () {
    cls.add(element, 'ps-x-reach-start-more');
  });
  i.event.bind(element, 'ps-y-reach-end-more', function () {
    cls.add(element, 'ps-y-reach-end-more');
  });
  i.event.bind(element, 'ps-x-reach-end-more', function () {
    cls.add(element, 'ps-x-reach-end-more');
  });
  i.event.bind(element, 'ps-y-reach-start', function () {
    cls.remove(element, 'ps-y-reach-start-more');
  });
  i.event.bind(element, 'ps-x-reach-start', function () {
    cls.remove(element, 'ps-x-reach-start-more');
  });
  i.event.bind(element, 'ps-y-reach-end', function () {
    cls.remove(element, 'ps-y-reach-end-more');
  });
  i.event.bind(element, 'ps-x-reach-end', function () {
    cls.remove(element, 'ps-x-reach-end-more');
  });
}

function bindReachStartEndEventshandlerMulti(element, i, elements) {
  i.event.bind(element, 'ps-y-reach-start-more', function () {
    cls.addMulti(elements, 'ps-y-reach-start-more');
  });
  i.event.bind(element, 'ps-x-reach-start-more', function () {
    cls.addMulti(elements, 'ps-x-reach-start-more');
  });
  i.event.bind(element, 'ps-y-reach-end-more', function () {
    cls.addMulti(elements, 'ps-y-reach-end-more');
  });
  i.event.bind(element, 'ps-x-reach-end-more', function () {
    cls.addMulti(elements, 'ps-x-reach-end-more');
  });
  i.event.bind(element, 'ps-y-reach-start', function () {
    cls.removeMulti(elements, 'ps-y-reach-start-more');
  });
  i.event.bind(element, 'ps-x-reach-start', function () {
    cls.removeMulti(elements, 'ps-x-reach-start-more');
  });
  i.event.bind(element, 'ps-y-reach-end', function () {
    cls.removeMulti(elements, 'ps-y-reach-end-more');
  });
  i.event.bind(element, 'ps-x-reach-end', function () {
    cls.removeMulti(elements, 'ps-x-reach-end-more');
  });
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
