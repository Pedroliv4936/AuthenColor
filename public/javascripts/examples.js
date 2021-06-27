var video, canvas, context, imageData, detector, cor, music, pause, modo, audio,slide,num;
var past = [];

function onLoad() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    cor = document.getElementById("color");
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
    modo = "Select";
    music = "1";
    requestAnimationFrame(tick);
    pause = "Play";
    slide=1;
    num=1;
    /*pause="Pausa" ou "Play" music="1","2" ou "null" */

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
        musicCommands();
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

function play(song) {
    let sound;
    if (song == "1") {
        sound = "/audios/DontKnowYet.mp3";
    } else {
        sound = "/audios/MentallyMisguided.wav";
    }
    audio = new Audio(sound);
}


function musicCommands() {
    let path = null;
    if (modo == "Music") {
        document.getElementById("background").style.backgroundColor="#0d0d0d";
        switch (pos) {
            case "Centro":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "Meio.JPG";
                break;
            case "Norte":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "VolumeUp.JPG";
                break;
            case "Oeste":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "Esquerda.JPG";
                break;
            case "Noroeste":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "Repeat.JPG";
                break;
            case "Sudoeste":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "Playlist.JPG";
                break;
            case "Nordeste":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "Shuffle.JPG";
                break;
            case "Este":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "Direita.JPG";
                break;
            case "Sudeste":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "Like.JPG";
                break;
            case "Sul":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/music/" + music + pause + "VolumeDown.JPG";
                break;
        }
        //comands
        if (past.length >= 2) {
            switch (position.innerHTML) {
                case "Centro":
                    if (!audio) {
                        play(music);
                    }else {
                    if (pause == "Play") {
                        audio.play();
                        pause = "Pausa";
                    } else {
                        audio.pause();
                        pause = "Play";
                    }}
                    break;
                case "Norte":
                    audio.volume += 0.1;

                    break;
                case "Oeste":
                    audio.pause();
                    pause = "Play";
                    if(music=="2"){
                        music="1";
                    } else {
                        music="2";
                    }
                    break;
                case "Este":
                    audio.pause();
                    pause = "Play";
                    if(music=="2"){
                        music="1";
                        play(music);
                        audio.pause();
                    } else {
                        music="2";
                        play(music);
                        audio.pause();
                    }
                    break;
                case "Sul":
                    audio.volume -= 0.1;

                    break;
                case "Sudoeste":
                    audio.pause();
                    modo = "Select";
                    window.location="menu.html";
                    break;
            }
            past = [];
        }
    } else if (modo == "Presentation") {
        document.getElementById("background").style.backgroundColor="#202729";
        switch (pos) {
            case "Centro":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/apresentacao/"+slide+".JPG";
                }
                break;
            case "Norte":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/apresentacao/"+slide+".JPG";
                }
                break;
            case "Oeste":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/apresentacao/"+slide+".JPG";
                }
                break;
            case "Este":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/apresentacao/"+slide+".JPG";
                }
                break;
            case "Sul":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/apresentacao/"+slide+".JPG";
                }
                break;
        }
        //aceita comando
        if (past.length == 2) {
            switch (position.innerHTML) {
                case "Centro":
                    break;
                case "Norte":
                    image.src="/images/apresentacao/1.JPG";
                    break;
                case "Oeste":
                    if(slide>1){
                    slide= (parseInt(slide)-1).toString();
                    image.src="/images/apresentacao/"+(slide)+".JPG";
                    console.log("/images/apresentacao/"+(slide)+".JPG");}
                    break;
                case "Este":
                    if(slide<6){
                    slide=(parseInt(slide)+1).toString();
                    image.src="/images/apresentacao/"+(slide)+".JPG";
                    console.log("/images/apresentacao/"+(slide)+".JPG");}
                    break;
                case "Sul":
                    menu="Select";
                    window.location = 'menu.html';
                    break;
            }
            past = [];
        }
    } else if (modo == "Loja") {
        document.getElementById("background").style.backgroundColor="white";
        switch (pos) {
            case "Centro":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/store/"+num+".png";
                }
                break;
            case "Norte":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/store/"+num+".png";
                }
                break;
            case "Oeste":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/store/"+num+".png";
                }
                break;
            case "Este":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/store/"+num+".png";
                }
                break;
            case "Sul":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                    image.src="/images/store/"+num+".png";
                }
                break;
        }
        //aceita comando
        if (past.length == 2) {
            switch (position.innerHTML) {
                case "Centro":
                    break;
                case "Norte":
                    image.src="/images/store/1.png";
                    break;
                case "Oeste":
                    if(num>1){
                    num= (parseInt(num)-1).toString();
                    image.src="/images/store/"+(num)+".png";
                    console.log("/images/store/"+(num)+".png");}
                    break;
                case "Este":
                    if(num<16){
                    num=(parseInt(num)+1).toString();
                    image.src="/images/store/"+(num)+".png";
                    console.log("/images/store/"+(num)+".png");}
                    break;
                case "Sul":
                    menu="Select";
                    window.location = 'menu.html';
                    break;
            }
            past = [];
        }
    } else if (modo == "Select") {
        document.getElementById("background").style.backgroundColor="#202729";
        switch (pos) {
            case "Centro":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/select/meio.JPG";
                break;
            case "Norte":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/select/apresentacao.JPG";
                break;
            case "Oeste":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/select/loja.JPG";
                break;
            case "Este":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/select/music.JPG";
                break;
            case "Sul":
                if (past[0] != cor.innerHTML && cor.innerHTML != " Color of Card") {
                    past.push(cor.innerHTML);
                    console.log(past);
                }
                image.src = "/images/select/sair.JPG";
                break;
        }
        //aceita comando
        if (past.length == 2) {
            switch (position.innerHTML) {
                case "Centro":

                    break;
                case "Norte":
                    modo = "Presentation";

                    break;
                case "Oeste":
                    modo = "Loja";

                    break;
                case "Este":
                    modo = "Music";

                    break;
                case "Sul":
                    window.location = 'index.html';

                    break;
            }
            past = [];
        }
    }
}

window.onload = onLoad;