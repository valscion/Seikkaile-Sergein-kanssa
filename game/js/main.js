/**
 * @fileOverview {@link Sergei} nimiavaruus
 */

/**
 * @namespace Pelin nimiavaruus
 */
var Sergei = {
  /**
   * Nykyinen peli
   * @type Game
   */
  game: null,

  /**
   * Alustus. Kutsutaan heti kun DOM ready.
   * @param {String} containerId  Sen DOM-elementin ID, johon kaikki <canvas>-tagit tulevat.
   */
  init: function (containerId) {
    "use strict";

    Sergei.game = new Game(containerId);
    Sergei.game.init();
  },

  /**
   * Kuvien lataus.
   * @param {Array} sources  Kuvien suhtelliset polut media-kansion sisällä
   * @param {Function} callback  Tätä funktiota kutsutaan, kun kaikki kuvat on ladattu. Funktio saa
   *                             parametrikseen ladatut kuvat objektissa, jonka kentät ovat kuvien
   *                             polut ja ne sisältävät ladatut Image()-luokan instanssit.
   */
  loadImages: function (sources, callback) {
    "use strict";

    var paths = [],
        images = {},
        loadedImages = 0,
        numImages = 0,
        i;
    for (i = 0; i < sources.length; i++) {
      numImages++;
      paths[i] = 'media/' + sources[i];
    }
    for (i = 0; i < sources.length; i++) {
      images[sources[i]] = new Image();
      images[sources[i]].onload = function(){
        if (++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[sources[i]].src = paths[i];
    }
  },

  /**
   * Laajentaa objektia toisella objektilla.
   *
   * @param obj1  Mitä objektia laajennetaan
   * @param obj2  Mistä objektista kopioidaan
   */
  extend: function (obj1, obj2) {
    "use strict";

    for (var key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        obj1[key] = obj2[key];
      }
    }
  }
};

/**
 * @namespace Oletusasetukset
 */
Sergei.defaults = {
  /** Pelialueen leveys */
  width: 800,

  /** Pelialueen korkeus */
  height: 600
};
