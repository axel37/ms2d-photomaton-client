//// Step 0 : Check feature support and request permission
// TODO : Handle permission not granted
const mediaSupport = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

if (!mediaSupport) {
    console.warn('User media not supported');
}

//// Step 2 : Select an output directory

//// Step 3 : Display photo app (take photo, save photo, display photo)
// Source : https://www.digitalocean.com/community/tutorials/front-and-rear-camera-access-with-javascripts-getusermedia
const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

/** Video resolution to request */
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

/**
 * Get media devices and return a list of options to be used in a <select>
 *     Will ask for permission if not done yet.
 *     TODO : Handle permission denial
 * @returns {Promise<void>}
 */
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
        play.classList.add('hide');
        pause.classList.remove('hide');
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
    play.classList.add('hide');
    pause.classList.remove('hide');
    screenshot.classList.remove('hide');
    streamStarted = true;
};

getCameraSelection();

cameraOptions.onchange = () => {
    const updatedConstraints = {
        ...constraints,
        deviceId: {
            exact: cameraOptions.value
        }
    };
    startStream(updatedConstraints);
};

/**
 * Pause video preview and show play button
 */
const pauseStream = () => {
    video.pause();
    play.classList.remove('hide');
    pause.classList.add('hide');
};

const doScreenshot = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    screenshotImage.src = canvas.toDataURL('image/webp');
    screenshotImage.classList.remove('hide');
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;