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
  var el = [];

  i.settings = _.extend(i.settings, userSettings);
  cls.add(element, 'ps-theme-' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  if (i.settings.scrollAwareShadows) {
    if (userSettings.extraShadowContainers) {
      var elements = userSettings.extraShadowContainers.top;
      bindReachStartEndEventsHandler(element, elements);
      for (var j = 0; j < elements.length; j++) {
        e.push(instances.add(elements[j]));
        cls.add(elements[j], 'ps-container');
        cls.add(elements[j], 'ps-theme-' + i.settings.theme);

        // Shadows
        e[j].elementLeft = dom.appendTo(dom.e('div', 'ps-shadow-x-left'), elements[j]);
        e[j].elementRight = dom.appendTo(dom.e('div', 'ps-shadow-x-right'), elements[j]);
      }
      updateGeometry(element, userSettings.extraShadowContainers.top, 'top');

      if (userSettings.extraShadowContainers.left) {
        var elementsLeft = userSettings.extraShadowContainers.left;
        bindReachStartEndEventsHandler(element, elementsLeft);
        for (var k = 0; k < elementsLeft.length; k++) {
          el.push(instances.add(elementsLeft[k]));
          cls.add(elementsLeft[k], 'ps-container');
          cls.add(elementsLeft[k], 'ps-theme-' + i.settings.theme);

          // Shadows
          el[k].elementTop = dom.appendTo(dom.e('div', 'ps-shadow-y-top'), elementsLeft[k]);
          el[k].elementBottom = dom.appendTo(dom.e('div', 'ps-shadow-y-bottom'), elementsLeft[k]);
        }
        updateGeometry(element, userSettings.extraShadowContainers.left, 'left');
      }
    }
  }
  bindReachStartEndEventsHandler(element);
  updateGeometry(element);

};
