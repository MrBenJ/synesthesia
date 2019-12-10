const body = document.getElementById('root');
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const audioElement = document.querySelector('audio');
const track = audioCtx.createMediaElementSource(audioElement);
const analyzer = audioCtx.createAnalyser();

track
  .connect(analyzer)
  .connect(audioCtx.destination);

let didStart = false;

function startAudio() {
  audioElement.play();
}

analyzer.fftSize = 2048;
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

function animate() {
  window.requestAnimationFrame(animate);
  analyzer.getByteTimeDomainData(dataArray);

  for (let i = 0; i < bufferLength; i++) {
    console.log(dataArray[i]);
  }
  
}

audioElement.addEventListener('play', animate);



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
  if (!didStart) {
    startAudio();
    didStart = true;
  }
  if (event.key === 'Enter') {
    fuzzyText(event.currentTarget.value);
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