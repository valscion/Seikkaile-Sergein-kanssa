/**
 * @fileOverview Pelimekaniikka, luokan {@link Game} toteutus
 */

/**
 * Konstruktori uudelle pelille
 *
 * @class Pelin toteutus
 */
Game = function () {
  "use strict";

  /**
    * Onko peli latautumassa vasta
    * @type Boolean
    */
  this.loading = true;

  /** Kuvat */
  this.images = {};

  /**
   * Tausta
   * @type Kinetic.Stage
   */
  this.background = null;

  /**
   * Päästage
   * @type Kinetic.Stage
   */
  this.mainstage = null;

  /**
   * Asetukset
   * @see Sergei.defaults
   */
  this.config = {};

  /**
   * FPS:n laskentaan liittyvät jutut
   * @private
   */
  this._fpsCounter = {};
  this._fpsCounter.frameTime = 0;
};

/**
 * Pelin alustus.
 *
 * @param {String} containerId  Sen DOM-elementin ID, johon kaikki <canvas>-tagit tulevat.
 */
Game.prototype.init = function (containerId) {
  "use strict";

  var self = this;

  // Alustetaan asetukset oletuksilla
  Sergei.extend(this.config, Sergei.defaults);

  // Ladataan kuvat
  Sergei.loadImages([
    'sergei.png',
    'stages/00_verstas.png'
  ], function (images) {
    // Kun tätä funktiota kutsutaan, on kaikki kuvat ladattu.
    var bgShape,
        bgLayer = new Kinetic.Layer('background');

    self.images = images;
    self.loading = false;

    // Asetetaan pelin tausta, jota ei tarvitse päivittää koko ajan
    self.background = new Kinetic.Stage(containerId, self.config.width, self.config.height);

    // Taustakuvan Kinetic.Shape
    bgShape = new Kinetic.Shape(function () {
      // Tämä hoitaa bgShape:n piirron
      var context = this.getContext();
      context.drawImage(self.images['stages/00_verstas.png'], 0, 0, self.config.width, self.config.height);
    });

    // Lisätään shape taustakerrokseen
    bgLayer.add(bgShape);

    // Lisätään taustakerros taustaan
    self.background.add(bgLayer);

    // Piirretään tausta. Koska tausta ei muutu jatkuvasti, ei piirtoa tarvitse kutsua kuin kerran.
    self.background.draw();
  });

  // Käynnistetään peli
  this.tick(Date.now());

  // Tulostetaan FPS vasempaan yläkulmaan sekunnin välein
  this._fpsCounter.$obj = jQuery('<div id="fps"></div>').prependTo('body').text('FPS: 0');
  setInterval(function () {
    self._fpsCounter.$obj.text('FPS: ' + (1000 / self._fpsCounter.frameTime).toFixed(1));
  }, 1000);

  debug.info('Sergei - Game initialized');
};

/**
 * Pelin päivitys.
 *
 * @param {Number} time  Millä hetkellä viimeksi aloitettiin tick-funktion kutsu.
 */
Game.prototype.tick = function (time) {
  "use strict";

  var start = Date.now(),
      diff = start - time,
      self = this;

  // Lasketaan FPS -- http://stackoverflow.com/a/5111475/1152564
  this._fpsCounter.frameTime += (diff - this._fpsCounter.frameTime) / 20;

  requestAnimFrame(function () {
    self.tick(start);
  });
};
