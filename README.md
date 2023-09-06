# Express-Newsletter
Newsletter project built with NodeJS, Express and SQLite

# Features : 
- user can subscribe by filling and sending the form : lastname, firstname and email are added to SQLite DB. A notif confirms or infirms the subscription ✅
- Unsubscription Logic: Create a route for users to unsubscribe from the newsletter. Update the database accordingly.🚧
- Newsletter Sending: Implement a scheduled task with CRONJOB : Retrieve subscribers' information from the database and use a package like nodemailer to send newsletter each week.🚧
- Security Considerations: Implement data validation, sanitation, and encryption to protect user information. Prevent SQL injection and other security vulnerabilities. 🚧
- Error Handling: Implement proper error handling and validation for user inputs and database operations. 🚧
- Deploy on fly.io 🚧

# 🛠️ 
- NodeJS
- Express
- SQLite database
- VanillaJS, CSS, HTML