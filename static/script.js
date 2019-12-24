// Create global vars for audio
const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioElement = document.querySelector('audio');
let audioCtx;
let track;
let analyzer;

const body = document.getElementById('root');

/** This value will affect FFT buffer size. Don't set it too high! */
const TOTAL_ELEMENTS = 512;

const topWrapper = document.createElement('div');
topWrapper.classList.add('syn', 'top');
body.appendChild(topWrapper);

for (let i = 0; i < TOTAL_ELEMENTS / 4; i++) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('bar');
  topWrapper.appendChild(newDiv);
}

const bottomWrapper = document.createElement('div');
bottomWrapper.classList.add('syn', 'bottom');
body.appendChild(bottomWrapper);

for (let i = 0; i < TOTAL_ELEMENTS / 4; i++) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('bar');
  bottomWrapper.appendChild(newDiv);
}



const topElements = Array.from(document.querySelectorAll('.syn.top .bar'));
const bottomElements = Array.from(document.querySelectorAll('.syn.bottom .bar'));
// const topDiv = document.createElement('div');
// topDiv.classList.add('syn', 'top');

// const rightDiv = document.createElement('div');
// rightDiv.classList.add('syn', 'right');

// const bottomDiv = document.createElement('div');
// bottomDiv.classList.add('syn', 'bottom');

// const leftDiv = document.createElement('div');
// leftDiv.classList.add('syn', 'left');


let didStart = false;

function startAudio() {
  audioCtx = new AudioContext();
  track = audioCtx.createMediaElementSource(audioElement);
  analyzer = audioCtx.createAnalyser();
  analyzer.fftSize = TOTAL_ELEMENTS * 2;

  track
    .connect(analyzer)
    .connect(audioCtx.destination);

  audioElement.play();
  animate();
}

let high = 0;

function animate() {
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteTimeDomainData(dataArray);
  

  // topDiv.setAttribute('style', `height: ${dataArray[0]}px;`);
  for (let i = 0; i < topElements.length; i++) {
    const div = topElements[i];
    div.setAttribute('style', `height: ${dataArray[i]}px`);
  }
  
  for (let i = 0; i < bottomElements.length; i++) {
    const div = bottomElements[i];
    div.setAttribute('style', `height: ${dataArray[i + (TOTAL_ELEMENTS / 4)]}px`);
  }
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
  textarea.classList.add('terminal');
  body.appendChild(textarea);
  textarea.focus();
  textarea.addEventListener('keyup', onTerminalInput);
  
  

  // body.appendChild(topDiv);
  // body.appendChild(rightDiv);
  // body.appendChild(bottomDiv);
  // body.appendChild(leftDiv);
  // Reference: https://www.kkhaydarov.com/audio-visualizer/
}

init();
