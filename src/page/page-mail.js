document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("image-email-form");
  
    form.addEventListener("submit", (event) => {  
      // Récupérer les valeurs des champs
      const imageName = document.getElementById("image-name").value;
      const emails = document.getElementById("emails").value;
  
      // Afficher les valeurs dans la console (ou les envoyer à un serveur)
      console.log("Nom de l'image :", imageName);
      console.log("Liste des emails :", emails);
  
      // Exemple : envoyer les données à un serveur via fetch
      const data = {
        imageName: imageName,
        emails: emails.split(",").map(email => email.trim()), // Convertir en tableau
      };
    });
  });