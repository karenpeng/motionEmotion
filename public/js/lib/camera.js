/*global Drupal: true, jQuery: true, gigya: true */
/*jslint devel: true, browser: true, nomen: true, maxerr: 50, indent: 2 */

/**
 * A bunch of this was copied from here:
 * http://www.html5rocks.com/en/tutorials/getusermedia/intro/
 */

var WEBCAM = {
  init: function () {
    "use strict";

    function onWebcamFail() {
      alert('There are problems with the webcam stream.');
    }

    function hasGetUserMedia() {
      // Note: Opera builds are unprefixed.
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    if (!hasGetUserMedia()) {
      alert('getUserMedia() is not supported, please use Google Chrome');
    } else {
      // SHIM
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
    }

    var self = this,
      captureTimer,
      video = document.querySelector('video');

    self.video = video;

    // Not showing vendor prefixes or code that works cross-browser.
    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: true
      }, function (stream) {
        self.video.src = window.URL.createObjectURL(stream);
        self.localMediaStream = stream;
      }, onWebcamFail);
    } else {
      onWebcamFail();
    }
  }
};

WEBCAM.init();