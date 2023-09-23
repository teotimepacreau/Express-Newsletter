// UNSUBSCRIBING
document.getElementById("unsubscribe-form").addEventListener('submit',async (event)=> {
  event.preventDefault()
  const email = {
    email: document.getElementById("unsubscribe-email").value.trim()
  }
  console.log('email envoyé depuis unsub', email)
  try{
    const response = await fetch('/unsubscribe',{//this fetch call sends a DELETE request to the /unsubscribe route with the data object in JSON format
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(email)//met l'email dans le body de la requête HTTP
    })

    const responseData = await response.json();//attend la réponse envoyé par ma routes/unsubscribe

    if(response.status === 201){
      console.log('unsubscribed successfully')

      //send visual notif confirmation
      const notificationUnsubscribePositive = document.createElement('div')
      notificationUnsubscribePositive.innerHTML = `
      <i class="ph ph-check-circle"></i>
      <span>Unsubscribed successfully</span>
      `
      notificationUnsubscribePositive.classList.add('notif', 'subscribed-successfully')
      notificationUnsubscribePositive.setAttribute("role", "alert")
      const container = document.querySelector('.container')
      container.appendChild(notificationUnsubscribePositive)

      setTimeout(()=>{
          container.removeChild(notificationUnsubscribePositive)
      }, 4000)
      
    }else{
      if(response.status === 400){
        console.error('Error unsubscribing:', response.statusText);

        //send visual notif "Email already exists"
        const notifEmailDontExists = document.createElement('div')
        notifEmailDontExists.innerHTML = `
        <i class="ph ph-seal-warning"></i>
        <span>Error : E-mail doesn't exists in the database</span>
        `
        notifEmailDontExists.classList.add('notif','email-already-exists')
        notifEmailDontExists.setAttribute("role", "alert")
        const container = document.querySelector('.container')
        container.appendChild(notifEmailDontExists)
        setTimeout(()=>{
          container.removeChild(notifEmailDontExists)
      }, 4000)
    }
    }
  }catch(error) {
    console.error('Error:', error);
  }
})