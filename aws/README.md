# AWS Stack for Concept backend

This code is based on the AWS example [simple-websockets-chat-app](https://github.com/aws-samples/simple-websockets-chat-app).

# Deploying to your account

You can install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) and use it to package, deploy, and describe your application.  These are the commands you'll need to use:

```
sam package \
    --template-file template.yaml \
    --output-template-file packaged.yaml \
    --s3-bucket REPLACE_WITH_YOUR_S3_BUCKET_NAME

sam deploy \
    --template-file packaged.yaml \
    --stack-name simple-websocket-chat-app \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides Prefix=REPLACE_WITH_YOUR_PREFIX

aws cloudformation describe-stacks \
    --stack-name simple-websocket-chat-app --query 'Stacks[].Outputs'
```
