var video, canvas, context, imageData, detector;

function onLoad() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  canvas.width = parseInt(canvas.style.width);
  canvas.height = parseInt(canvas.style.height);

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  navigator.mediaDevices
    .getUserMedia({
      video: true
    })
    .then(function (stream) {
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });

  detector = new AR.Detector();

  requestAnimationFrame(tick);
}

function tick() {
  requestAnimationFrame(tick);

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    snapshot();

    var markers = detector.detect(imageData);
    drawCorners(markers);
    drawId(markers);
    passwordPosition(markers);
    draw();
  }
}

function snapshot() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function drawCorners(markers) {
  var corners, corner, i, j;

  context.lineWidth = 3;

  for (i = 0; i !== markers.length; ++i) {
    corners = markers[i].corners;

    context.strokeStyle = "red";
    context.beginPath();

    for (j = 0; j !== corners.length; ++j) {
      corner = corners[j];
      context.moveTo(corner.x, corner.y);
      corner = corners[(j + 1) % corners.length];
      context.lineTo(corner.x, corner.y);
    }

    context.stroke();
    context.closePath();

    context.strokeStyle = "green";
    context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
  }
}

function drawId(markers) {
  var corners, corner, x, y, i, j;

  context.strokeStyle = "blue";
  context.lineWidth = 1;

  for (i = 0; i !== markers.length; ++i) {
    corners = markers[i].corners;

    x = Infinity;
    y = Infinity;

    for (j = 0; j !== corners.length; ++j) {
      corner = corners[j];

      x = Math.min(x, corner.x);
      y = Math.min(y, corner.y);
    }

    context.strokeText(markers[i].id, x, y);
  }
}

function passwordPosition(markers) {
  //alterar para controlar os dois arucos
  var corners, corner;
  var position = document.getElementById("position");
  for (i = 0; i !== markers.length; ++i) {
    corners = markers[i].corners;
    for (j = 0; j !== corners.length; j++) {
      corner = corners[j];
      if (corner.x < 200) {
        if (corner.y < 160) {
          position.innerHTML = "Nordeste";
          pos = "Nordeste";
        } else if (corner.y > 320) {
          position.innerHTML = "Sudeste";
          pos = "Sudeste";
        } else {
          position.innerHTML = "Este";
          pos = "Este";
        }
      } else if (corner.x > 200 && corner.x < 400) {
        if (corner.y < 160) {
          position.innerHTML = "Norte";
          pos = "Norte";
        } else if (corner.y > 320) {
          position.innerHTML = "Sul";
          pos = "Sul";
        } else {
          position.innerHTML = "Centro";
          pos = "Centro";
        }
      } else if (corner.x > 400) {
        if (corner.y < 160) {
          position.innerHTML = "Noroeste";
          pos = "Noroeste";
        } else if (corner.y > 320) {
          position.innerHTML = "Sudoeste";
          pos = "Sudoeste";
        }
      } else {
        position.innerHTML = "Oeste";
        pos = "Oeste";
      }
    }
    console.log("corner x:", corner.x + " ,corner y:", corner.y);
  }
}

var pos;

function setup() {
  createCanvas(600, 500);
  circle(300, 250, 50); //centro
  circle(300, 50, 50); //norte
  circle(100, 240, 50); //oeste
  circle(170, 100, 50); //noroeste
  circle(430, 100, 50); //sudoeste
  circle(170, 400, 50); //nordeste
  circle(430, 400, 50); //este
  circle(500, 240, 50); //sudeste
  circle(300, 450, 50); //sul
}

function draw() {
  fill(255);
  switch (pos) {
    case "Centro":
      ellipse(300, 250, 50, 50);
      console.log(pos);
      break;
    case "Norte":
      ellipse(300, 50, 50, 50);
      console.log(pos);
      break;
    case "Oeste":
      ellipse(100, 240, 50, 50);
      console.log(pos);
      break;
    case "Noroeste":
      ellipse(170, 100, 50, 50);
      console.log(pos);
      break;
    case "Sudoeste":
      ellipse(430, 100, 50, 50);
      console.log(pos);
      break;
    case "Nordeste":
      ellipse(170, 400, 50, 50);
      console.log(pos);
      break;
    case "Este":
      ellipse(430, 400, 50, 50);
      console.log(pos);
      break;
    case "Sudeste":
      ellipse(500, 240, 50, 50);
      console.log(pos);
      break;
    case "Sul":
      ellipse(300, 450, 50, 50);
      console.log(pos);
      break;
  }
}

window.onload = onLoad;