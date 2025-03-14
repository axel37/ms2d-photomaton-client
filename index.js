import DonwloadHandler from "./src/DonwloadHandler.js";
import PictureSender from "./src/PictureSender.js";
import EmailHandler from "./src/EmailHandler.js";

//Check feature support and request permission
// TODO : Handle permission not granted
const mediaSupport =
  "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices;

if (!mediaSupport) {
  console.warn("User media not supported");
}

// Source : https://www.digitalocean.com/community/tutorials/front-and-rear-camera-access-with-javascripts-getusermedia
const controls = document.querySelector(".controls");
const cameraOptions = document.querySelector(".video-options>select");
const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const screenshotImage = document.querySelector("img");
const buttons = [...controls.querySelectorAll("button")];
let streamStarted = false;

const [play, screenshot, pause] = buttons;

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
      max: 1440,
    },
  },
};

/**
 * Get media devices and return a list of options to be used in a <select>
 *     Will ask for permission if not done yet.
 *     TODO : Handle permission denial
 * @returns {Promise<void>}
 */
const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  const options = videoDevices.map((videoDevice) => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join("");

  // Add event listener for the select element
  cameraOptions.onchange = () => {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value,
      },
    };
    startStream(updatedConstraints);
  };

  if (videoDevices.length > 0) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: videoDevices[0].deviceId,
      },
    };
    startStream(updatedConstraints);
  }
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add("hide");
    pause.classList.remove("hide");
    return;
  }
  if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value,
      },
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
  play.classList.add("hide");
  pause.classList.remove("hide");
  screenshot.classList.remove("hide");
  streamStarted = true;
};

getCameraSelection();

cameraOptions.onchange = () => {
  const updatedConstraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value,
    },
  };
  startStream(updatedConstraints);
};

/**
 * Pause video preview and show play button
 */
const pauseStream = () => {
  video.pause();
  play.classList.remove("hide");
  pause.classList.add("hide");
};

const doScreenshot = async () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL("image/webp");
  screenshotImage.classList.remove("hide");

  screenshotImage.onclick = () => {
    //ouvrir la page page-mail.html
    window.open("src/page/page-mail.html");
  };

  let fileName = await savePhoto();
  fileName = fileName.slice(0, -4);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  const emails = EmailHandler.getEmailsFromList("email-list");

  console.log(emails);
  console.log(fileName);

  await PictureSender.sendPicture(emails, fileName);
};

const savePhoto = async () => {
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  //Generate file name with current date and time
  const now = new Date();
  const fileName = `${now.getDate().toString().padStart(2, "0")}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getFullYear()}${now
    .getHours()
    .toString()
    .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}.jpg`;

  try {
    return await DonwloadHandler.downloadPicture(blob, fileName);
  } catch (error) {
    console.error("Error saving image:", error);
  }
};

document.getElementById("add-email-btn").addEventListener("click", function () {
  EmailHandler.addEmails("emailList", "email-list");
});

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;
