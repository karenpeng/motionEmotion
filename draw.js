(function (exports) {

  function MyTriangle(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.hue = Math.floor(Math.random() * 360);
    this.lightness = Math.floor(Math.random() * 50 + 50);
    this.alpha = 0.9;
    this.lightUp = false;
  }
  MyTriangle.prototype.update = function () {
    this.alpha -= 0.002;
    return this.alpha > 0;
  };

  MyTriangle.prototype.render = function (ctx) {
    var saturation = '100%';
    if (!this.lightUp) {
      ctx.fillStyle = "hsla(" + this.hue.toString() + "," + saturation + "," +
        this.lightness.toString() +
        "%" + "," + this.alpha + ")";
    } else {
      ctx.fillStyle = "hsla(" + this.hue.toString() + "," + saturation + "," +
        this.lightness.toString() +
        "%" + ")";
    }
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(this.a[0], this.a[1]);
    ctx.lineTo(this.b[0], this.b[1]);
    ctx.lineTo(this.c[0], this.c[1]);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  function DrawPoints(can) {
    this.can = can;
    this.ctx = this.can.getContext('2d');
    this.width = this.can.width;
    this.height = this.can.height;
    this.myTriangles = [];
  }

  DrawPoints.prototype.updatePoints = function (points, width, height) {
    this.widthRatio = this.width / width;
    this.heightRatio = this.height / height;
    this.vertices = [];
    for (var i = 0; i < points.length; i++) {
      this.vertices[i] = [points[i].x * this.widthRatio, points[i].y * this.heightRatio];
    }
  };

  DrawPoints.prototype.makeTriangle = function () {
    this.triangles = Delaunay.triangulate(this.vertices);
    this.myTriangles = [];
    for (var i = this.triangles.length; i >= 3; i -= 3) {
      this.myTriangles.push(new MyTriangle(
        this.vertices[this.triangles[i - 1]],
        this.vertices[this.triangles[i - 2]],
        this.vertices[this.triangles[i - 3]]
      ));
    }
  };

  DrawPoints.prototype.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.width, 0);
    this.ctx.scale(-1, 1);
    if (WEBCAM.localMediaStream) {
      this.ctx.drawImage(WEBCAM.video, 0, 0, this.width, this.height);
    }
    this.ctx.restore();

    if (this.myTriangles.length > 0) {
      for (var l = 0; l < this.myTriangles.length; l++) {
        if (this.myTriangles[l].update()) {
          this.myTriangles[l].render(this.ctx);
        }
      }
    }
    /*
    for (var l = this.triangles.length; l >= 3; l -= 3) {
      var hue = Math.floor(Math.random() * 360);
      var saturation = '100%';
      var lightness = Math.floor(Math.random() * 50 + 50);
      var al = Math.random() * 0.5 + 0.5;
      this.ctx.fillStyle = "hsla(" + hue.toString() + "," + saturation + "," +
        lightness.toString() + "%" + "," + al.toString() + ")";
      //this.ctx.strokeStyle = this.ctx.fillStyle;
      this.ctx.beginPath();
      this.ctx.moveTo(this.vertices[this.triangles[l - 1]][0], this.vertices[
        this.triangles[l - 1]][
        1
      ]);
      this.ctx.lineTo(this.vertices[this.triangles[l - 2]][0], this.vertices[
        this.triangles[l - 2]][
        1
      ]);
      this.ctx.lineTo(this.vertices[this.triangles[l - 3]][0], this.vertices[
        this.triangles[l - 3]][
        1
      ]);
      this.ctx.closePath();
      //this.ctx.stroke();
      this.ctx.fill();
    }
    */
  }

  // function Point(x, y) {
  // 		this.x = x;
  // 		this.y = y;
  // }
  // // Point.prototype.update = function () {
  // // 		this.life--;
  // // 		return this.life < 0;
  // // };
  // Point.prototype.render = function (ctx, radius) {
  // 	//ctx.fillStyle = "#ff00ff";
  // 	ctx.fillRect(this.x, this.y, radius, radius);
  // };
  exports.DrawPoints = DrawPoints;

})(this);