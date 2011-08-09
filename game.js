function Game () {
  var g = this;
  g.objs = [];
  g.init = function (w, h) {
    // Init the canvas
    g.canvas = document.getElementsByTagName("canvas")[0];
    g.canvas.width = w ? w : 800;
    g.canvas.height = h ? h : 600;
    g.context = g.canvas.getContext("2d");
  };
  g.loadObject = function (src) {
    var i = new Sprite(src, g.context);
    g.objs.push(i);
    return i;
  };
  g.clear = function () {
    g.context.clearRect(0, 0, g.canvas.width, g.canvas.height);
  };
  g.drawScreen = function () {
    var len = g.objs.length
    for (var i = 0; i < len; ++i) {
      g.objs[i].draw();
    }
  };
}

function Sprite (img, context) {
  var s = this;
  s.context = context;
  s.x = 0;
  s.y = 0;
  s.img = new Image();
  s.img.src = img;
  s.w = s.img.width;
  s.h = s.img.height;
  s.ready = false;
  s.img.onload = function () {
    s.ready = true;
  };
  s.draw = function (x, y, w, h) {
    if (!x && !y) {
      s.context.drawImage(s.img, s.x, s.y, s.w, s.h);
    } else if (!w && !h) {
      s.context.drawImage(s.img, x, y, s.w, s.h);
    } else {
      s.context.drawImage(s.img, x, y, w, h);
    }
  };
  s.translate = function (x, y) {
    s.x += x;
    s.y += y;
  };
  s.scale = function (w, h) {
    s.w = w;
    s.h = h;
  };
}

window.onload = function () {
  var sergei = new Game();
  sergei.init();

  var bg = sergei.loadObject('verstas.png');
  var Igor = sergei.loadObject('lol.png');
  Igor.translate(100, 100);
  Igor.scale(100,200);
  sergei.drawScreen();
};
