'use strict';

var cls = require('./class');
var dom = require('./dom');

var toInt = exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

var clone = exports.clone = function (obj) {
  if (!obj) {
    return null;
  } else if (obj.constructor === Array) {
    return obj.map(clone);
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = clone(original);
  for (var key in source) {
    if (typeof result[key] !== 'undefined') {
      result[key] = clone(source[key]);
    }
  }
  return result;
};

exports.isEditable = function (el) {
  return dom.matches(el, "input,[contenteditable]") ||
    dom.matches(el, "select,[contenteditable]") ||
    dom.matches(el, "textarea,[contenteditable]") ||
    dom.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return toInt(dom.css(element, 'width')) +
    toInt(dom.css(element, 'paddingLeft')) +
    toInt(dom.css(element, 'paddingRight')) +
    toInt(dom.css(element, 'borderLeftWidth')) +
    toInt(dom.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
// exports.throttle = function (func, wait, options) {
//   var context, args, result;
//   var timeout = null;
//   var previous = 0;
//   if (!options) {
//     options = {};
//   }
//   var later = function () {
//     previous = options.leading === false ? 0 : Date.now();
//     timeout = null;
//     result = func.apply(context, args);
//     if (!timeout) {
//       context = args = null;
//     }
//   };
//   return function () {
//     var now = Date.now();
//     if (!previous && options.leading === false) {
//       previous = now;
//     }
//     var remaining = wait - (now - previous);
//     context = this;
//     args = arguments;
//     if (remaining <= 0 || remaining > wait) {
//       if (timeout) {
//         clearTimeout(timeout);
//         timeout = null;
//       }
//       previous = now;
//       result = func.apply(context, args);
//       if (!timeout) {
//         context = args = null;
//       }
//     } else if (!timeout && options.trailing !== false) {
//       timeout = setTimeout(later, remaining);
//     }
//     return result;
//   };
// };

exports.throttle = function (func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function () {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      }
    }
  };

  return function () {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};
