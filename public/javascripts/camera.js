var video, canvas, context, imageData, detector;
var pass = [];
var past;

function setup() {
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
    }
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

  createCanvas(600, 500);
  circle(300, 250, 50); //centro
  circle(300, 50, 50); //norte
  circle(100, 240, 50); //oeste
  circle(170, 100, 50); //noroeste
  circle(430, 100, 50); //Nordeste
  circle(170, 400, 50); //Sudoeste
  circle(430, 400, 50); //Sudeste
  circle(500, 240, 50); //este
  circle(300, 450, 50); //sul
}

function tick() {
  requestAnimationFrame(tick);

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    snapshot();

    var markers = detector.detect(imageData);
    drawCorners(markers);
    drawId(markers);
    passwordPosition(markers);
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
var pos;

function passwordPosition(markers) {
  //alterar para controlar os dois arucos
  var corners, corner;
  var leftcor, rightcor, maincor, topcor, lowcor, alt;
  leftcor = 0;
  rightcor = 1000;
  maincor = 0;
  topcor = 1000;
  lowcor = 0;
  alt = 0;
  pos = 0;
  var position = document.getElementById("position");

  for (i = 0; i !== markers.length; ++i) {
    corners = markers[i].corners;
    for (j = 0; j !== corners.length; j++) {
      corner = corners[j];
      if (corner.x > leftcor) {
        leftcor = corner.x;
      }
      if (corner.x < rightcor) {
        rightcor = corner.x;
      }
      if (corner.y > lowcor) {
        lowcor = corner.y;
      }
      if (corner.y < topcor) {
        topcor = corner.y;
      }
    }
  }

  if (leftcor != 0 || rightcor != 1000) {
    maincor = rightcor + ((leftcor - rightcor) / 2);
  }
  if (topcor != 1000 || lowcor != 0) {
    alt = topcor + ((lowcor - topcor) / 2);
  }

  if (maincor != 0 && alt != 0) {
    //console.log("maincor:" + maincor + "alt:" + alt);

    if (maincor < canvas.width / 3) {
      if (alt < canvas.height / 3) {
        position.innerHTML = "Nordeste";
        pos = "Nordeste";
      } else if (alt > (canvas.height / 3) * 2) {
        position.innerHTML = "Sudeste";
        pos = "Sudeste";
      } else {
        position.innerHTML = "Este";
        pos = "Este";
      }
    } else if (maincor > canvas.width / 3 && maincor < (canvas.width / 3) * 2) {
      if (alt < canvas.height / 3) {
        position.innerHTML = "Norte";
        pos = "Norte";
      } else if (alt > (canvas.height / 3) * 2) {
        position.innerHTML = "Sul";
        pos = "Sul";
      } else {
        position.innerHTML = "Centro";
        pos = "Centro";
      }
    } else if (maincor > (canvas.width / 3) * 2) {
      if (alt < canvas.height / 3) {
        position.innerHTML = "Noroeste";
        pos = "Noroeste";
      } else if (alt > (canvas.height / 3) * 2) {
        position.innerHTML = "Sudoeste";
        pos = "Sudoeste";
      } else {
        position.innerHTML = "Oeste";
        pos = "Oeste";
      }
    }
  }
}


/*function setup() {
  createCanvas(600, 500);
  createCapture
  circle(300, 250, 50); //centro
  circle(300, 50, 50); //norte
  circle(100, 240, 50); //oeste
  circle(170, 100, 50); //noroeste
  circle(430, 100, 50); //sudoeste
  circle(170, 400, 50); //nordeste
  circle(430, 400, 50); //este
  circle(500, 240, 50); //sudeste
  circle(300, 450, 50); //sul
}*/

function draw() {
  var c;
  if(c!=pos && pos!=0){
    fill(255);
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
  fill(128);
  switch (pos) {
    case "Centro":
      c = pos;
      ellipse(300, 250, 50, 50);
      break;
    case "Norte":
      c = pos;
      ellipse(300, 50, 50, 50);
      break;
    case "Oeste":
      c = pos;
      ellipse(100, 240, 50, 50);
      break;
    case "Noroeste":
      c = pos;
      ellipse(170, 100, 50, 50);
      break;
    case "Sudoeste":
      c = pos;
      ellipse(170, 400, 50, 50);
      break;
    case "Nordeste":
      c = pos;
      ellipse(430, 100, 50, 50);
      break;
    case "Este":
      c = pos;
      ellipse(500, 240, 50, 50);
      break;
    case "Sudeste":
      c = pos;
      ellipse(430, 400, 50, 50);
      break;
    case "Sul":
      c = pos;
      ellipse(300, 450, 50, 50);
      break;
  }
}

function login() {
  loop=requestAnimationFrame(login);
  if (pos != 0) {
    if (pass.length < 10) {
      if (pos == "Centro") {
        if (past != pos && past != undefined) {
          console.log("Adicionado:" + past);
          pass.push(past);
          past = pos;
        }
        past = pos;
      } else {
        past = pos;
      }
    } else {
      console.log("pass:" + pass);
      pass = cifrar(pass);
      console.log("pass cifrada:" + pass);
      //cifrar e processar
      cancelAnimationFrame(loop);
      loop=undefined;
      return pass;
    }
  }
}

function cifrar(pass) {
  var code = [];
  //for para array pass
  pass.forEach(card => {
    console.log("card:" + card);
    switch (card) {
      /*case "Centro":
        code.push(0);
        break;*/
      case "Norte":
        code.push(1);
        break;
      case "Nordeste":
        code.push(2);
        break;
      case "Este":
        code.push(3);
        break;
      case "Sudeste":
        code.push(4);
        break;
      case "Sul":
        code.push(5);
        break;
      case "Sudoeste":
        code.push(6);
        break;
      case "Oeste":
        code.push(7);
        break;
      case "Noroeste":
        code.push(8);
        break;
    }
  });
  console.log(code);
  return code;
}

//window.onload = onLoad;