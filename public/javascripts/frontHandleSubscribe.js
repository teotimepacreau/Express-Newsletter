// SUBSCRIBING
document.getElementById('myForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const data = {
        email: document.getElementById('form-email').value.trim(),
        firstname: document.getElementById('form-firstname').value.trim(),
        lastname: document.getElementById('form-lastname').value.trim()
    };
    console.log('Form data:', data);

    try {
      const response = await fetch('/subscribe', {//this fetch call sends a POST request to the /subscribe route with the data object in JSON format
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'//indique au serveur qu'on envoie du JSON
        },
        body: JSON.stringify(data)//convertit notre objet JS data en JSON et le met dans le body du POST HTTP
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
        console.log('Subscribed successfully');

        //send visual notif confirmation
        const notificationSubscribePositive = document.createElement('div')
        notificationSubscribePositive.innerHTML = `
        <i class="ph ph-check-circle"></i>
        <span>Subscribed successfully</span>
        `
        notificationSubscribePositive.classList.add('notif', 'subscribed-successfully')
        notificationSubscribePositive.setAttribute("role", "alert")
        const container = document.querySelector('.container')
        container.appendChild(notificationSubscribePositive)

        setTimeout(()=>{
            container.removeChild(notificationSubscribePositive)
        }, 4000)
      } else {
        // Handle error, e.g., show an error message
        console.error('Error subscribing:', response.statusText);

        //send visual notif "Email already exists"
        const notifEmailAlreadyExists = document.createElement('div')
        notifEmailAlreadyExists.innerHTML = `
        <i class="ph ph-seal-warning"></i>
        <span>Error : E-mail already added</span>
        `
        notifEmailAlreadyExists.classList.add('notif','email-already-exists')
       notifEmailAlreadyExists.setAttribute("role", "alert")
        const container = document.querySelector('.container')
        container.appendChild(notifEmailAlreadyExists)
        setTimeout(()=>{
          container.removeChild(notifEmailAlreadyExists)
      }, 4000)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
