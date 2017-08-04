'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');

// Handlers
var handlers = {
  'click-rail': require('./handler/click-rail'),
  'drag-scrollbar': require('./handler/drag-scrollbar'),
  'keyboard': require('./handler/keyboard'),
  'wheel': require('./handler/mouse-wheel'),
  'touch': require('./handler/touch'),
  'selection': require('./handler/selection')
};
var nativeScrollHandler = require('./handler/native-scroll');
var bindReachStartEndEventsHandler = require('./handler/shadows');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);
  var e = [];

  i.settings = _.extend(i.settings, userSettings);
  cls.add(element, 'ps-theme-' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  if (i.settings.scrollAwareShadows) {
    if (userSettings.extraShadowContainers) {
      var elements = userSettings.extraShadowContainers;
      bindReachStartEndEventsHandler(element, elements);
      for (var j = 0; j < elements.length; j++) {
        e.push(instances.add(elements[j]));
        cls.add(elements[j], 'ps-container');
        cls.add(elements[j], 'ps-theme-' + i.settings.theme);

        // Shadows
        e[j].elementLeft = dom.appendTo(dom.e('div', 'ps-shadow-x-left'), elements[j]);
        e[j].elementRight = dom.appendTo(dom.e('div', 'ps-shadow-x-right'), elements[j]);
        e[j].elementTop = dom.appendTo(dom.e('div', 'ps-shadow-y-top'), elements[j]);
        e[j].elementBottom = dom.appendTo(dom.e('div', 'ps-shadow-y-bottom'), elements[j]);
      }
    } else {
      bindReachStartEndEventsHandler(element);
    }
  }

  updateGeometry(element, userSettings.extraShadowContainers);
};
