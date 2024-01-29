function makeDistortionCurve(freq,amp = 1) {

    function gera_curva(funcao){
        for (let i = 0; i < samples; ++i) {
            const x = (i * 2) / samples - 1;
            curve[i] = funcao(freq,amp,x)
        }
        console.log(curve)
        return curve;
    }

    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    const onda_distorcao = distWavePicker.options[distWavePicker.selectedIndex].value;
    if(onda_distorcao == 'sine'){
        return gera_curva(senoide);
    }
    else if(onda_distorcao=='square'){
        return gera_curva(quadrada);
    }
    else if(onda_distorcao=='sawtooth'){
        return gera_curva(serrada);
    }
    else if(onda_distorcao=='triangle'){
        return gera_curva(triangular);
    }
    else if(onda_distorcao=='custom'){
        return gera_curva(custom);
    }
    else{
        console.log("ops")
    }

    
}


function senoide(freq, amp, t){
    return amp* Math.sin(2* Math.PI * freq *t);
}

function quadrada(freq, amp, t) {
    const periodo = 1/freq;
    const tempo_rel_periodo = t % periodo;
    const momento_positivo = tempo_rel_periodo < periodo / 2;
    const valor = momento_positivo ? amp : -amp;
    return valor
}

function serrada(freq, amp, t) {
    const periodo = 1 / freq;
    const tempo_rel_periodo = t % periodo;
    return (2 * amp / periodo) * (tempo_rel_periodo - periodo / 2);
  }
  
  function triangular(freq, amp, t) {
    const periodo = 1 / freq;
    const tempo_rel_periodo = t % periodo;
    const valor = (4 * amp / periodo) * Math.abs(tempo_rel_periodo - periodo / 2);
    return momento_positivo ? amp : -amp;
  }
  

function custom(freq,amp,t){
    return amp * Math.sin(Math.PI * freq * t) * 0.75; // Experiment with this expression
}
