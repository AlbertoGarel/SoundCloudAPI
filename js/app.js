// const myUrl = 'https://api.soundcloud.com/oauth2/Yaa06b0630e34d6055f9c6f8beb8e02eb'
// const url = 'https://api.soundcloud.com/tracks?client_id=Yaa06b0630e34d6055f9c6f8beb8e02eb'

// axios.get('https://api.soundcloud.com/oauth2/Yaa06b0630e34d6055f9c6f8beb8e02eb')
// .then(res=>console.log(res))
// .catch(error => error)



SC.initialize({
  client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb'
});
var handlerplayer;
var suena;

//EVENTO PARA BOTON E INICIAR BÚQUEDA
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

    document.getElementById('resultados').appendChild(image);
  }
}

const borraError = (divErrores) => {
  setTimeout(() => {
    divErrores.innerHTML = '';
  }, 3000)
}
//DRAGGABLE ELEMENTS originales
// function allowDrop(ev) {
//   ev.preventDefault();
// }

// function drag(ev) {
//   ev.dataTransfer.setData("text", ev.target.id);
// }

// function drop(ev) {
//   ev.preventDefault();
//   var data = ev.dataTransfer.getData("text");
//   ev.target.appendChild(document.getElementById(data));
// }
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
  // efectoColores();
  ev.target.appendChild(document.getElementById(data));
  buscar();
  getDatosRepro(data);
}


function getDatosRepro(data) {

  SC.get(`/tracks/${data}`).then(function (tracks) {
    $('top-slider').append(`<h1>${data.title}</h1>`)
    $('top-slider').append(`<h1>${data.title}</h1>`)
    $('top-slider').append(`<h1>${data.title}</h1>`)
    $('top-slider').append(`<h1>${data.title}</h1>`)
    console.log('Latest track: ' + tracks.title);
  });
}

//EVENTOS CON JQUERY
$(function () {



});

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

document.getElementById('stop').addEventListener('click', function () {
  handlerplayer.kill();
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



