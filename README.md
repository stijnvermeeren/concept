# Concept

An implementation for playing the game of [Concept](https://concept-the-game.com/) by Repos Productions online. Different players can connect to the same game and can follow the concept that is being defined in real-time.
 
The frontend is written in Vue.js. The backend is written for serverless deployment on AWS. The frontend-backend communication uses websockets.

## Credits
- Game concept by [Repos Production](https://rprod.com/).
- Code written by Stijn Vermeeren.
  - AWS backend based on a template by the AWS team.
- Icons by Melina Found.

## Backend setup

Install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) and use it to package and deploy the application to your AWS account.

### Packaging
Packaging will bundle the necessary Lamdba functions and upload them to S3. A `packages.yaml` CloudFormation template file will be created with the correct references to the created S3 objects.

```
sam package \
    --template-file aws/template.yaml \
    --output-template-file aws/packaged.yaml \
    --s3-bucket REPLACE_WITH_YOUR_S3_BUCKET_NAME
```


### Deploying
Deploying will deploy an AWS CloudFormation stack with all the resources (Lambda functions, DynamoDB tables, API Gateway, etc.) for the backend of this application.

```
sam deploy \
    --template-file aws/packaged.yaml \
    --stack-name REPLACE_WITH_YOUR_STACK_NAME \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides Prefix=REPLACE_WITH_YOUR_PREFIX
```

Note the URL of the created Websocket API, which needs to be defined as an environment variable when building the frontend.

## Frontend setup

### Install dependencies

Download all the dependencies using `npm install`.

### Configure Websocket API

To correctly connect to the Websocket API that is running on AWS, the URL of the Websocket API must be defined in the `VUE_APP_WEBSOCKET_URL` [environment variable](https://cli.vuejs.org/guide/mode-and-env.html).

### Development build

Compile for development (with hot-reloading) using `npm run serve`.

### Production build

Build and minify for production using `npm run build`.
