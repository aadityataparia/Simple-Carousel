// Polyfills
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
  }
} else {
var ELopt = false;
}
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
var SC = {
  new: function(main) {
    let cardC = "img";
    let rightC = ".r";
    let leftC = ".l";
    let fsC = ".fs";
    let cards = main.querySelectorAll(".scrollD img");
    let ra = main.querySelector(rightC);
    let la = main.querySelector(leftC);
    let fs = main.querySelector(fsC);
    let num = main.querySelector(".num");
    if (cards.length < 2 && ra && la) {
      ra.style.display = "none";
      la.style.display = "none";
    }
    let aI = 0;
    let l = cards.length;
    if (SC.cors.indexOf(main) > -1) {
      SC.corsl[SC.cors.indexOf(main)] = l;
      let index = SC.cors.indexOf(main);
      SC.corscards[index] = cards;
      makeActive(aI, index);
      return;
    } else {
      let k = SC.cors.push(main);
      SC.corsl[SC.cors.indexOf(main)] = l;
      let index = SC.cors.indexOf(main);
      SC.corscards[index] = cards;
    }
    SC.makeActive(aI, index);
    if (ra) {
      ra.addEventListener('click', function() {
        l = SC.corsl[index];
        aI++;
        aI = aI % l;
        SC.makeActive(aI, index);
      }, ELopt);
    }
    if (la) {
      la.addEventListener('click', function() {
        l = SC.corsl[SC.cors.indexOf(main)];
        aI--;
        if (aI < 0) {
          aI = aI + l;
        }
        SC.makeActive(aI, index);
      }, ELopt);
    }
    if (fs) {
      let fsenabled = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement;
      if (typeof fsenabled === 'undefined') {
        fs.style.display = 'none';
      } else {
        fs.addEventListener('click', function() {
          toggleFullScreen(main);
        }, ELopt);
      }
    }
    if (num) {
      num.innerHTML = 1 + " of " + l;
      SC.num[index] = num;
    }
  },
  makeActive: function(i, j) {
    let l = SC.corscards[j].length;
    removeExceptOne(SC.corscards[j], "active", i);
    i = i == 0 ? i + l : i;
    removeExceptOne(SC.corscards[j], "prev", i - 1);
    i = i == l ? i - l : i;
    removeExceptOne(SC.corscards[j], "next", i + 1);
    if (SC.corscards[j][i] && !SC.corscards[j][i].getAttribute("src")) {
      SC.corscards[j][i].setAttribute("src", SC.corscards[j][i].getAttribute("data-src"));
    }
    if (SC.num[j]) {
      SC.num[j].innerHTML = i + 1 + " of " + l;
    }
  },
  cors: [],
  corsl: [],
  corscards: [],
  num: []
}

// create carousel for all .cor
forEach(document.querySelectorAll('.cor'), function(e){
  SC.new(e);
});
