SC.initialize({
  client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb'
});
var handlerplayer;
var suena;
let MuestraAudio;

//EVENTO PARA BOTON INICIAR BÚQUEDA
const btnBuscador = document.getElementById('btnbusc');
btnBuscador.addEventListener('click', buscar)

function buscar() {
  const valorInput = document.getElementById('buscador').value;
  document.getElementById('resultados').innerHTML = '';
  if (valorInput.length > 0) {
    SC.get('/tracks', {
      q: `${valorInput}`
    }).then(function (tracks) {
      console.log(tracks)
      let seleccion = [];
      if (tracks.length > 0) {
        for (let i = 0; i < tracks.length; i++) {
          let trackInfo = {};
          trackInfo.id = tracks[i].id
          trackInfo.autor = tracks[i].user.username;
          trackInfo.title = tracks[i].title
          trackInfo.artwork_url = tracks[i].artwork_url
          trackInfo.created_atl = tracks[i].created_at
          seleccion.push(trackInfo)
        }
        return seleccion;
      } else {
        const divErrores = document.getElementById('resultados');
        divErrores.innerHTML = `<div id="errorvisto"><p>No existe  ningún resultado para <span>${valorInput}</span><div>`
        borraError(divErrores);
      }
    })
      .then(seleccion => {
        pintar(seleccion)
      })
  } else {
    console.log('introduce búsqueda');
  }
}
//FUNCIÓN PARA CREAR ELEMENTOS DE LISTA
function pintar(algo) {
  for (let i = 0; i < algo.length; i++) {
    let image = document.createElement('img');
    image.setAttribute('draggable', 'true');
    image.setAttribute('id', `${algo[i].id}`)
    image.setAttribute('data-username-', `${algo[i].autor}`)

    if (algo[i].artwork_url == null) {
      image.setAttribute('src', './images/fondos/netosk-avatar.jpg')
    } else {
      image.setAttribute('src', `${algo[i].artwork_url}`)
    }

    image.setAttribute('ondragstart', "drag(event)")

    if (algo[i].created_atl == undefined) {
      image.setAttribute('data-created', `desconocido`)
    } else {
      image.setAttribute('data-created', `${algo[i].created_atl}`)
    }

    image.setAttribute('data-title', `${algo[i].title}`)

    let contenedor = document.createElement('div');
    contenedor.setAttribute('class', 'cont-opciones')
    let parraf = document.createElement('p');
    let contenido = document.createTextNode(algo[i].title)

    parraf.appendChild(contenido);
    contenedor.appendChild(parraf);
    contenedor.appendChild(image);
    document.getElementById('resultados').appendChild(contenedor);
  }
}
//BORRADO DE MENSAJES DE ERROR BÚSQUEDA
const borraError = (divErrores) => {
  setTimeout(() => {
    divErrores.innerHTML = '';
  }, 2500)
}
function allowDrop(ev) {
  ev.preventDefault();
  document.getElementById('cont-muestra').innerHTML = "";
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  document.getElementById('nav-left-sticky').style.left = '-30em';
}
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  play(data);
  ev.target.appendChild(document.getElementById(data));
  buscar();
  getDatosRepro(data);
  volumenControl(volumen)
}

//MOSTRAR DATOS PARTE SUP.
function getDatosRepro(data) {
  SC.get(`/tracks/${data}`).then(tracks => {
    aniadeDatosTrack(tracks)
  });
}

//EVENTOS CON JQUERY
function creaNodo(elemento) {
  let ele = document.createElement(elemento)
  return ele;
}
//CREAR CONTENEDORES Y PINTAR DATOS PARTE SUP.
function aniadeDatosTrack(data) {
  let contImage = document.getElementById('top-image');
  let contData = document.getElementById('top-data');
  contImage.innerHTML = '';
  contData.innerHTML = '';

  let img = creaNodo('img');

  if (data.artwork_url == undefined) {
    img.setAttribute('src', './images/fondos/netosk-avatar.jpg')
  } else {
    img.setAttribute('src', data.artwork_url);
  }

  img.setAttribute('alt', 'artwork track')
  contImage.appendChild(img)


  let titu = creaNodo('h1');
  let textTitle = document.createTextNode(data.title);
  titu.appendChild(textTitle);
  contData.appendChild(titu);

  let autor = creaNodo('p');
  let textAutor = document.createTextNode(data.user.username);
  autor.appendChild(textAutor);
  contData.appendChild(autor);

  let fecha = creaNodo('p');
  let fechaSplit = data.created_at.split(' ')
  let textFecha = document.createTextNode(fechaSplit[0]);
  fecha.appendChild(textFecha);
  contData.appendChild(fecha);

  document.getElementById('nav-top-stiky').setAttribute('style', 'top: 0vh');
}
//EVENTO PAUSA
document.getElementById('pause').addEventListener('click', function () {
  if (!handlerplayer.isPlaying()) {
    handlerplayer.play();
    efectoColores();
  } else {
    handlerplayer.pause();
    limpiaEcu()
    clearInterval(efectoColores1)
  }
});

// PLAY TRACK
function play(algo) {
  return SC.stream(`/tracks/${algo}`).then(function (player) {
    player.play().then(function () {

      handlerplayer = player;
      clearInterval(efectoColores1)
      efectoColores();
      console.log('suena o no', handlerplayer.isActuallyPlaying())

    }).catch(function (e) {
      console.error('Playback rejected. Try calling play() from a user interaction.', e);
    });
  });
}

// setVolume(volume)
let ele = document.getElementById('nav-lat-sticky');
let volumen = .5;
document.getElementById('menos').addEventListener('click', function () {
  // VM115221 sdk-3.3.2.js:3 Uncaught Error: Volume must be >= 0 and <= 1.
  volumen = volumen * 10;
  volumen = volumen - 1;
  volumen = volumen / 10;
  if (volumen < 0) {
    volumen = 0;
  }
    handlerplayer.setVolume(volumen);
    volumenControl(volumen);
});
document.getElementById('menos').addEventListener('mouseover', function () {
  ele.setAttribute('style', 'right: 0px');
  clearTimeout(muestraAudio);
})
document.getElementById('menos').addEventListener('mouseout', function () {

  muestraAudio = setTimeout(() => {
    ele.setAttribute('style', 'right: -80px')
  }, 3000);
})

document.getElementById('mas').addEventListener('click', function () {
  // VM115221 sdk-3.3.2.js:3 Uncaught Error: Volume must be >= 0 and <= 1.
  volumen = volumen * 10;
  volumen = volumen + 1;
  volumen = volumen / 10;
  if (volumen > 1) {
    volumen = 1;
  }
    handlerplayer.setVolume(volumen);
    volumenControl(volumen);
  
});
document.getElementById('mas').addEventListener('mouseover', function () {
  ele.setAttribute('style', 'right: 0px');
  clearTimeout(muestraAudio);
})
document.getElementById('mas').addEventListener('mouseout', function () {
  muestraAudio = setTimeout(() => {
    ele.setAttribute('style', 'right: -80px')
  }, 3000);
})

//VISUALIZACION VOLUMEN
function volumenControl(volumen) {
  console.log(volumen)

  let control = document.getElementsByClassName('nav-li-sticky')
  for (let j = 0; j < control.length; j++) {
    control[j].setAttribute('style', 'visibility: hidden');
  }
  let volumenConv = volumen * 10;
  for (let i = 0; i < volumenConv; i++) {
    control[i].setAttribute('style', 'visibility: visible');
  }
}