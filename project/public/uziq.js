
function µziq() {

    let subd = random(["1m", "2n", "4n"])


    oscill1 = random(['fmtriangle', 'fmsine', 'square4'])
    oscill2 = random(['fmtriangle', 'fmsine', 'square4'])
    oscill3 = random(['fmtriangle', 'fmsine', 'square4'])

    bpm = floor(random(40, 80))
    moodz()
    let scale = random(moods)

    initialGain = -60
    Tone.Master.volume.value = initialGain
    fadeIn(10)

    // FX
    const filter = new Tone.Filter(400, 'highpass')

    const reverb = new Tone.Reverb({
        decay: 40,
        preDelay: 0.01,
        wet: 1.0
    })

    const delay = new Tone.FeedbackDelay({
        feedback: 0.8,
        delayTime: "1m",
        wet: 0.8
    })

    const bitCrusher = new Tone.BitCrusher({
        bits: 8,
        wet: 0.3
    });
    const chorus = new Tone.Chorus(4, 2.5, 1.0)
    const vibrato = new Tone.Vibrato(1, 0.7)
    const limiter = new Tone.Limiter({
        "threshold": -6,
    })

    
    const synth = new Tone.Synth({
        oscillator: {
            type: 'triangle'
        },
        envelope: {
            attack: 1.5,
            decay: 0.2,
            sustain: 0.5,
            release: 1.5
        }
    })
    synth.volume.value = +5

    synth.connect(chorus)
    chorus.connect(vibrato)
    vibrato.connect(delay)
    delay.connect(bitCrusher)
    bitCrusher.connect(reverb)
    reverb.connect(filter)
    filter.connect(limiter)
    limiter.toDestination()

    Tone.Transport.scheduleRepeat(time => {
        let note = random(scale.notes)
        synth.triggerAttackRelease(note, subd, time);
    }, subd)

      /////////           //////////
     /////////  synth 2  //////////
    /////////           //////////

    let subd2 = random(["1m", "2n", "4n"])

    const synth2 = new Tone.Synth({
        oscillator: {
            type: 'sine'
        },
        envelope: {
            attack: 0.5,
            decay: 0.4,
            sustain: 0.8,
            release: 1.0
        }
    })
    synth2.volume.value = -10

    synth2.connect(chorus)
    chorus.connect(vibrato)
    vibrato.connect(delay)
    delay.connect(bitCrusher)
    bitCrusher.connect(reverb)
    reverb.connect(filter)
    filter.connect(limiter)
    limiter.toDestination()


    Tone.Transport.scheduleRepeat(time => {
        let note = random(scale.notes)
        synth2.triggerAttackRelease(note, subd2, time);
    }, subd2)
    
    // Tone.Transport.start()
    Tone.Transport.bpm.value = bpm
    console.log(scale.name)
}

function randomizeStepSequence(length) {
    const stepSequence = Array.from(Array(length).keys());
    for (let i = stepSequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [stepSequence[i], stepSequence[j]] = [stepSequence[j], stepSequence[i]];
    }
    return stepSequence;
}

function dynamicVarsAudio() {
    subdivrnd = random(['4n', '8n', '2n', '1m', "16n", "32n"]);
}
function fadeIn(duration) {
    const targetGain = -20
    Tone.Master.volume.rampTo(targetGain, duration);
}

