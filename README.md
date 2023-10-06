# Express-Newsletter
Newsletter project built with NodeJS, Express and SQLite

# Features : 
1. Subscription logic : Users can subscribe on homepage by filling and sending the form : lastName, firstName and email are added to SQLite Database. A notif confirms or infirms the subscription. An email confirms subscription and welcome new user. ✅
2. Unsubscription logic : Users can unsubscribe on the /unsubscribe page. It updates the database accordingly by removing. Checks if email is already in the DB, if not sends an error notif to user✅
3. Newsletter Templates : 
- Each newsletter is created within a template using handlebars✅ ⚠️: anchor link to unsub at the bottom of the email is waiting for his definitive href
4. Composing Newsletters :
- Each newsletter dynamically retrieve lastName and firstName to personalize the mail✅
5. Sending newsletter : 
- Middleware retrieve subscribers' information from the SQL DB✅
- Sendgrid npm package is used to send newsletters to the subscribers.✅
6. Allowing the client to render the email in browser :
- implemented a route that takes a query parameter to decide to render the "welcomeEmail" or the "newsletter" in a new tab.✅ ⚠️: anchor link at the top of the mail must be changed when server is deployed 
7. Scheduling Newsletter Sending:
- Nodecron send newsletters at specific intervals.🚧
8. Security Considerations: Implement data validation, sanitation, and encryption to protect user information. Prevent SQL injection and other security vulnerabilities.🚧
9. Error Handling: Implement proper error handling and validation for user inputs and database operations.🚧
10. Deploy on fly.io🚧
11. DB disaster recovery with filestream.io🚧

# 🛠️
- CSS : container queries, grid, flexbox... 
- HTML : form validation, semantic...
- Javascript
- NodeJS
- Express
- SQLite database
