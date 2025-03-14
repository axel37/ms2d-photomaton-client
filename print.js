document.getElementById("print-photo-btn").addEventListener("click", () => {
    // Créer un input file caché
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Uniquement images

    // Déclencher la sélection de fichier
    fileInput.click();

    // Une fois le fichier sélectionné
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                // Ouvrir une nouvelle fenêtre avec l'image
                const printWindow = window.open("", "_blank");
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Image</title>
                            <style>
                                body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                                img { max-width: 100%; height: auto; }
                            </style>
                        </head>
                        <body onload="window.print(); window.onafterprint = window.close;">
                            <img src="${event.target.result}" />
                        </body>
                    </html>
                `);
                printWindow.document.close();
            };

            reader.readAsDataURL(file);
        }
    });
});