function moodz() {
    moods = [
        {
            name: "1",
            chords: [['Eb2', 'G2', 'Bb2'], ['C2', 'Eb2', 'G2'], ['Eb3', 'G3', 'Bb3'],
            ['C3', 'Eb3', 'G3'], ['Bb3', 'D4', 'F4'], ['Ab3', 'C4', 'Eb4'],
            ['Bb4', 'D5', 'F5'], ['Eb4', 'G4', 'Bb4']],
            notes: ["Eb2", "C2", "Eb3", "C3", null, "Bb3", null, 'Ab3', null, 'Bb4', 'Eb4']
        },
        {
            name: "2",
            chords: [['D2', 'F2', 'Ab2'], ['F2', 'Ab2', 'C3'], ['Bb2', 'Db3', 'F3'],
            ['Gb2', 'Bb2', 'Db3'], ['Ab2', 'C3', 'Eb3'], ['Db2', 'F2', 'Ab2'],
            ['Eb2', 'Gb2', 'Bb2'], ['Bb2', 'D3', 'F3']],
            notes: ["D2", "F2", "Bb2", "Gb2", null, "Ab2", null, 'Db2', null, 'Eb2', 'Bb2']
        },
        {
            name: "3",
            chords: [['Gb2', 'Bb2', 'Db3'], ['Bb2', 'Eb3', 'Gb3'], ['Eb2', 'Ab2', 'C3'],
            ['Ab2', 'C3', 'Eb3'], ['Db2', 'F2', 'Ab2'], ['Eb2', 'Gb2', 'Bb2'],
            ['Bb2', 'D3', 'F3'], ['F2', 'Ab2', 'C3']],
            notes: ["Gb2", "Bb2", "Eb2", "Ab2", null, "Db2", null, 'Eb2', null, 'Bb2', 'F2']
        },
        {
            name: "4",
            chords: [['E2', 'G2', 'B2'], ['G2', 'B2', 'D3'], ['C2', 'Eb2', 'G2'],
            ['Eb2', 'G2', 'Bb2'], ['Ab2', 'C3', 'Eb3'], ['Bb2', 'D3', 'F3'],
            ['F2', 'Ab2', 'C3'], ['G2', 'B2', 'D3']],
            notes: ["E2", "G2", "C2", "Eb2", null, "Ab2", null, 'Bb2', null, 'F2', 'G2']
        },
        {
            name: "5",
            chords: [['G2', 'Bb2', 'D3'], ['Bb2', 'F3', 'F3'], ['G3', 'Bb3', 'D4'],
            ['C3', 'Eb3', 'G3'], ['Eb3', 'Gb3', 'Bb3'], ['Ab3', 'C4', 'Eb4'],
            ['F4', 'F4', 'Ab4'], ['G4', 'Bb4', 'D5']],
            notes: ["G2", "Bb2", "G3", "C3", null, "Eb3", null, 'Ab3', null, 'F4', 'G4']
        },
        {
            name: "6",
            chords: [['C2', 'Eb2', 'G2'], ['Eb2', 'Gb2', 'Bb2'], ['B2', 'D3', 'F3'],
            ['G2', 'Bb2', 'D3'], ['Bb2', 'Db3', 'F3'], ['D3', 'F3', 'Ab3'],
            ['F3', 'A3', 'C4'], ['Ab3', 'C4', 'Eb4']],
            notes: ["C2", "Eb2", "B2", "G2", null, "Bb2", null, 'D3', null, 'F3', 'Ab3']
        },
        {
            name: "7",
            chords: [['D2', 'F2', 'A2'], ['F2', 'A2', 'C3'], ['G2', 'Bb2', 'D3'],
            ['Bb2', 'D3', 'F3'], ['Eb3', 'G3', 'Bb3'], ['G3', 'Bb3', 'D4'],
            ['B3', 'D4', 'F4'], ['E4', 'G4', 'B4']],
            notes: ["D2", "F2", "G2", "Bb2", null, "Eb3", null, 'G3', null, 'B3', 'E4']
        },
        {
            name: "8",
            chords: [['A2', 'C3', 'E3'], ['D3', 'F3', 'A3'], ['G3', 'B3', 'D4'],
            ['B2', 'D3', 'F3'], ['E3', 'G3', 'B3'], ['Ab3', 'C4', 'Eb4'],
            ['Db4', 'F4', 'Ab4'], ['Eb4', 'Gb4', 'Bb4']],
            notes: ["A2", "D3", "G3", "B2", null, "E3", null, 'Ab3', null, 'Db4', 'Eb4']
        },
        {
            name: "9",
            chords: [['F2', 'Ab2', 'C3'], ['Ab2', 'C3', 'Eb3'], ['Db3', 'F3', 'Ab3'],
            ['Gb2', 'Bb2', 'Db3'], ['Bb2', 'D3', 'F3'], ['Eb3', 'G3', 'Bb3'],
            ['G3', 'Bb3', 'D4'], ['C4', 'E4', 'G4']],
            notes: ["F2", "Ab2", "Db3", "Gb2", null, "Bb2", null, 'Eb3', null, 'G3', 'C4']
        },
        {
            name: "10",
            chords: [['Bb2', 'Db3', 'F3'], ['Eb2', 'Gb2', 'Bb2'], ['Gb2', 'Bb2', 'Db3'],
            ['Db2', 'F2', 'Ab2'], ['F2', 'A2', 'C3'], ['A2', 'C3', 'E3'],
            ['E3', 'G3', 'B3'], ['G3', 'B3', 'D4']],
            notes: ["Bb2", "Eb2", "Gb2", "Db2", null, "F2", null, 'A2', null, 'E3', 'G3']
        },
        {
            name: "11",
            chords: [['E2', 'G2', 'B2'], ['G2', 'B2', 'D3'], ['B2', 'D3', 'F3'],
            ['D3', 'F3', 'A3'], ['F3', 'A3', 'C4'], ['A3', 'C4', 'E4'],
            ['C4', 'E4', 'G4'], ['E4', 'G4', 'B4']],
            notes: ["E2", "G2", "B2", "D3", null, "F3", null, 'A3', null, 'C4', 'E4']
        },
        {
            name: "12",
            chords: [['Gb2', 'Bb2', 'Db3'], ['Bb2', 'Db3', 'F3'], ['Db3', 'F3', 'Ab3'],
            ['F3', 'Ab3', 'C4'], ['Ab3', 'C4', 'Eb4'], ['C4', 'Eb4', 'Gb4'],
            ['Eb4', 'Gb4', 'Bb4'], ['Gb4', 'Bb4', 'Db5']],
            notes: ["Gb2", "Bb2", "Db3", "F3", null, "Ab3", null, 'C4', null, 'Eb4', 'Gb4']
        },
        {
            name: "13",
            chords: [['Ab2', 'C3', 'Eb3'], ['C3', 'Eb3', 'G3'], ['Eb3', 'G3', 'Bb3'],
            ['G3', 'Bb3', 'D4'], ['Bb3', 'D4', 'F4'], ['D4', 'F4', 'Ab4'],
            ['F4', 'Ab4', 'C5'], ['Ab4', 'C5', 'Eb5']],
            notes: ["Ab2", "C3", "Eb3", "G3", null, "Bb3", null, 'D4', null, 'F4', 'Ab4']
        },
        {
            name: "14",
            chords: [['Db2', 'F2', 'Ab2'], ['F2', 'Ab2', 'C3'], ['Ab2', 'C3', 'Eb3'],
            ['C3', 'Eb3', 'G3'], ['Eb3', 'G3', 'Bb3'], ['G3', 'Bb3', 'D4'],
            ['Bb3', 'D4', 'F4'], ['D4', 'F4', 'Ab4']],
            notes: ["Db2", "F2", "Ab2", "C3", null, "Eb3", null, 'G3', null, 'Bb3', 'D4']
        },
    ]


    const mood = moods[int(random() * moods.length)]
    chords = mood.chords
    notes = mood.notes
}