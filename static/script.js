// Create global vars for audio
const AudioContext = (window.AudioContext || window.webkitAudioContext);
const audioElement = document.querySelector('audio');
let audioCtx;
let track;
let analyzer;

// Constant values
/** Total elements to render on screen
 * This value will affect FFT buffer size. Don't set it too high! 
 */
const TOTAL_ELEMENTS = 256;

/** Sets the waveform threshold for changing the color */
const COLOR_THRESHOLD = 70;

/** Increment value for each hue */
const HUE_INCREMENT = 1;

/** Create a "bloom" every this many times the hues change */
const BLOOM_EVERY = 2000;

// Variables to keep track of
/** Body to append elements to */
const body = document.getElementById('root');

/** ms for tracking input intervals */
const INPUT_TRACKING_INTERVAL = 250;

/** Total number of input events from the user */
let totalInputEvents = 0;

/** The current hue of color to show */
let hue = 200;

let opacity = 100;

let hueChanges = 0;

/** Wrapper div arund the top container with bars */
const topWrapper = document.createElement('div');
topWrapper.classList.add('syn', 'top');
body.appendChild(topWrapper);

for (let i = 0; i < TOTAL_ELEMENTS / 4; i++) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('bar');
  topWrapper.appendChild(newDiv);
}

/** Wrapper div arund the bottom container with bars */
const bottomWrapper = document.createElement('div');
bottomWrapper.classList.add('syn', 'bottom');
body.appendChild(bottomWrapper);

for (let i = 0; i < TOTAL_ELEMENTS / 4; i++) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('bar');
  bottomWrapper.appendChild(newDiv);
}

// I've removed the left and right sides because 
// it's too hard on the browser

// const leftWrapper = document.createElement('div');
// leftWrapper.classList.add('syn', 'left');
// body.appendChild(leftWrapper);

// for(let i = 0; i < TOTAL_ELEMENTS / 4; i++) {
//   const newDiv = document.createElement('div');
//   newDiv.classList.add('bar');
//   leftWrapper.appendChild(newDiv);
// }

// const rightWrapper = document.createElement('div');
// rightWrapper.classList.add('syn', 'right');
// body.appendChild(rightWrapper);

// for(let i = 0; i < TOTAL_ELEMENTS / 4; i++) {
//   const newDiv = document.createElement('div');
//   newDiv.classList.add('bar');
//   rightWrapper.appendChild(newDiv);
// }

/** @TODO add Left and Right wrappers */



const topElements = Array.from(document.querySelectorAll('.syn.top .bar'));
const bottomElements = Array.from(document.querySelectorAll('.syn.bottom .bar'));
// const leftElements = Array.from(document.querySelectorAll('.syn.left .bar'));
// const rightElements = Array.from(document.querySelectorAll('.syn.right .bar'));
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

function createBloom(hue) {
  const bloom = document.createElement('div');
  bloom.classList.add('bloom');
  body.appendChild(bloom);
  bloom.style = `background-color: hsl(${hue}, 50%, 50%);`;

  setTimeout(() => {
    bloom.classList.add('flight');
      setTimeout(() => {
        bloom.classList.add('land');
        setTimeout(() => {
          bloom.parentElement.removeChild(bloom);
        }, 2100);
      }, 2100);
  },0 );
}



function animate() {
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteTimeDomainData(dataArray);
  
  for (let i = 0; i < topElements.length; i++) {
    const div = topElements[i];
    if (div.clientHeight + COLOR_THRESHOLD < dataArray[i]) {
      hueChanges += 1;
      hue = (hue + HUE_INCREMENT) % 360;
      
    } else if (div.clientHeight - COLOR_THRESHOLD > dataArray[i]) {
      hueChanges += 1;
      hue = Math.abs(hue - HUE_INCREMENT);
    }
    div.setAttribute('style', `height: ${dataArray[i]}px; background-color: hsla(${hue}, 100%, 50%, ${opacity / 100} );`);
  }
  
  for (let i = 0; i < bottomElements.length; i++) {
    const div = bottomElements[i];
    if (div.clientHeight + COLOR_THRESHOLD < dataArray[i]) {
      hueChanges += 1;
      hue = (hue + HUE_INCREMENT) % 360;
    } else if (div.clientHeight - COLOR_THRESHOLD > dataArray[i]) {
      hueChanges += 1;
      hue = Math.abs(hue - HUE_INCREMENT);
    }
    div.setAttribute('style', `height: ${dataArray[i + (TOTAL_ELEMENTS / 4)]}px; background-color: hsla(${hue}, 100%, 50%, ${opacity / 100});`);
  }
  
  if (hueChanges > BLOOM_EVERY) {
    createBloom(hue);
    hueChanges = 0;
  }
  
  // for (let i = 0; i < leftElements.length; i++) {
  //   const div = leftElements[i];
  //   if (div.clientHeight + COLOR_THRESHOLD < dataArray[i]) {
  //     hue = (hue + HUE_INCREMENT) % 360;
  //   } else if (div.clientHeight - COLOR_THRESHOLD > dataArray[i]) {
  //     hue = Math.abs(hue - HUE_INCREMENT);
  //   }
  //   div.setAttribute('style', `width: ${dataArray[i + (TOTAL_ELEMENTS / 2) ]}px; background-color: hsl(${hue}, 100%, 50%);`);
  // }

  // for (let i = 0; i < rightElements.length; i++) {
  //   const div = rightElements[i];
  //   if (div.clientHeight + COLOR_THRESHOLD < dataArray[i]) {
  //     hue = (hue + HUE_INCREMENT) % 360;
  //   } else if (div.clientHeight - COLOR_THRESHOLD > dataArray[i]) {
  //     hue = Math.abs(hue - HUE_INCREMENT);
  //   }
  //   div.setAttribute('style', `width: ${dataArray[i + (TOTAL_ELEMENTS / 2) ]}px; background-color: hsl(${hue}, 100%, 50%);`);
  // }

  window.requestAnimationFrame(animate);
}

function clear() {
  body.innerHTML = '';
  return Promise.resolve(true);
}

let cycles = 40;
let streak = 0;
function trackInputEvents() {
  const events = totalInputEvents / cycles;
  opacity = events * 100;
  if (opacity < 50) {
    totalInputEvents += 25;
    hue += 15;
    createBloom(hue);
  }
  if (events > 1) {
    streak++;
  }

  if (streak > 15){
    hue += 30;
    createBloom(hue);
    streak = 0;
  }
  cycles++;
}

function handleTyping() {
  hue += totalInputEvents;
}

function onTerminalInput(event) {
  totalInputEvents++;
  if (event.key === 'Enter' && !didStart) {
    console.log('lets get this bad party started');
    startAudio();
    setInterval(trackInputEvents, INPUT_TRACKING_INTERVAL);
    didStart = true;
    document.querySelector('textarea').value = 
`function synesthesia() {
  // Keep on coding or typing!
  // Typing/Coding will affect the visualization
  // (this code won't run)
  // Typing fast or slow will affect the colors
  const el = document.getElementById('non-existant');

}`
  }
}

// Initialize the code!
function init() {
  const textarea = document.createElement('textarea');
  textarea.value = `
This is an interactive experience showing what it's like to write code with sound-color synesthesia. 

It's not a perfect representation of my own experience, but it's the best I could do alongside my programming skills.

Press 'Enter' and start 'writing code' in this element to see what it looks like
  `;
  textarea.classList.add('terminal');
  body.appendChild(textarea);
  textarea.focus();
  textarea.addEventListener('keyup', onTerminalInput);
  
  // Reference: https://www.kkhaydarov.com/audio-visualizer/
}

init();
