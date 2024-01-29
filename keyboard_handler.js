// Function to activate a button
function activateButton(buttonId) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.classList.add('active');
  }
}

// Function to deactivate a button
function deactivateButton(buttonId) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.classList.remove('active');
  }
}

// Function to handle keydown events
function handleKeyDown(event) {
  switch (event.code) {
    case 'KeyQ':
      activateButton('C0');
      nota("C");
      break;
    case 'KeyW':
      activateButton('C#0');
      nota("C#");
      break;
    case 'KeyE':
      activateButton('D0');
      nota("D");
      break;
    case 'KeyR':
      activateButton('D#0');
      nota("D#");
      break;
    case 'KeyT':
      activateButton('E0');
      nota("E");
      break;
    case 'KeyY':
      activateButton('F0');
      nota("F");
      break;
    case 'KeyU':
      activateButton('F#0');
      nota("F#");
      break;
    case 'KeyI':
      activateButton('G0');
      nota("G");
      break;
    case 'KeyO':
      activateButton('G#0');
      nota("G#");
      break;
    case 'KeyP':
      activateButton('A0');
      nota("A");
      break;
    case 'BracketLeft':
      activateButton('A#0');
      nota("A#");
      break;
    case 'BracketRight':
      activateButton('B0');
      nota("B");
      break;
    //continuar depois
  }
}

// Function to handle keyup events
function handleKeyUp(event) {
  switch (event.code) {
    case 'KeyQ':
      deactivateButton('C0');
      nota_release("C");
      break;
    case 'KeyW':
      deactivateButton('C#0');
      nota_release("C#");
      break;
    case 'KeyE':
      deactivateButton('D0');
      nota_release("D");
      break;
    case 'KeyR':
      deactivateButton('D#0');
      nota_release("D#");
      break;
    case 'KeyT':
      deactivateButton('E0');
      nota_release("E");
      break;
    case 'KeyY':
      deactivateButton('F0');
      nota_release("F");
      break;
    case 'KeyU':
      deactivateButton('F#0');
      nota_release("F#");
      break;
    case 'KeyI':
      deactivateButton('G0');
      nota_release("G");
      break;
    case 'KeyO':
      deactivateButton('G#0');
      nota_release("G#");
      break;
    case 'KeyP':
      deactivateButton('A0');
      nota_release("A");
      break;
    case 'BracketLeft':
      deactivateButton('A#0');
      nota_release("A#");
      break;
    case 'BracketRight':
      deactivateButton('B0');
      nota_release("B");
      break;
    //continuar depois
  }
}




  // Add event listeners to buttons
  /*document.getElementById('button1').addEventListener('click', () => alert('Button 1 clicked'));
  document.getElementById('button2').addEventListener('click', () => alert('Button 2 clicked'));*/

  // Add event listener to the document for keydown events
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);