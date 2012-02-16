/**
 * @fileOverview Pelimekaniikka, luokan {@link Game} toteutus
 */

/**
 * Konstruktori uudelle pelille
 *
 * @class Pelin toteutus
 *
 * @param {String} containerId  Sen DOM-elementin ID, johon kaikki <canvas>-tagit tulevat.
 */
Game = function (containerId) {
  "use strict";

  /**
   * Pelin container, DOMElement
   */
  this.container = document.getElementById(containerId);

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
 */
Game.prototype.init = function () {
  "use strict";

  var g = this;

  // Alustetaan asetukset oletuksilla
  Sergei.extend(g.config, Sergei.defaults);

  // Ladataan kuvat
  Sergei.loadImages([
    'sergei.png',
    'stages/00_verstas.png'
  ], function (images) {
    // Kun tätä funktiota kutsutaan, on kaikki kuvat ladattu.
    g.initImages(images);
  });

  // Käynnistetään peli
  g.tick(Date.now());

  // Tulostetaan FPS vasempaan yläkulmaan sekunnin välein
  g._fpsCounter.$obj = jQuery('<div id="fps"></div>').prependTo('body').text('FPS: 0');
  setInterval(function () {
    g._fpsCounter.$obj.text('FPS: ' + (1000 / g._fpsCounter.frameTime).toFixed(1));
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
      g = this;

  // Lasketaan FPS -- http://stackoverflow.com/a/5111475/1152564
  g._fpsCounter.frameTime += (diff - g._fpsCounter.frameTime) / 20;

  requestAnimFrame(function () {
    g.tick(start);
  });
};

/**
 * Alustaa kuvat, kun ne on ladattu.
 *
 * @param {Object} images  Ladatut kuvat objektissa, jonka kentät ovat kuvien polut ja ne sisältävät
 *                         ladatut Image()-luokan instanssit.
 */
Game.prototype.initImages = function (images) {
  var g = this,
      bgLayer = new Kinetic.Layer('background'),
      bgShape,
      sergeiShape;

  g.images = images;
  g.loading = false;

  // Asetetaan pelin tausta, jota ei tarvitse päivittää koko ajan
  g.background = new Kinetic.Stage(g.container, g.config.width, g.config.height);

  // Taustakuvan Kinetic.Shape
  bgShape = new Kinetic.Shape(function () {
    // Tämä hoitaa bgShape:n piirron
    var context = this.getContext();
    context.drawImage(g.images['stages/00_verstas.png'], 0, 0, g.config.width, g.config.height);
  });

  // Sergein Kinetic.Shape
  sergeiShape = new Kinetic.Shape(function () {
    var context = this.getContext(),
        img = g.images['sergei.png'],
        x = (g.config.width - img.width) / 2,
        y = (g.config.height - img.height) / 2;
    context.drawImage(img, x, y, img.width, img.height);

    // Piirretään näkymätön suorakulmio, jotta tähän muotoon voitaisiin tarttua.
    context.beginPath();
    context.rect(x, y, img.width, img.height);
    context.closePath();
  });

  // Drag 'n' drop Sergeille
  sergeiShape.draggable(true);

  // Lisätään taustakerroksen ja Sergein Kinetic.Shape-instanssit taustakerrokseen
  bgLayer.add(bgShape);
  bgLayer.add(sergeiShape);

  // Lisätään taustakerros taustaan
  g.background.add(bgLayer);

  // Piirretään tausta. Koska tausta ei muutu jatkuvasti, ei piirtoa tarvitse kutsua kuin kerran.
  g.background.draw();
};
