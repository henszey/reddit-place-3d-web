const colors = [
	"rgb(0,0,0)",
	"rgb(255,255,255)",
	"rgb(81,233,244)",
	"rgb(180,74,192)",
	"rgb(0,163,104)",
	"rgb(54,144,234)",
	"rgb(36,80,164)",
	"rgb(255,214,53)",
	"rgb(156,105,38)",
	"rgb(255,153,170)",
	"rgb(126,237,86)",
	"rgb(255,168,0)",
	"rgb(212,215,217)",
	"rgb(129,30,159)",
	"rgb(137,141,144)",
	"rgb(255,69,0)"];

var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');

var pos = 0;
var arr = null;

function draw(){
	var lastY = 0;
  while(++pos + 1 < arr.length) {
	  const x = arr[pos] & 0x7FF;
	  const y = arr[pos] >> 11 & 0x7FF;
	  const c = arr[pos] >> 22 & 0xF;
	  ctx.fillStyle = colors[c];
		ctx.fillRect( x, y, 1, 1 );
    if(lastY > y) break;
    lastY = y;
	}
	window.requestAnimationFrame(draw);
}

fetch('../diff.dat')
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(data) {
	  arr = new Int32Array(data);
		window.requestAnimationFrame(draw);
  });