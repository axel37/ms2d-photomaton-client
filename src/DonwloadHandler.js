export default class DonwloadHandler {

    static async downloadPicture(blob, fileName) {
        const filePickerIsAvailable = "showSaveFilePicker" in window;

        return filePickerIsAvailable ? this.downloadOnChromium(blob, fileName) : this.downloadOnFirefox(blob, fileName);
    }

    /**
     * Downloading using the showFilePicker method, only available on chromium-based browsers (for now ?)
     * @param blob The picture to download
     * @param fileName How the picture should be named
     * @returns {Promise<*>}
     */
     static async downloadOnChromium(blob, fileName) {
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
        return fileName;
    }

    /**
     * Downloading for browsers which do not support showFilePicker
     * TODO : This does not force the selection of a directory.
     *
     * Source : https://stackoverflow.com/a/79139546
     */
    static async downloadOnFirefox(blob, filename) {
        const downloadelem = document.createElement("a");
        const url = URL.createObjectURL(blob);
        document.body.appendChild(downloadelem);
        downloadelem.href = url;
        downloadelem.download = filename;
        downloadelem.click();
        downloadelem.remove();
        window.URL.revokeObjectURL(url);
        return filename;
    }
}