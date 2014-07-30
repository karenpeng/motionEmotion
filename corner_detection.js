(function (exports) {

  function CornerDetect(can) {
    //"use strict";

    // lets do some fun
    // var video = document.getElementById('webcam');
    // var canvas = document.getElementById('canvas');
    // try {
    //     compatibility.getUserMedia({video: true}, function(stream) {
    //         try {
    //             video.src = compatibility.URL.createObjectURL(stream);
    //         } catch (error) {
    //             video.src = stream;
    //         }
    //         setTimeout(function() {
    //                 video.play();
    //                 demo_app();

    //                 compatibility.requestAnimationFrame(tick);
    //             }, 500);
    //     }, function (error) {
    //         $('#canvas').hide();
    //         $('#log').hide();
    //         $('#no_rtc').html('<h4>WebRTC not available.</h4>');
    //         $('#no_rtc').show();
    //     });
    // } catch (error) {
    //     $('#canvas').hide();
    //     $('#log').hide();
    //     $('#no_rtc').html('<h4>Something goes wrong...</h4>');
    //     $('#no_rtc').show();
    // }

    //this.stat = new profiler();

    //var gui,options,
    this.can = can;
    this.ctx = this.can.getContext('2d');
    this.canvasWidth = this.can.width;
    this.canvasHeight = this.can.height;
    this.corners = [];
    this.threshold = 40;
    // ctx.fillStyle = "rgb(0,255,0)";
    // ctx.strokeStyle = "rgb(0,255,0)";

  }

  CornerDetect.prototype.init = function () {
    this.img_u8 = new jsfeat.matrix_t(this.canvasWidth, this.canvasHeight,
      jsfeat.U8_t | jsfeat.C1_t);
    var i = this.canvasWidth * this.canvasHeight;
    while (--i >= 0) {
      this.corners[i] = new jsfeat.point2d_t(0, 0, 0, 0);
    }

    jsfeat.fast_corners.set_threshold(this.threshold);

    //this.options = new demo_opt();
    //gui = new dat.GUI();

    // gui.add(options, 'threshold', 5, 100).step(1);

    //this.stat.add("grayscale");
    //this.stat.add("fast corners");
  };

  CornerDetect.prototype.tick = function () {
    //compatibility.requestAnimationFrame(tick);
    // stat.new_frame();
    //if (video.readyState === video.HAVE_ENOUGH_DATA) {
    //ctx.drawImage(video, 0, 0, 640, 480);
    var imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);

    //this.stat.start("grayscale");
    jsfeat.imgproc.grayscale(imageData.data, this.img_u8.data);
    //this.stat.stop("grayscale");

    // if(this.threshold != this.options.threshold) {
    //     this.threshold = this.options.threshold|0;
    //     jsfeat.fast_corners.set_threshold(this.threshold);
    // }

    //this.stat.start("fast corners");
    var count = jsfeat.fast_corners.detect(this.img_u8, this.corners, 5);
    //this.stat.stop("fast corners");

    // render result back to canvas
    var data_u32 = new Uint32Array(imageData.data.buffer);
    this.render_corners(this.corners, count, data_u32, this.canvasWidth);

    //this.ctx.putImageData(imageData, 0, 0);

    //$('#log').html(stat.log());
    // }
  };

  CornerDetect.prototype.render_corners = function (corners, count, img, step) {
    var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
    for (var i = 0; i < count; ++i) {
      var x = corners[i].x;
      var y = corners[i].y;
      var off = (x + y * step);
      img[off] = pix;
      img[off - 1] = pix;
      img[off + 1] = pix;
      img[off - step] = pix;
      img[off + step] = pix;
    }
  };

  // $(window).unload(function() {
  //     video.pause();
  //     video.src=null;
  // });

  //};

  exports.CornerDetect = CornerDetect;

})(this);