import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {connectionsTable, gamesTable} from "./dynamodb";
import {apiGateway} from "./apigateway";

const lambdaRole = new aws.iam.Role("lambdaRole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "lambda.amazonaws.com" }),
});

const lambdaRolePolicyDocument = pulumi
    .all([connectionsTable.arn, gamesTable.arn, apiGateway.executionArn])
    .apply(([connectionsTableArn, gamesTableArn, apiGatewayExecutionArn]) => {
        return aws.iam.getPolicyDocument({
            statements: [
                {
                    effect: "Allow",
                    actions: [
                        "dynamodb:GetItem",
                        "dynamodb:DeleteItem",
                        "dynamodb:PutItem",
                        "dynamodb:Scan",
                        "dynamodb:Query",
                        "dynamodb:UpdateItem",
                        "dynamodb:BatchWriteItem",
                        "dynamodb:BatchGetItem",
                        "dynamodb:DescribeTable",
                        "dynamodb:ConditionCheckItem"
                    ],
                    resources: [
                        connectionsTableArn,
                        `${connectionsTableArn}/index/*`,
                        gamesTableArn
                    ]
                },
                {
                    effect: "Allow",
                    actions: [
                        "execute-api:ManageConnections"
                    ],
                    resources: [
                        `${apiGatewayExecutionArn}/*`
                    ]
                }
            ],
        }).then(document => document.json)
    });

new aws.iam.RolePolicy("lambdaRolePolicy", {
    role: lambdaRole.id,
    policy: lambdaRolePolicyDocument
});

new aws.iam.RolePolicyAttachment("lambdaRolePolicy2", {
    role: lambdaRole.id,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole
});

export const onConnectFunction = new aws.lambda.Function("onConnectFunction", {
    role: lambdaRole.arn,
    handler: "app.handler",
    runtime: "nodejs14.x",
    code: new pulumi.asset.FileArchive("lambda/onconnect")
});
export const sendMessageFunction = new aws.lambda.Function("sendMessageFunction", {
    role: lambdaRole.arn,
    handler: "app.handler",
    runtime: "nodejs14.x",
    code: new pulumi.asset.FileArchive("lambda/sendmessage"),
    environment: {
        variables: {
            CONNECTIONS_TABLE: connectionsTable.name,
            GAMES_TABLE: gamesTable.name
        },
    }
});
export const onDisconnectFunction = new aws.lambda.Function("onDisconnectFunction", {
    role: lambdaRole.arn,
    handler: "app.handler",
    runtime: "nodejs14.x",
    code: new pulumi.asset.FileArchive("lambda/ondisconnect"),
    environment: {
        variables: {
            CONNECTIONS_TABLE: connectionsTable.name,
        },
    }
});
