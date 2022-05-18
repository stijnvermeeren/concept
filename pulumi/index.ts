import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import {apiGateway} from './src/apigateway';
import {onConnectFunction, onDisconnectFunction, sendMessageFunction} from "./src/lambda";
import {input as inputs} from "@pulumi/aws/types";

const regionId = pulumi.output(aws.getRegion()).id;
const accountId = pulumi.output(aws.getCallerIdentity()).accountId;

function integrate(name: string, routeKey: string, lambdaFunction: aws.lambda.Function) {
    const integration = new aws.apigatewayv2.Integration(`${name}Integration`, {
        apiId: apiGateway.id,
        integrationType: "AWS_PROXY",
        integrationUri: lambdaFunction.invokeArn
    })

    const route = new aws.apigatewayv2.Route(`${name}Route`, {
        apiId: apiGateway.id,
        routeKey: routeKey,
        target: pulumi.interpolate `integrations/${integration.id}`
    });

    const functionPermission = new aws.lambda.Permission(`${name}FunctionPermission`, {
        action: "lambda:InvokeFunction",
        function: lambdaFunction.name,
        principal: "apigateway.amazonaws.com",
        sourceArn: pulumi.interpolate`arn:aws:execute-api:${regionId}:${accountId}:${apiGateway.id}/*/${routeKey}`,
    });

    return route;
}

const onConnectRoute = integrate("onConnect", "$connect", onConnectFunction);
const sendMessageRoute = integrate("sendMessage", "sendmessage", sendMessageFunction);
const onDisconnectRoute = integrate("onDisconnect", "$disconnect", onDisconnectFunction);

const apiGatewayDeployment = new aws.apigatewayv2.Deployment("concept", {
    apiId: apiGateway.id
}, {
    dependsOn: [onConnectRoute, sendMessageRoute, onDisconnectRoute]
});

const apiGatewayStage = new aws.apigatewayv2.Stage("concept", {
    apiId: apiGateway.id,
    deploymentId: apiGatewayDeployment.id,
    defaultRouteSettings: {
        throttlingBurstLimit: 50,
        throttlingRateLimit: 100
    }
});

export const websocket_url = apiGatewayStage.invokeUrl;
