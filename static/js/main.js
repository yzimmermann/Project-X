const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const output = document.getElementById('output');

let recorder;

recordButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            recorder = new WebAudioRecorder(source, { workerDir: '/static/js/' });
            recorder.startRecording();
            stopButton.disabled = false;
            recordButton.disabled = true;
        });
});

stopButton.addEventListener('click', () => {
    recorder.finishRecording(() => {
        stopButton.disabled = true;
        recordButton.disabled = false;

        const formData = new FormData();
        formData.append('audio_data', recorder.getWavBlob());

        fetch('/process_audio', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(result => {
                output.innerHTML = `Processed output: ${result}`;
            });
    });
});

