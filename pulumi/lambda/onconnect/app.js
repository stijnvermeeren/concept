// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

var AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
var ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

const connectionsTable = process.env.CONNECTIONS_TABLE

exports.handler = async function (event, context) {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const connectionId = event.requestContext.connectionId;

  var putParams = {
    TableName: connectionsTable,
    Item: {
      connectionId: { S: connectionId }
    }
  };

  try {
    await ddb.putItem(putParams).promise();

    return {
      statusCode: 200,
      body: "Connected."
    }
  } catch (err) {
    console.log("Error when connecting", err);
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err)
    }
  }

  /*
  const gameState = await ddb.getItem({
    TableName: gamesTable,
    Key: { "id": {
      S: "default"
    }},
    ProjectionExpression: 'game_state' }
  ).promise();

  const postData = JSON.stringify({
    mutation: 'newMessage',
    data: gameState
  });

  await apigwManagementApi.postToConnection({ ConnectionId: event.requestContext.connectionId, Data: postData }).promise();
  */
};
