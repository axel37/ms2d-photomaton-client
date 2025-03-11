//// Step 0 : Check feature support and request permission
// TODO : Handle permission not granted
const mediaSupport = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

if (!mediaSupport) {
    console.warn('User media not supported');
}
navigator.mediaDevices.getUserMedia({video: true})

//// Step 1 : Select an input device
// Source : https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API
navigator.mediaDevices.enumerateDevices().then((devices) => {
    console.log(devices)
    devices.forEach((device) => {
        const menu = document.getElementById("input-devices");
        if (device.kind === "videoinput") {
            console.log(device)
            const item = document.createElement("option");
            item.textContent = device.label;
            item.value = device.deviceId;
            menu.appendChild(item);
        }
    });
});



//// Step 2 : Select an output directory

//// Step 3 : Display photo app (take photo, save photo, display photo)
const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
    video: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440
        },
    }
};

const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
};

play.onclick = () => {
    if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
            ...constraints,
            deviceId: {
                exact: cameraOptions.value
            }
        };
        startStream(updatedConstraints);
    }
};

const startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
};

const handleStream = (stream) => {
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    screenshot.classList.remove('d-none');
    streamStarted = true;
};

getCameraSelection();