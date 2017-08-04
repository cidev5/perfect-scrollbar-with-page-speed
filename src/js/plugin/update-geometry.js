'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateScroll = require('./update-scroll');

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = { width: i.railXWidth };
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  dom.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = { top: element.scrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  dom.css(i.scrollbarYRail, yRailOffset);

  dom.css(i.scrollbarX, { left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth });
  dom.css(i.scrollbarY, { top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth });
}

function updateShadowCss(element, i, e, el, elements, elementsLeft) {
  var width = _.toInt(dom.css(element, 'width'));
  var shadowYTop = { width: width };
  var shadowYBottom = { width: width };
  shadowYTop.left = element.scrollLeft;
  shadowYBottom.left = element.scrollLeft;
  shadowYTop.top = _.toInt(dom.css(i.scrollbarYRail, 'top'));
  shadowYBottom.bottom = -element.scrollTop;

  dom.css(i.shadowYTop, shadowYTop);
  dom.css(i.shadowYBottom, shadowYBottom);

  var height = _.toInt(dom.css(element, 'height'));
  var shadowXLeft = { top: element.scrollTop, height: height };
  var shadowXRight = { top: element.scrollTop, height: height };
  shadowXLeft.left = _.toInt(dom.css(i.scrollbarXRail, 'left'));
  shadowXRight.right = -element.scrollLeft;

  dom.css(i.shadowXLeft, shadowXLeft);
  dom.css(i.shadowXRight, shadowXRight);

  if (typeof elements !== 'undefined') {
    for (var j = 0; j < elements.length; j++) {
      var extraHeight = _.toInt(dom.css(elements[j], 'height'));
      var extraShadowXLeft = { top: elements[j].scrollTop, height: extraHeight };
      var extraShadowXRight = { top: elements[j].scrollTop, height: extraHeight };
      extraShadowXLeft.left = shadowXLeft.left;
      extraShadowXRight.right = shadowXRight.right;
      dom.css(e[j].elementLeft, extraShadowXLeft);
      dom.css(e[j].elementRight, extraShadowXRight);

      if (i.scrollbarXActive) {
        cls.add(elements[j], 'ps-active-x');
      } else {
        cls.remove(elements[j], 'ps-active-x');
        updateScroll(elements[j], 'left', 0);
      }
    }
    if (typeof elementsLeft !== 'undefined') {
      for (var k = 0; k < elementsLeft.length; k++) {
        var extraWidth = _.toInt(dom.css(elementsLeft[k], 'width'));
        var extraShadowYTop = { width: extraWidth };
        var extraShadowYBottom = { width: extraWidth };
        extraShadowYTop.top = _.toInt(dom.css(i.scrollbarYRail, 'top'));
        extraShadowYBottom.bottom = -element.scrollTop;
        dom.css(el[k].elementTop, extraShadowYTop);
        dom.css(el[k].elementBottom, extraShadowYBottom);

        if (i.scrollbarYActive) {
          cls.add(elementsLeft[k], 'ps-active-y');
        } else {
          cls.remove(elementsLeft[k], 'ps-active-y');
          updateScroll(elementsLeft[k], 'top', 0);
        }
      }
    }
  }
}

module.exports = function (element, elements) {
  var i = instances.get(element);
  var e = [];
  var el = [];

  if (elements && elements.top) {
    var top = elements.top;
    for (var j = 0; j < top.length; j++) {
      e.push(instances.get(top[j]));
    }
    if (elements.left) {
      var left = elements.left;
      for (var k = 0; k < left.length; k++) {
        el.push(instances.get(left[k]));
      }
    }
  }

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, _.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = _.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, _.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = _.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);
  if (i.settings.scrollAwareShadows) {
    if (elements) {
      updateShadowCss(element, i, e, el, elements.top, elements.left);
    } else {
      updateShadowCss(element, i, e);
    }
  }

  if (i.scrollbarXActive) {
    cls.add(element, 'ps-active-x');
  } else {
    cls.remove(element, 'ps-active-x');
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    updateScroll(element, 'left', 0);
  }
  if (i.scrollbarYActive) {
    cls.add(element, 'ps-active-y');
  } else {
    cls.remove(element, 'ps-active-y');
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }


};
