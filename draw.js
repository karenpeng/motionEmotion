(function (exports) {

  function DrawPoints(can) {
    this.can = can;
    this.ctx = this.can.getContext('2d');
    this.width = this.can.width;
    this.height = this.can.height;
    this.triangles;
  }

  DrawPoints.prototype.getPoints = function (points, width, height) {
    this.widthRatio = this.width / width;
    this.heightRatio = this.height / height;
    this.vertices = [];
    for (var i = 0; i < points.length; i++) {
      this.vertices[i] = [points[i].x * this.widthRatio, points[i].y * this.heightRatio];
    }
  };

  DrawPoints.prototype.draw = function () {
    // this.points.forEach(function(p){
    // 	p.render(this.ctx, 2);
    // });
    this.triangles = Delaunay.triangulate(this.vertices);

    this.ctx.save();
    this.ctx.translate(this.width, 0);
    this.ctx.scale(-1, 1);
    if (WEBCAM.localMediaStream) {
      this.ctx.drawImage(WEBCAM.video, 0, 0, this.width, this.height);
    }
    this.ctx.restore();

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