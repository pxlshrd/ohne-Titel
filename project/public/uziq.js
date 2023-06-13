
function µziq() {
    osc = random(['fmtriangle', 'fmsine', 'sawtooth', 'square4', 'sawtooth', 'fatsawtooth'])
    bpm = floor(random(40, 80))
    moodz()

    initialGain = -60
    Tone.Master.volume.value = initialGain
    fadeIn(10)
    gainNode = new Tone.Gain().toMaster()

    const reverb = new Tone.Reverb({
        decay: 15,
        preDelay: 0.01,
        wet: 0.8
    }).toDestination()

    const delay = new Tone.FeedbackDelay({
        feedback: 0.5,
        delayTime: "2n",
        wet: 0.3
    })

    const vibrato = new Tone.Vibrato({
        frequency: 0.3,
        depth: 0.9,
        wet: 1
    })

    const bitCrusher = new Tone.BitCrusher({
        bits: 8,
        wet: 0.1
    });

    const synth = new Tone.MonoSynth({

        oscillator: {
            type: osc,
        },
        envelope: {
            attack: 0.5,
            decay: 0.1,
            sustain: 0.3,
            release: 0.2
        },
        filterEnvelope: {
            attack: 0.05,
            decay: 0.01,
            sustain: 0.5,
            release: 2,
            baseFrequency: 400,
            octaves: 3,
            exponent: 2
        }
    }).chain(delay, vibrato, reverb, bitCrusher, gainNode)

    const synth2 = new Tone.PolySynth({
        envelope: {
            attack: 0.5,
            decay: 0.1,
            sustain: 0.1,
            release: 0.2
        },
        filterEnvelope: {
            attack: 0.05,
            decay: 0.01,
            sustain: 0.5,
            release: 0.2,
            baseFrequency: 400,
            octaves: 2,
            exponent: 2
        }

    }).chain(delay, vibrato, reverb, bitCrusher, gainNode)
    synth2.volume.value = -8

    const arpSynth = new Tone.FMSynth({
        harmonicity: 1,
        modulationIndex: 10,
        oscillator: {
            type: 'sine'
        },
        envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.2,
            release: 0.5
        },
        modulation: {
            type: 'square'
        },
        modulationEnvelope: {
            attack: 0.5,
            decay: 0,
            sustain: 1,
            release: 0.5
        }
    }).chain(delay, vibrato, reverb, bitCrusher, gainNode,)
    arpSynth.volume.value = -6

    const firstSynthSeq = new Tone.Sequence((time, note) => {
        if (Math.random() < 0.3) {
            synth.triggerAttackRelease(note, '8n', time);

        }
    }, notes, "4n")

    const chordSequence = new Tone.Sequence((time, chord) => {
        if (Math.random() < 0.5) {
            synth2.triggerAttackRelease(chord, '1m', time);
        }
    }, chords, "2n");


    const arpSequence = new Tone.Sequence((time, chord) => {
        if (Math.random() < 0.3) {

            arpSynth.triggerAttackRelease(chord, '16n', time);

        }
    }, chords, "16n");

    firstSynthSeq.start()
    chordSequence.start();
    arpSequence.start();

    const kick = new Tone.MembraneSynth().toDestination();
    const snare = new Tone.NoiseSynth({ noise: { type: 'brown' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0 } }).toDestination();
    const hiHat = new Tone.MetalSynth({ frequency: 100, envelope: { attack: 0.001, decay: 0.1, release: 0.2 } }).toDestination();
    const snare2 = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.001, decay: 0.1, release: 0.3 } }).toDestination();

    const kickSequence = new Tone.Sequence((time, step) => {
        if (Math.random() < 0.05) {
            kick.triggerAttackRelease('G-1', '8n', time);
        }
    }, randomizeStepSequence(notes.length), '16n');

    const snareSequence = new Tone.Sequence((time, step) => {
        if (Math.random() < 0.4) {
            snare.triggerAttack(time);
        }
    }, randomizeStepSequence(notes.length), '8n');

    const snare2Sequence = new Tone.Sequence((time, step) => {
        if (Math.random() < 0.4) {
            snare2.triggerAttack(time);
        }
    }, randomizeStepSequence(notes.length), '4n');

    const hiHatSequence = new Tone.Sequence((time, step) => {
        if (Math.random() < 0.6) {
            hiHat.triggerAttackRelease('8n', time);
        }
    }, randomizeStepSequence(notes.length), '8n');


    hiHatSequence.humanize = true;
    kickSequence.humanize = true;
    snareSequence.humanize = true;


    // Volume controls
    kick.volume.value = -2;
    snare.volume.value = -15;
    snare2.volume.value = -15;
    hiHat.volume.value = -38;


    const snarePhaser = new Tone.Phaser({
        frequency: 0.1,
        octaves: 5,
        baseFrequency: 1000
    }).toDestination();

    kick.chain(reverb, bitCrusher, gainNode);
    snare.chain(snarePhaser, reverb, bitCrusher, gainNode);
    snare2.chain(snarePhaser, reverb, bitCrusher, gainNode);
    hiHat.chain(reverb, bitCrusher, gainNode);

    // Start the sequences
    // kickSequence.start();
    // snareSequence.start();
    // snare2Sequence.start();
    // hiHatSequence.start();

    Tone.Transport.bpm.value = bpm;
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

}
function fadeIn(duration) {
    const targetGain = -10
    Tone.Master.volume.rampTo(targetGain, duration);
  }

function moodz() {
    const moods = [
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
            chords: [['G2', 'Bb2', 'D3'], ['Bb2', 'Db3', 'F3'], ['G3', 'Bb3', 'D4'],
            ['C3', 'Eb3', 'G3'], ['Eb3', 'Gb3', 'Bb3'], ['Ab3', 'C4', 'Eb4'],
            ['Db4', 'F4', 'Ab4'], ['G4', 'Bb4', 'D5']],
            notes: ["G2", "Bb2", "G3", "C3", null, "Eb3", null, 'Ab3', null, 'Db4', 'G4']
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