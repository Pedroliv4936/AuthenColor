var video, canvas, context, imageData, detector;
var past=[];

function onLoad() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    image = document.getElementById("menu");

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
        if(image=="../images/music/Pausa1.JPG"){musicCommands();//codigo para cada cena
        }
}

function tick() {
    requestAnimationFrame(tick);

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        snapshot();

        var markers = detector.detect(imageData);
        command(markers);
        
    }
}

function snapshot() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}


function command(markers) {
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
        getPosicao(maincor, alt);
    }
}

function getPosicao(maincor, alt) {
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
    //console.log((20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 4000)));
    if (Math.abs(corners[0].x - corners[1].x) < Math.abs(corners[0].y - corners[1].y)) {
        if (corners[0].y - corners[1].y < 0) {
            imgData = context.getImageData(corners[0].x, corners[0].y - (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 2500)), 10, 10);
            context.fillRect(corners[0].x, corners[0].y - (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 2500)), 10, 10);
        } else {
            imgData = context.getImageData(corners[0].x, corners[0].y + (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 2500)), 10, 10);
            context.fillRect(corners[0].x, corners[0].y + (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 2500)), 10, 10);
        }
    } else {
        if (corners[0].x - corners[1].x < 0) {
            imgData = context.getImageData(corners[0].x - (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 2500)), corners[0].y, 10, 10);
            context.fillRect(corners[0].x - (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 2500)), corners[0].y, 10, 10);
        } else {
            imgData = context.getImageData(corners[0].x + (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 2500)), corners[0].y, 10, 10);
            context.fillRect(corners[0].x + (20 * ((Math.pow(corners[0].x - corners[1].x, 2) + Math.pow(corners[0].y - corners[1].y, 2)) / 2500)), corners[0].y, 10, 10);
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
        corCaptada = "Blue";
    } else if (R >= 139 && R <= 255 && G >= 73 && G <= 152 && B >= 103 && B <= 177) {
        cor.innerHTML = "Red";
        corCaptada = "Red";
    }
    /*else if (R >= 74 && R <= 182 && G >= 89 && G <= 206 && B >= 100 && B <= 206) {
      cor.innerHTML = "Green";
      corCaptada="Green";
    }*/
    /*else if (R >= 116 && R <= 255 && G >= 114 && G <= 255 && B >= 130 && B <= 229) {
      cor.innerHTML = "yellow";
    }*/
}

function musicCommands(){console.log("spotify");}

window.onload = onLoad;