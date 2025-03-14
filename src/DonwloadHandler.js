export default class DonwloadHandler {
    async downloadOnChromium(blob, fileName) {
        // Request explorer to save file
        const options = {
            types: [
                {
                    description: "JPG Files",
                    accept: {"image/jpg": [".jpg"]},
                },
            ],
            suggestedName: fileName,
        };

        const handle = await window.showSaveFilePicker(options);
        const writable = await handle.createWritable();

        await writable.write(blob);
        await writable.close();
        console.log("Image saved successfully");
        return fileName;
    }

    // Downloading for non-chromium browsers
    // Source : https://stackoverflow.com/a/79139546
    async downloadOnFirefox(blob, filename) {
        const downloadelem = document.createElement("a");
        const url = URL.createObjectURL(blob);
        document.body.appendChild(downloadelem);
        downloadelem.href = url;
        downloadelem.download = filename;
        downloadelem.click();
        downloadelem.remove();
        window.URL.revokeObjectURL(url);
    }

}