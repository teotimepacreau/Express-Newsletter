# Express-Newsletter
Newsletter project built with NodeJS, Express and SQLite

# Features : 
1. Subscription logic : User can subscribe by filling and sending the form : lastname, firstname and email are added to SQLite DB. A notif confirms or infirms the subscription ✅
2. Unsubscription logic: Create a route for users to unsubscribe from the newsletter. Update the database accordingly. Checks if email is already in the DB, if not sends an error notif✅
3. Created front for sub and unsub page ✅
4. Create Newsletter Templates: 
- Design and create newsletter templates using HTML and CSS ✅ ⚠️: anchor link to unsub at the bottom of the email is waiting for his definitive href
- Store these templates on your server or use a template library.
1. Composing and Sending Newsletters:
- Create a route or controller to compose newsletters with the desired content.🚧
- Implement functionality to retrieve subscribers' information from the database and send newsletters to your subscribers.✅
- Use an email library like Nodemailer to send emails programmatically.✅
1. Scheduling Newsletter Sending:
- Implement a scheduling mechanism to send newsletters at specific intervals or times with a library like node-cron to schedule periodic tasks.🚧
1. Security Considerations: Implement data validation, sanitation, and encryption to protect user information. Prevent SQL injection and other security vulnerabilities. 🚧
2. Error Handling: Implement proper error handling and validation for user inputs and database operations. 🚧
3. Deploy on fly.io 🚧

# 🛠️ 
- NodeJS
- Express
- SQLite database
- VanillaJS, CSS, HTML