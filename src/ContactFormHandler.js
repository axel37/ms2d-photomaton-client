export default class ContactFormHandler {
    static getEmailsFromList(emailListId) {
      const emailList = document.getElementById(emailListId);
      return Array.from(emailList.children).map(li => li.textContent);
    }
  
    static addEmails(emailInputId, emailListId) {
      const emailInput = document.getElementById(emailInputId);
      const emailList = document.getElementById(emailListId);
      const emails = emailInput.value.split(',').map(email => email.trim()).filter(email => email);
  
      emails.forEach(email => {
        const li = document.createElement('li');
        li.textContent = email;
        emailList.appendChild(li);
      });
  
      emailInput.value = '';
    }
  }