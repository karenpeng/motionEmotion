(function (exports) {

  function Tri(width, height) {
    this.a = [Math.random() * width, Math.random() * height];
    this.b = [this.a[0] + Math.random() * 300 - 150, this.a[1] + Math.random() * 300 - 150];
    this.c = [this.a[0] + Math.random() * 200 - 100, this.a[1] + Math.random() * 200 - 100];
    this.av = [Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3];
    this.bv = [this.av[0] + Math.random() * 0.2 - 0.1, this.av[1] + Math.random() * 0.2 - 0.1];
    this.cv = [this.av[0] + Math.random() * 0.2 - 0.1, this.av[1] + Math.random() * 0.2 - 0.1];
  }

  Tri.prototype.update = function () {
    this.a[0] += this.av[0];
    this.a[1] += this.av[1];
    this.b[0] += this.bv[0];
    this.b[1] += this.bv[1];
    this.c[0] += this.cv[0];
    this.c[1] += this.cv[1];
  };

  Tri.prototype.draw = function (ctx) {
    ctx.strokeStyle = '#3f3f3f';
    ctx.beginPath();
    ctx.moveTo(this.a[0], this.a[1]);
    ctx.lineTo(this.b[0], this.b[1]);
    ctx.lineTo(this.c[0], this.c[1]);
    ctx.closePath();
    ctx.stroke();
  };

  function BgShapes(can) {
    this.can = can;
    this.ctx = this.can.getContext('2d');
    this.width = this.can.width;
    this.height = this.can.height;
    this.tris = [];
    for (var i = 0; i < 36; i++) {
      this.tris.push(new Tri(this.width, this.height));
    }
  }
  BgShapes.prototype.update = function () {
    this.tris.forEach(function (t) {
      t.update();
    });
  };

  BgShapes.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
    var that = this;
    this.tris.forEach(function (t) {
      t.draw(that.ctx);
    });
  };

  exports.BgShapes = BgShapes;

})(this);