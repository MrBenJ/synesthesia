const body = document.getElementById('root');
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let track;
let analyzer;

const audioElement = document.querySelector('audio');


let didStart = false;

function startAudio() {
  audioCtx = new AudioContext();
  track = audioCtx.createMediaElementSource(audioElement);
  analyzer = audioCtx.createAnalyser();
  analyzer.fftSize = 1024;  
  track
    .connect(analyzer) // This isn't reactive... what do
    .connect(audioCtx.destination);

    audioElement.play();
    animate();
}


function animate() {
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteTimeDomainData(dataArray);
  console.log(dataArray);
  // for (let i = 0; i < bufferLength; i++) {
  //   // canvas stuff goes in here
  //   // console.log(dataArray[i]);
    
  // }

  window.requestAnimationFrame(animate);
}

// audioElement.addEventListener('play', animate);



function clear() {
  body.innerHTML = '';
  return Promise.resolve(true);
}

function fuzzyText(text) {
  const textarea = document.querySelector('textarea.terminal');
  textarea.removeEventListener('keyup', onTerminalInput);
  textarea.parentNode.removeChild(textarea);
  const p = document.createElement('p');
  p.classList.add('terminal', 'fullscreen', 'fuzzy');
  p.innerHTML = text;
  body.appendChild(p);
}

function onTerminalInput(event) {
  console.log('input');
  
  if (event.key === 'Enter' && !didStart) {
    console.log('lets get this bad party started');
    startAudio();
    didStart = true;
  }
}

// Initialize the code!
function init() {
  const textarea = document.createElement('textarea');
  textarea.classList.add('terminal', 'fullscreen');
  body.appendChild(textarea);
  textarea.focus();
  textarea.addEventListener('keyup', onTerminalInput);

}


// Let's get this bad party started
init();
