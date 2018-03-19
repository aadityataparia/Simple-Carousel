// Polyfills
var SUPPORT_PASSIVE = false;
try {
  let opts = Object.defineProperty({}, 'passive', {
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
    for (let key in array) {
      if (array.hasOwnProperty(key) && array[key] && key != "length") {
        callback.call(array[key], array[key], key);
      }
    }
  } else if(Array.isArray(array)) {
    if (array.length < 1) {
      return false;
    }
    for (let i = 0; i < array.length; i++) {
      callback.call(array[i], array[i], i);
    }
  } else {
    callback.call(array, array, 0);
  }
};
function siblings(elem, selector) {
  let r = [];
  let childs = elem.parentElement.children;
  forEach(childs, function(child) {
    if (child.matches(selector)) {
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

function children(elem, selector) {
  let c = elem.children;
  let r = [];
  if (!c) {
    return false;
  }
  for (let i = 0; i < c.length; i++) {
    if (c[i].matches(selector)) {
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
  return elem.classList.contains(classN);
}

function addClass(elem, classN) {
  if (typeof elem == "string") {
    elem = document.querySelector(elem);
  }
  if (!elem) {
    return false;
  }
  elem.classList.add(classN);
}

function removeClass(elem, classN) {
  if (typeof elem == "string") {
    elem = document.querySelector(elem);
  }
  if (!elem) {
    return false;
  }
  elem.classList.remove(classN);
}

Array.prototype.remove = function() {
  let what, a = arguments,
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
  for (let j = 0; j < elems.length; j++) {
    j !== index && elems[j] !== index ? removeClass(elems[j], classN) : addClass(elems[j], classN);
  }
}

function toggleClass(element, classN) {
  hasClass(element, classN) ? removeClass(element, classN) : addClass(element, classN);
}
// carousel js
class SC {
  constructor(main, params = {}){
    this.main = main;
    const defaultParams = {
      cards: main.querySelectorAll(".scrollD > *"),
      ra: main.querySelector(".r"),
      la: main.querySelector(".l"),
      fs: main.querySelector(".fs"),
      num: main.querySelector(".num"),
      loading: main.querySelector(".loading"),
      showLoading: true,
      loop: false
    }
    Object.assign(this, defaultParams, params);
    this.totalCards = this.cards.length;
    if (!this.showLoading){
      this.loading.style.display = "none";
    }
    if (this.totalCards == 1){
      this.hideArrows();
    }
    this.setClickHandlers();
    this.active = 0;
    SC.addSC(this);
  }
  hideArrows(){
    this.la.style.display = "none";
    this.ra.style.display = "none";
  }
  setClickHandlers(){
    let me = this;
    if (this.la) {
      this.la.addEventListener('click', function() {
        me.prev();
      }, ELopt);
    }
    if (this.ra) {
      this.ra.addEventListener('click', function() {
        me.next();
      }, ELopt);
    }
    if (this.fs) {
      this.fs.addEventListener('click', function() {
        toggleClass(me.main, 'fullscreen');
        toggleClass(document.body, 'noscroll');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }, ELopt);
    }
  }
  get active(){
    return this._active;
  }
  set active(i){
    i = this.getCardNumber(i);
    this._active = i;
    removeExceptOne(this.cards, "active", i);
    removeExceptOne(this.cards, "prev", this.getCardNumber(i - 1));
    removeExceptOne(this.cards, "next", this.getCardNumber(i + 1));
    if (this.cards[i] && !this.cards[i].getAttribute("src")) {
      this.cards[i].setAttribute("src", this.cards[i].getAttribute("data-src"));
    }
    this.setNumber(i);
    this.la.style.display = this.hasPrev() ? "block" : "none";
    this.ra.style.display = this.hasNext() ? "block" : "none";
  }
  getCardNumber(i){
    let l = this.totalCards;
    return i < 0 ? i + l : i % l;
  }
  next(){
    if (this.hasNext()) {
      this.active = this._active + 1;
    }
  }
  hasNext(){
    if (this.active == this.totalCards - 1 && !this.loop){
      return false;
    }
    return true;
  }
  prev(){
    if (this.hasPrev()) {
      this.active = this._active - 1;
    }
  }
  hasPrev(){
    if (this.active == 0 && !this.loop){
      return false;
    }
    return true;
  }
  setNumber(i){
    if (this.num) {
      if (this.num.childNodes.length < 2) {
        this.num.innerHTML = i + 1 + "/" + this.totalCards;
      } else {
        const x = i + 1;
        removeExceptOne(this.num.children, "active", this.num.querySelector('[data-card="' + x + '"]'));
      }
    }
  }
  static new(main, params = {}){
    return new SC(main, params);
  }
  static all(){
    return this.scs;
  }
  static addSC(i){
    this.scs = this.scs || [];
    this.scs.push(i);
  }
}
