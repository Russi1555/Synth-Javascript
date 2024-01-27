const audioContext = new AudioContext();
const Osc_ativos = [];
const Nodo_ganho = audioContext.createGain();
Nodo_ganho.connect(audioContext.destination);

const volumeControl = document.querySelector("input[name='volume']");
const oitavaInput = document.getElementById("oitavaInput");

let noteFreq = [{}];

const wavePicker = document.querySelector("select[name='waveform']");
const customWaveform = audioContext.createPeriodicWave(new Float32Array([0, 0, 1, 0, 1]), new Float32Array([0, 0, 1, 0, 1]));

function setup() {
    volumeControl.addEventListener("change", changeVolume, false);
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
    Nodo_ganho.gain.value = volumeControl.value;
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