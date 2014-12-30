var bgActive = false;

function onWindowResize() {
  var w = window.innerWidth;
  var h_real = window.innerHeight;
  document.getElementById('bgCanvas').setAttribute('width', w + 'px');
  document.getElementById('bgCanvas').setAttribute('height', h_real + 'px');
  if (w <= 960) {
    var h = w / 4 * 3;
    document.getElementById('myCanvas').setAttribute('width', w + 'px');
    document.getElementById('myCanvas').setAttribute('height', h + 'px');
    document.getElementById('myCanvas').style.marginLeft = -w / 2 + 'px';
    document.getElementById('myCanvas').style.marginTop = -h / 2 + 'px';
  } else {
    document.getElementById('myCanvas').setAttribute('width', '960px');
    document.getElementById('myCanvas').setAttribute('height', '720px');
    document.getElementById('myCanvas').style.marginLeft = '-480px';
    document.getElementById('myCanvas').style.marginTop = '-360px';
    bgActive = true;
  }
}
onWindowResize();
window.addEventListener('resize', onWindowResize, false);