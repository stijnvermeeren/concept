import * as aws from "@pulumi/aws";

export const apiGateway = new aws.apigatewayv2.Api("concept", {
    protocolType: "WEBSOCKET",
    routeSelectionExpression: "$request.body.message"
});
