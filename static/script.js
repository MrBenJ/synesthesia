const body = document.getElementById('root');


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