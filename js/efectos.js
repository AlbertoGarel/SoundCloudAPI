//porcentajes
function porcentajes(porc, total) {
    let resEntPorc = (porc / 100);
    let resultado = (total * resEntPorc);

    return resultado;
}
//ELEMENTOS MÁS UTILIZADOS
let cont_audio = document.getElementById('cont-audio');

function eventosWinndow(ev) {

    const contNavSticky = document.getElementById('nav-lat-sticky');
    const contFlechaSticky = document.querySelector('#flecha-sticky');

    let anchoView = window.innerWidth;
    let altoView = window.innerHeight;
    let x = ev.clientX;
    let y = ev.clientY;

    if ((x >= (porcentajes(75, anchoView))) && (y >= porcentajes(30, altoView))) {
        contFlechaSticky.style = 'visibility: hidden';
        contNavSticky.style = 'right: 0px!important;';
    } else {
        contFlechaSticky.style = 'visibility: visible';
        contNavSticky.style = 'right: -80px!important;';
    }

    const contTopSticky = document.getElementById('nav-top-stiky');
    const contImgFlechaTopSticky = document.getElementById('cont-flecha-bottom');

    if ((y <= (porcentajes(25, altoView)))) {
        contImgFlechaTopSticky.style = 'visibility: hidden';
        contTopSticky.style = 'top: 0px!important;';
    } else {
        contImgFlechaTopSticky.style = 'visibility: visible';
        contTopSticky.style = 'top: -20vh!important;';
    }

    const contLeftSticky = document.querySelector('#nav-left-sticky');
    const contIcoLupa = document.querySelector('#ico-lupa')

    if ((x <= (porcentajes(25, anchoView))) && (y >= porcentajes(20, altoView))) {
        contIcoLupa.style = 'visibility: hidden';
        contLeftSticky.style = 'left: 0em!important;';
    } else {
        contIcoLupa.style = 'visibility: visible';
        contLeftSticky.style = 'left: -30em!important;';
    }
}

window.addEventListener('mousemove', eventosWinndow);

const contLeft = document.querySelector('#nav-left-sticky');
contLeft.addEventListener('mouseover', () => {
    window.removeEventListener('mousemove', eventosWinndow);
})

contLeft.addEventListener('mouseout', () => {
    window.addEventListener('mousemove', eventosWinndow);
})

let efectoColores1 = '';
let numCont = 23;
function efectoColores() {
    document.getElementById('ecu').setAttribute('style', 'display: flex');

    document.getElementById('cont-audio').setAttribute('display', 'block')
    efectoColores1 = setInterval(() => {
        const charts = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        let colorFi = [];
        var porcentajes = [];

        for (let n = 0; n < numCont; n++) {
            for (let i = 0; i < numCont; i++) {
                let colo = '';
                for (let m = 0; m < 6; m++) {
                    let rand = Math.floor(Math.random() * 15)
                    colo += charts[rand];
                }
                colorFi.push(colo)
                porcentajes[i] = Math.floor(Math.random() * 9);
            }
            document.getElementById(`ecu${n}`).style.height = `${porcentajes[n]}5%`
            document.getElementById(`ecu${n}`).style.backgroundColor = `#${colorFi[n]}`
        }
    }, 100);

}

function limpiaEcu() {
    for (let i = 0; i < numCont; i++) {
        document.getElementById(`ecu${i}`).style.height = '4%'
        document.getElementById(`ecu${i}`).style.backgroundColor = ' lightseagreen'
    }
}

function ocultaMuestra() {
    let contEcu = document.getElementById('cont-audio').getAttribute('display');

}



