const audioContext = new AudioContext();

function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; ++i) {
        const x = (i * 2) / samples - 1;
        curve[i] = Math.sin(Math.PI * amount * x) * 0.75; // Experiment with this expression
    }

    return curve;
}

const Nodo_Distortion = audioContext.createWaveShaper(); //Nodo de distorção não linear
Nodo_Distortion.curve = makeDistortionCurve(1);
Nodo_Distortion.oversample = '4x';
const Nodo_ganho = audioContext.createGain(); //Nodo de controle de ganho
const biquadFilter = audioContext.createBiquadFilter(); //Nodo de filtro

//Nodo que aplica "Linear Convolution" https://en.wikipedia.org/wiki/Convolution#Visual_explanation Comum pra efeito de reverb
const convolver = audioContext.createConvolver(); 


const Osc_ativos = [];


Nodo_ganho.connect(Nodo_Distortion);

const analyser = audioContext.createAnalyser(); // Nodo de análise, entra e sai sem alteração
analyser.fftSize = 2048;
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);
analyser.smoothingTimeConstant = 0.85;
// Connect the source to be analysed
Nodo_Distortion.connect(analyser);
analyser.connect(audioContext.destination);

// Get a canvas defined with ID
const canvas = document.getElementById("grafico_final");
const canvasCtx = canvas.getContext("2d");


const volumeControl = document.querySelector("input[name='volume']");
const DistortionControl = document.querySelector("input[name='distInput']");
const oitavaInput = document.getElementById("oitavaInput");

function draw() {
    requestAnimationFrame(draw);
  
    analyser.getByteTimeDomainData(dataArray);
  
    canvasCtx.fillStyle = "rgb(200 200 200)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0 0 200)";
  
    canvasCtx.beginPath();
  
    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;
  
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
  
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
  
      x += sliceWidth;
    }
  
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
  
  draw();
  
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
    Nodo_ganho.gain.value = volumeValue;
}


function changeDistortion(event) {
    const distortionValue = parseFloat(DistortionControl.value) | 0 ;

    if (distortionValue <2) {
        // If distortion value is 0, set a default curve with no distortion
        Nodo_Distortion.curve = makeDistortionCurve(1); // Use a small non-zero value
    } else {
        Nodo_Distortion.curve = makeDistortionCurve(distortionValue);
    }

    console.log("mudou algo");
    console.log(distortionValue);
}


function nota(note) {
    const oitava = parseInt(oitavaInput.value) || 0;

    if (!Osc_ativos[oitava][note]) {
        Osc_ativos[oitava][note] = play_nota(oitava, note);
    }
    Osc_ativos[oitava][note].start();
}

function play_nota(oitava, note) {
    const osc = audioContext.createOscillator();
    osc.connect(Nodo_ganho);
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