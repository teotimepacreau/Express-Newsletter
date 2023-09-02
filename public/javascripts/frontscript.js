// SUBMITTING FORM
  // This script will be executed when the form is submitted
document.getElementById('myForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const data = {
        email: document.getElementById('form-email').value,
        firstname: document.getElementById('form-firstname').value,
        lastname: document.getElementById('form-lastname').value
    };
    console.log('Form data:', data);

    try {
      const response = await fetch('/subscribe', {//this fetch call sends a POST request to the /subscribe route with the data object in JSON format
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'//indique au serveur qu'on envoie du JSON
        },
        body: JSON.stringify(data)//convertit notre objet data en JSON et le met dans le body du POST HTTP
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
        console.log('Subscribed successfully');

        //send visual notif confirmation
        const notification = document.createElement('div')
        notification.innerHTML = `
        <i class="ph ph-check-circle"></i>
        <span>Subscribed successfully</span>
        `
        notification.classList.add('notif-subscribed-successfully')
        const container = document.querySelector('.container')
        container.appendChild(notification)

        setTimeout(()=>{
            container.removeChild(notification)
        }, 4000)
      } else {
        // Handle error, e.g., show an error message
        console.error('Error subscribing:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

