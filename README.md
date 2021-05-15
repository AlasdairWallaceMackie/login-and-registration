A Django app that provides basic login and registration functionality

Features:

Salted, hashed passwords
Front-end and back-end form validation -- index.html will highlight invalid fields in red with a message underneath explaining what is required
Email regex
Tracking current logged in user via request.session
Preventing duplicate emails from being registered
!! This app is dependent on request.session, so make sure you apply migrations before running the server

Known bugs:

If you try to register a duplicate email, the front end validation won't catch it, instead you will be redirected to an error page.