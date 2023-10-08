# Express-Newsletter
A fully functional newsletter website, where you can subscribe and receive a welcoming email, and then receive periodically the newsletter. It also allows unsubscribing through a dedicated page.

# 🛠️ Built with :
- CSS : all UI design is from me, container queries, variable font, grid, flexbox... 
- HTML : form best practice and validation, semantic...
- Javascript : async/await, fetch API
- NodeJS
- Express
- SQLite database and SQL queries

# What I learned :
- how to use Express
- create and manage SQL database
- handle HTTP requests and responses
- work asynchronously and handle errors in Node.JS
- setup backend routes and controllers
- HTML emails (different support rules of the mail clients, specific CSS rules applying to it...)
- create templating for content
- deploy a front & back on an online server

# In-depth details of the project : 
1. Subscription logic : Users can subscribe on homepage by filling and sending the form : lastName, firstName and email are added to SQLite Database. A notif confirms or infirms the subscription. An email confirms subscription and welcome new user. ✅ ⚠️: welcome email don't have the good issue link
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


