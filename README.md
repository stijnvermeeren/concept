# Concept

An implementation for playing the game of [Concept](https://concept-the-game.com/) by Repos Productions online. Different players can connect to the same game and can follow the concept that is being defined in real-time.
 
The frontend is written in Vue.js. The backend is written for serverless deployment on AWS. The frontend-backend communication uses websockets.

## Credits
- Game concept by [Repos Production](https://rprod.com/).
- Code written by Stijn Vermeeren.
  - AWS backend based on a template by the AWS team.
- Icons by Melina Found.

## Deployment to AWS using Pulumi

The recommended way of deploying this application is using [AWS](https://aws.amazon.com/) and [Pulumi](https://www.pulumi.com/). After having installed Pulumi and configured Pulumi to access your AWS account, go to the `pulumi` subdirectory of this project and run the command `pulumi up` to deploy the whole stack. The `websocket_url`, which is required for the frontend configuration, will be provided as an output of this command. 

## Frontend setup

### Install dependencies

Download all the dependencies using `npm install`.

### Configure Websocket API

To correctly connect to the Websocket API that is running on AWS, the URL of the Websocket API must be defined in the `VUE_APP_WEBSOCKET_URL` [environment variable](https://cli.vuejs.org/guide/mode-and-env.html).

### Development build

Compile for development (with hot-reloading) using `npm run serve`.

### Production build

Build and minify for production using `npm run build`.
