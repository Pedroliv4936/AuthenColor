var video, canvas, context, imageData, detector;
var pass = [];
var past,ativo, start=[];
/*var Rbaixo = 255;
var Gbaixo = 255;
var Bbaixo = 255;
var Ralto = 0;
var Galto = 0;
var Balto = 0;*/

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

  let p5Canva = createCanvas(600, 500);
  p5Canva.parent('container');
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
  corCaptada = 0;
  var position = document.getElementById("position");
  var cor = document.getElementById("color");

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
    //buscar cor do cartão
    getCorCard(leftcor, topcor, markers);
    getPosicao(maincor,alt);
    if (pos=="Centro" && cor.innerHTML != " Color of Card") {
      if(start[0] != cor.innerHTML && ativo!="SIM"){
      start.push(cor.innerHTML);
      console.log(start);
      if(start.length==2){
        check.innerHTML="Insira o seu código";
        start=[];
        ativo="SIM";
        loginApr();
      }
    }
    }
  }
}

function getPosicao(maincor,alt){
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

function getCorCard(leftcor, topcor, markers) {
  var cor = document.getElementById("color");
  for (i = 0; i !== markers.length; ++i) {
    corners = markers[i].corners;
  }
  let imgData = context.getImageData(leftcor + 5, topcor + 5, 10, 10);
  //console.log((20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)));
  if (Math.abs(corners[0].x - corners[1].x) < Math.abs(corners[0].y - corners[1].y)) {
    if (corners[0].y - corners[1].y < 0) {
      imgData = context.getImageData(corners[0].x, corners[0].y - (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)), 10, 10);
      context.fillRect(corners[0].x, corners[0].y - (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)), 10, 10);
    } else {
      imgData = context.getImageData(corners[0].x, corners[0].y + (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)), 10, 10);
      context.fillRect(corners[0].x, corners[0].y + (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)), 10, 10);
    }
  } else {
    if (corners[0].x - corners[1].x < 0) {
      imgData = context.getImageData(corners[0].x - (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)), corners[0].y, 10, 10);
      context.fillRect(corners[0].x - (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)), corners[0].y, 10, 10);
    } else {
      imgData = context.getImageData(corners[0].x + (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)), corners[0].y, 10, 10);
      context.fillRect(corners[0].x + (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 1000)), corners[0].y, 10, 10);
    }
  }

  let R = imgData.data[0];
  let G = imgData.data[1];
  let B = imgData.data[2];
  let A = imgData.data[3];
  //Verificar pârametros das cores
  //console.log("Red:", R, "Green:", G, "Blue:", B, "alpha:", A);
  if (R >= 38 && R <= 117 && G >= 55 && G <= 156 && B >= 147 && B <= 251) {
    cor.innerHTML = "Blue";
    corCaptada="Blue";
  } else if (R >= 139 && R <= 255 && G >= 73 && G <= 152 && B >= 103 && B <= 177) {
    cor.innerHTML = "Red";
    corCaptada="Red";
  }
    /*else if (R >= 74 && R <= 182 && G >= 89 && G <= 206 && B >= 100 && B <= 206) {
      cor.innerHTML = "Green";
      corCaptada="Green";
    }*/
  /*else if (R >= 116 && R <= 255 && G >= 114 && G <= 255 && B >= 130 && B <= 229) {
    cor.innerHTML = "yellow";
  }*/
  /*if (R < Rbaixo) {
    Rbaixo = R;
  }
  if (R > Ralto) {
    Ralto = R;
  }
  if (G < Gbaixo) {
    Gbaixo = G;
  }
  if (G > Galto) {
    Galto = G;
  }
  if (B < Bbaixo) {
    Bbaixo = B;
  }
  if (B > Balto) {
    Balto = B;
  }
  console.log("R:" + Rbaixo + "," + Ralto + "g:" + Gbaixo + "," + Galto + "B:" + Bbaixo + "," + Balto);*/
}

function draw() {
  var c;
  if (c != pos && pos != 0) {
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
  loop = requestAnimationFrame(login);
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
      loop = undefined;
      var username = pass.toString().slice(0, 9).replace(/,/g, '');
      var password = pass.toString().slice(10, 19).replace(/,/g, '');
      loginDB(username, password);
      pass = [];
      ativo="Nao";
      return;
    }
  }
}
function loginApr(){
  loop = requestAnimationFrame(loginApr);
  if (pos != 0) {
    if (pass.length < 5) {
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
      window.location="menu.html";
      pass = [];
      ativo="Nao";
      return;
    }
  }
}

function register() {
  loop = requestAnimationFrame(register);
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
      loop = undefined;
      var username = pass.toString().slice(0, 9).replace(/,/g, '');
      var password = pass.toString().slice(10, 19).replace(/,/g, '');
      registerDB(username, password);
      pass = [];
      return;
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

async function loginDB(name, pass) {
  check = document.getElementById("check");
  let user = {
    username: name,
    password: pass
  }
  try {
    let loginInfo = await $.ajax({
      url: "/api/cliente/login/",
      method: "get",
      dataType: "json",
      data: user
    });
    console.log("loginInfo:",loginInfo);
    if (loginInfo[0] !=  null) {
      check.innerHTML="ACEITE";
      window.location ='menu.html'; 
    } else {
      check.innerHTML = "login incorreto";
    }
  } catch (err) {
    console.log(err);
  }
}
async function registerDB(name, pass) {
  check = document.getElementById("check");
  let user = {
    username: name,
    password: pass
  };
  console.log("register:" + user);
  try {
    let register = await $.ajax({
      url: "/api/cliente/register",
      method: "post",
      dataType: "json",
      data: user
    });
    if (register[0] != null) {
      check.innerHTML = "Criado novo utilizador";
    } else {
      check.innerHTML = "Erro ao criar utilizador";
    }
  } catch (err) {
    console.log(err);
  }
}

//window.onload = onLoad;