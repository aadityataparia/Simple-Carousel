var cors = [],
  corsl = [],
  corscards = [];;
var SUPPORT_PASSIVE = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      SUPPORT_PASSIVE = true;
    }
  });
  window.addEventListener("test", null, opts);
} catch (e) {}

if (SUPPORT_PASSIVE) {
  var ELopt = {
    passive: true,
    capture: false
  };
} else {
  var ELopt = false;
}
// Polyfills
function forEach(array, callback) {
  if (typeof array == 'object' && array != null && array) {
    for (var key in array) {
      if (array.hasOwnProperty(key) && array[key] && key != "length") {
        callback.call(array[i], array[key], key);
      }
    }
  } else if(Array.isArray(array)) {
    if (array.length < 1) {
      return false;
    }
    for (var i = 0; i < array.length; i++) {
      callback.call(array[i], array[i], i);
    }
  } else {
    callback.call(array, array, 0);
  }
};
function siblings(elem, classN) {
  var r = [];
  var childs = children(elem.parentElement, '*');
  forEach(childs, function(child) {
    if (child.matches(classN)) {
      r.push(child);
    }
  });
  return r;
}

function parent(x, k) {
  while (x) {
    if (x.matches(k)) {
      return x;
    }
    x = x.parentElement;
  }
  return false;
}

function children(elem, classN) {
  var c = elem.children;
  var r = [];
  if (!c) {
    return false;
  }
  for (var i = 0; i < c.length; i++) {
    if (c[i].matches(classN)) {
      r.push(c[i]);
    }
  }
  return r;
}

function hasClass(elem, classN) {
  if (typeof elem == "string") {
    elem = document.querySelector(elem);
  }
  if (!elem) {
    return false;
  }
  var classes = elem.className.split(" ");
  return classes.indexOf(classN) > -1;
}

function addClass(elem, classN) {
  if (typeof elem == "string") {
    elem = document.querySelector(elem);
  }
  if (!elem) {
    return false;
  }
  if (elem.className.length < 1) {
    elem.className = classN;
  }
  var classes = elem.className.split(" ");
  if (classes.indexOf(classN) < 0) {
    classes.push(classN);
  }
  elem.className = classes.join(" ");
}

function removeClass(elem, classN) {
  if (typeof elem == "string") {
    elem = document.querySelector(elem);
  }
  if (!elem) {
    return false;
  }
  var classes = elem.className.split(" ");
  classes.remove(classN);
  elem.className = classes.join(" ");
}

Array.prototype.remove = function() {
  var what, a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

function removeExceptOne(elems, classN, index) {
  for (var j = 0; j < elems.length; j++) {
    if (j !== index) {
      removeClass(elems[j], classN);
    } else {
      addClass(elems[j], classN);
    }
  }
}

// carousel js
function toggleFullScreen(element) {
  var fsenabled = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement;
  if (fsenabled) {
    var requestMethod = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (requestMethod) {
      requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{ESC}");
      }
    }
  } else {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) {
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }
}

function makeCorousel(main, cardC, rightC, leftC, fsC) {
  activeC = "active";
  cardC = typeof cardC !== 'undefined' ? cardC : "img";
  rightC = typeof rightC !== 'undefined' ? rightC : ".r";
  leftC = typeof leftC !== 'undefined' ? leftC : ".l";
  fsC = typeof fsC !== 'undefined' ? fsC : ".fs";
  var cards = main.querySelectorAll(".scrollD img");
  console.log(cards);
  var ra = main.querySelector(rightC);
  var la = main.querySelector(leftC);
  var fs = main.querySelector(fsC);
  var num = main.querySelector(".num");
  if (cards.length < 2 && ra && la) {
    ra.style.display = "none";
    la.style.display = "none";
  }
  var aI = 0;
  var l = cards.length;
  if (cors.indexOf(main) > -1) {
    corsl[cors.indexOf(main)] = l;
    var index = cors.indexOf(main);
    corscards[index] = cards;
    makeActive(aI, index);
    return;
  } else {
    var k = cors.push(main);
    corsl[cors.indexOf(main)] = l;
    var index = cors.indexOf(main);
    corscards[index] = cards;
  }
  makeActive(aI, index);
  if (ra) {
    ra.addEventListener('click', function() {
      l = corsl[index];
      aI++;
      aI = aI % l;
      makeActive(aI, index);
    }, ELopt);
  }
  if (la) {
    la.addEventListener('click', function() {
      l = corsl[cors.indexOf(main)];
      aI--;
      if (aI < 0) {
        aI = aI + l;
      }
      makeActive(aI, index);
    }, ELopt);
  }
  if (fs) {
    fs.addEventListener('click', function() {
      toggleFullScreen(main);
    }, ELopt);
  }

  function makeActive(i, j) {
    removeExceptOne(corscards[j], activeC, i);
    i = i == 0 ? i + l : i;
    removeExceptOne(corscards[j], "prev", i - 1);
    i = i == l ? i - l : i;
    removeExceptOne(corscards[j], "next", i + 1);
    if (corscards[j][i] && !corscards[j][i].getAttribute("src")) {
      corscards[j][i].setAttribute("src", corscards[j][i].getAttribute("data-src"));
    }
    if (num) {
      num.innerHTML = i + 1 + " of " + corscards[j].length;
    }
  }
}

// create carousel for all .cor
forEach(document.querySelectorAll('.cor'), function(e){
  makeCorousel(e);
});
