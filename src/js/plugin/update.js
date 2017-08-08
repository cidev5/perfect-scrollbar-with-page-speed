'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');
var updateScroll = require('./update-scroll');

module.exports = function (element, userSettings) {
  var i = instances.get(element);
  var e = [];
  var el = [];

  if (!i) {
    return;
  }


  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  dom.css(i.scrollbarXRail, 'display', 'none');
  dom.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  dom.css(i.scrollbarXRail, 'display', '');
  dom.css(i.scrollbarYRail, 'display', '');


  if (i.settings.scrollAwareShadows) {
    if (userSettings && userSettings.extraShadowContainers) {
      for (var j = 0; j < userSettings.extraShadowContainers.top.length; j++) {
        e.push(instances.get(userSettings.extraShadowContainers.top[j]));
      }
      updateGeometry(element, userSettings.extraShadowContainers.top, e, 'top');
      if (userSettings.extraShadowContainers.left) {
        for (var k = 0; k < userSettings.extraShadowContainers.top.length; k++) {
          el.push(instances.get(userSettings.extraShadowContainers.left[k]));
        }
        updateGeometry(element, userSettings.extraShadowContainers.left, el, 'left');
      }
    }
  }
};
