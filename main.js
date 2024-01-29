const audioContext = new AudioContext();

function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    if(amount != 0){
        for (let i = 0; i < samples; ++i) {
            const x = (i * 2) / samples - 1;
            curve[i] = Math.sin(Math.PI * amount * x) * 0.75; // Experiment with this expression
        }
    }
    else{
        
    }

    return curve;
}


const Nodo_Ganho = audioContext.createGain(); //Nodo de controle de ganho
const Nodo_Distortion = audioContext.createWaveShaper(); //Nodo de distorção não linear
const Nodo_Filtro = audioContext.createBiquadFilter(); //Nodo de filtro
const Nodo_Analyser = audioContext.createAnalyser(); // Nodo de análise, entra e sai sem alteração
//Nodo que aplica "Linear Convolution" https://en.wikipedia.org/wiki/Convolution#Visual_explanation Comum pra efeito de reverb
const convolver = audioContext.createConvolver(); 

let Nodos = [];
Nodos.push(Nodo_Distortion);
Nodos.push(Nodo_Filtro);
Nodos.push(Nodo_Ganho)


//CONFIGS INICIAIS DO FILTRO
Nodo_Filtro.type = "lowshelf";
//Nodo_Filtro.frequency.setValueAtTime(0,audioContext.currentTime);
//Nodo_Filtro.gain.setTargetAtTime(25,audioContext.currentTime);

const Osc_ativos = [];



//CONFIGS DO ANALISADOR
Nodo_Analyser.fftSize = 2048;
Nodo_Analyser.minDecibels = -90;
Nodo_Analyser.maxDecibels = -10;
const bufferLength = Nodo_Analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
Nodo_Analyser.getByteTimeDomainData(dataArray);
Nodo_Analyser.smoothingTimeConstant = 0.85;

// Connect the source to be analysed (oscilador/key -> distorcao -> filtro -> ganho -> analisador -> destination) futuramente a ordem podera ser alterada pelo user

Nodo_Distortion.connect(Nodo_Filtro);
Nodo_Filtro.connect(Nodo_Ganho);
Nodo_Ganho.connect(Nodo_Analyser);
Nodo_Analyser.connect(audioContext.destination);

// Get a canvas defined with ID
const canvas = document.getElementById("grafico_final");
const canvasCtx = canvas.getContext("2d");


const volumeControl = document.querySelector("input[name='volume']");
const DistortionControl = document.querySelector("input[name='distInput']");
const oitavaInput = document.getElementById("oitavaInput");

let frameCount = 0;
const framesToSkip = 3; // Adjust this value to control the speed

function draw() {
    // Increment the frame counter
    frameCount++;

    // Check if it's time to update the display
    if (frameCount >= framesToSkip) {
        // Get time-domain data from the audio analyzer
        Nodo_Analyser.getByteTimeDomainData(dataArray);

        // Set the fill style for the canvas background
        canvasCtx.fillStyle = "rgb(200 200 200)";

        // Clear the entire canvas
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        // Set the line width and stroke style for drawing the waveform
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0 0 200)";

        // Begin drawing a path on the canvas
        canvasCtx.beginPath();

        // Calculate the width of each "slice" in the canvas based on the buffer length
        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        // Loop through each data point in the time-domain data array
        for (let i = 0; i < bufferLength; i++) {
            // Normalize the data to the range [-1, 1]
            const v = dataArray[i] / 128.0;

            // Map the normalized value to the height of the canvas
            const y = (v * canvas.height) / 2;

            // Move to the starting point of the waveform
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                // Draw a line to the next point in the waveform
                canvasCtx.lineTo(x, y);
            }

            // Increment the x-coordinate for the next slice
            x += sliceWidth;
        }

        // Connect the last point in the waveform to the middle of the canvas
        canvasCtx.lineTo(canvas.width, canvas.height / 2);

        // Stroke the path, rendering the waveform on the canvas
        canvasCtx.stroke();

        // Reset the frame counter
        frameCount = 0;
    }

    // Request the next frame
    requestAnimationFrame(draw);
}
  

  
let noteFreq = [{}];

const wavePicker = document.querySelector("select[name='waveform']");
const customWaveform = audioContext.createPeriodicWave([0, 0.5, 0.2, 0.1], [0, 0, 0, 0] );


function setup() {
    volumeControl.addEventListener("change", changeVolume, false);
    DistortionControl.addEventListener("change", changeDistortion, false);

    for (let i = 0; i < 9; i++){ //gera as notas
            noteFreq[i] = {
            "C": 16.35  *(2**i),
            "C#": 17.32 *(2**i),
            "D": 18.35  *(2**i),
            "D#": 19.45 *(2**i),
            "E": 20.60  *(2**i),
            "F": 21.83  *(2**i),
            "F#": 23.12 *(2**i),
            "G": 24.50  *(2**i),
            "G#": 25.96 *(2**i),
            "A": 27.50  *(2**i),
            "A#": 29.14 *(2**i),
            "B": 30.87  *(2**i),
        };
    }
    for (let i = 0; i < 9; i++) {
        Osc_ativos[i] = {};
    }
}

        

function changeVolume(event) {
    const volumeValue = parseFloat(volumeControl.value);
    Nodo_Ganho.gain.value = volumeValue;
}


function changeDistortion(event) {
    const distortionValue = parseFloat(DistortionControl.value) | 0 ;
    if(distortionValue > 0){
        Nodo_Distortion.curve = makeDistortionCurve(DistortionControl.value);
        Nodo_Distortion.oversample = '4x';
    }
    else {
        Nodo_Distortion.curve = null;
        Nodo_Distortion.oversample = "none";
      }

    

    console.log("mudou algo");
    console.log(distortionValue);
}


function nota(note, mod_oitava = 0) {
    const oitava = parseInt(oitavaInput.value) + mod_oitava || mod_oitava;

    if (!Osc_ativos[oitava][note]) {
        Osc_ativos[oitava][note] = play_nota(oitava, note);
    }
    Osc_ativos[oitava][note].start();
}

function play_nota(oitava, note) {
    const osc = audioContext.createOscillator();
    osc.connect(Nodo_Distortion);
    const type = wavePicker.options[wavePicker.selectedIndex].value;
    if (type === "custom") {
        osc.setPeriodicWave(customWaveform);
    } else {
        osc.type = type;
    }
    osc.frequency.value = noteFreq[oitava][note];
    return osc;
}

function nota_release(note) {
    for (let i = 0; i < Osc_ativos.length; i++) {
        if (Osc_ativos[i][note]) {
            Osc_ativos[i][note].stop();
            delete Osc_ativos[i][note];
        }
    }
}


setup();
changeVolume(0);
draw();