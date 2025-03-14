export default class PictureSender {
    static async sendPicture(emails, fileName) {
        console.log(`Sending picture : ${fileName} to ${emails}`);

        const body = {
            "pictures": fileName,
            "emails": emails,
        };

        console.log(body);

        try {
            const response = await fetch('http://localhost:3000/send-picture', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Picture sent successfully');
            } else {
                const errorText = await response.text();
                console.error('Failed to send picture:', response.status, response.statusText, errorText);
            }
        } catch (error) {
            console.error('Error sending picture:', error);
        }
    };

}