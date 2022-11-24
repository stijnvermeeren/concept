# Concept

An implementation for playing the game of [Concept](https://concept-the-game.com/) by Repos Productions online. Different players can connect to the same game and can follow the concept that is being defined in real-time. Currently, the implementation does not support playing multiple games at the same time.
 
## Technology
This project can serve as a demonstration for how to use the following technologies:
- A [Vue.js](https://vuejs.org/) frontend with the [Vuetify](https://vuetifyjs.com/) Material Design Framework and drag-and-drop support using [SortableJS (Vue.Draggable)](https://github.com/SortableJS/Vue.Draggable/).
- A serverless backend based on the AWS services [API Gateway](https://aws.amazon.com/api-gateway/), [Lambda](https://aws.amazon.com/lambda/) and [DynamoDB](https://aws.amazon.com/dynamodb/).
- Infrastructure-as-code management of the backend deployment using [Pulumi](https://www.pulumi.com/).
- Frontend-backend communication using *websockets*.

## Credits
- Game concept by [Repos Production](https://rprod.com/).
- Code written by [Stijn Vermeeren](https://stijnvermeeren.be/).
- Icons by Melina Found.
- The setup for using Websockets with API Gateway and Lambda on AWS is inspired by the [AWS Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html).

## Deployment to AWS using Pulumi

The recommended way of deploying this application is using [AWS](https://aws.amazon.com/) and [Pulumi](https://www.pulumi.com/). After having installed Pulumi and configured Pulumi to access your AWS account, go to the `pulumi` subdirectory of this project and run the command `pulumi up` to deploy the whole stack. The `websocket_url`, which is required for the frontend configuration, will be provided as an output of this command. 

## Frontend setup

### Install dependencies

Download all the dependencies using `npm install`.

### Configure Websocket API

To correctly connect to the Websocket API that is running on AWS, the URL of the Websocket API must be defined in the `VUE_APP_WEBSOCKET_URL` [environment variable](https://cli.vuejs.org/guide/mode-and-env.html).

One way to do this is to copy the file `frontend/.env` to `frontend/.env.local` (this file will be ignored by git) and to define the URL in this `.env.local` file. More options can be found in the Vue CLI documentation on [modes and environment variables](https://cli.vuejs.org/guide/mode-and-env.html#modes).

### Development build

Compile for development (with hot-reloading) using `npm run serve`.

### Production build

Build and minify for production using `npm run build`.
