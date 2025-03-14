import ContactFormHandler from "../ContactFormHandler.js";
import PictureSender from "../PictureSender.js";

const onAddEmailClicked = () => {
    console.log("Add email button was clicked")
    ContactFormHandler.addEmails("emailList", "email-list");
}

const onSendEmailClicked = () => {
    console.log("Send email button was clicked")
    doSend();
}

const addEmail = document.querySelector("#add-email-btn");
const sendPicture = document.querySelector("#send-email");

addEmail.addEventListener("click", onAddEmailClicked);
sendPicture.addEventListener("click", onSendEmailClicked);


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

const doSend = async () => {
    const emails = ContactFormHandler.getEmailsFromList("email-list");
    const fileName = document.getElementById("image-name").value;

    console.log(emails);
    console.log(fileName);

    await PictureSender.sendPicture(emails, fileName);
}