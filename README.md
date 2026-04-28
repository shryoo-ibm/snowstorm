# SnowStorm tester

This is an automated tester for verifying ServiceNow data.

## Getting started

### Environmental variables

Start by making a copy of `.env.example` and renaming it to `.env`. In your `.env` file, fill in the login credentials for your ServiceNow instance.

### SNOW connection

In order to use the ServiceNow API, we need to do some setup on the instance itself. To do this, we need to create a record in the CORS Rules table (`sys_cors_rule`). For the `Name` field, you can really name it anything you want. For the `REST API` field, make sure to select `Table API [now/table]`. In the `Domain`, put `http://localhost:3131`, as this is the address which will be used by our Next.js application. Finally, in the `HTTP methods` section, select only the `GET` method, as our Next.js application will only be reading information from the instance.

### App setup

Running the application is very simple. First, navigate to the application folder through your command line tool and run `npm install` to download the dependencies needed, and then use the `npm run dev` command to start the application. Once the application is up and running, you can navigate to it with your browser at `http://localhost:3131`.

### Editing and adding tests

The application will perform tests which have been imported into `spec/tests.ts`. An example suite is available in the `spec` folder which demonstrates some of the different kinds of assertions that can be created. Try editing the example suite and making your own suites too!
