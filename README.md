# Getting Started with Po-Quo App

Welcome to popular quotes app. This project was built using express and react.

## About the project

This project is a combination of variety of topics we studied during our full-stack course.

Popular-quotes is a website for sharing and reading quotes of all types and languages. 
The website has a Node.js - express api which is in charge of all HTTP requests as well as managing information in the database.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8181] to view it in your browser.

## Enviroment file format and config folder

You will need a .env file at the root folder of the project, the contents of that file is as follows:
### DB = "Your database link"
### HOST = "The Mail service hosting source"
### EMAIL = "Mail address which the emails will be sent from"
### PASS = "Password for said EMAIL"
### SERVICE = "Name of the mailing service company"

Also necessary is a config folder with a default.json file. 
### `default.json`
  Will contain a json object with "jwtKey" property, any string will work as this field is for jwt encryption. 

## Learn More

You can learn more about the developer at https://www.linkedin.com/in/gavriel-mor/ 

To see the react front end repo, go to https://github.com/Gavriel-M/po-quo 
