// Create global vars for audio
const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioElement = document.querySelector('audio');
let audioCtx;
let track;
let analyzer;

// Constant values
/** This value will affect FFT buffer size. Don't set it too high! */
const TOTAL_ELEMENTS = 512;
const COLORS = [
  '#00CC00', 
  'rgb(0, 247, 255)', 
  'rgb(9, 25, 247)', 
  'dodgerblue', 
  'hotpink',
  'yellow'
];
const COLOR_THRESHOLD = 80;

// Variables to keep track of
const body = document.getElementById('root');
let totalInputEvents = 0;
let colorPointer = 0;

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

/** @TODO add Left and Right wrappers */



const topElements = Array.from(document.querySelectorAll('.syn.top .bar'));
const bottomElements = Array.from(document.querySelectorAll('.syn.bottom .bar'));

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

// let low = 0;
// let high = 128;

function animate() {
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteTimeDomainData(dataArray);
  

  // topDiv.setAttribute('style', `height: ${dataArray[0]}px;`);
  for (let i = 0; i < topElements.length; i++) {
    const div = topElements[i];
    if (div.clientHeight + COLOR_THRESHOLD < dataArray[i]) {
      colorPointer += 1;
      if (colorPointer === COLORS.length) {
        colorPointer = 0;
      }
    } else if (div.clientHeight - COLOR_THRESHOLD > dataArray[i]) {
      colorPointer -= 1;
      if (colorPointer === -1) {
        colorPointer = 0;
      }
    }
    div.setAttribute('style', `height: ${dataArray[i]}px; background-color: ${COLORS[colorPointer]};`);
  }
  
  for (let i = 0; i < bottomElements.length; i++) {
    const div = bottomElements[i];
    if (div.clientHeight + COLOR_THRESHOLD < dataArray[i]) {
      colorPointer += 1;
      if (colorPointer === COLORS.length) {
        colorPointer = 0;
      }
    } else if (div.clientHeight - COLOR_THRESHOLD > dataArray[i]) {
      colorPointer -= 1;
      if (colorPointer === -1) {
        colorPointer = 0;
      }
    }
    div.setAttribute('style', `height: ${dataArray[i + (TOTAL_ELEMENTS / 4)]}px; background-color: ${COLORS[colorPointer]};`);
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
  totalInputEvents++;
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
  
  // Reference: https://www.kkhaydarov.com/audio-visualizer/
}

init();
