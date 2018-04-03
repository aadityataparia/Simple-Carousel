// Polyfills
if (typeof SUPPORT_PASSIVE == 'undefined'){
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
}

function removeExceptOne(elems, classN, index) {
  for (let j = 0; j < elems.length; j++) {
    j !== index && elems[j] !== index ? elems[j].classList.remove(classN) : elems[j].classList.add(classN);
  }
}

function toggleClass(element, classN) {
  element.classList.contains(classN) ? element.classList.remove(classN) : element.classList.add(classN);
}
// carousel js
class SC {
  constructor(main, params = {}){
    this.main = main;
    const defaultParams = {
      cards: main.querySelector(".scrollD").children,
      ra: main.querySelector(".r"),
      la: main.querySelector(".l"),
      fs: main.querySelector(".fs"),
      num: main.querySelector(".num"),
      loading: main.querySelector(".loading"),
      showLoading: true,
      loop: false,
      image_size: 'contain'
    }
    Object.assign(defaultParams, params);
    this.setClickHandlers();
    this.refresh(defaultParams);
    SC.addSC(this);
  }
  refresh(params = {}){
    Object.assign(this, params);
    this.totalCards = this.cards.length;
    Array.from(this.cards).forEach(i => i.style.objectFit = this.image_size);
    if (!this.showLoading){
      this.loading.style.display = "none";
    }
    if (this.totalCards == 1){
      this.hideArrows();
    }
    this.active = params.active || this.active || 0;
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
