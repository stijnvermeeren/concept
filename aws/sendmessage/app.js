// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

const prefix = process.env.PREFIX
const connectionsTable = `${prefix}_connections`
const gamesTable = `${prefix}_games`

exports.handler = async (event, context) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const requestData = JSON.parse(event.body).data

  console.log("Received request", requestData)

  if (requestData.action === 'getGameState') {
    const gameStateResponse = await ddb.getItem({
      TableName: gamesTable,
      Key: { "id": {
          S: "default"
        }},
      ProjectionExpression: 'game_state' }
    ).promise();

    var gameState = {
      id: null,
      concept: []
    }
    if (gameStateResponse.Item) {
      gameState = JSON.parse(gameStateResponse.Item.game_state.S);
    }

    console.log("Game state", gameState);

    const postData = JSON.stringify({
      mutation: 'newMessage',
      data: {
        action: 'newState',
        state: gameState
      }
    });


    try {
      await apigwManagementApi.postToConnection({ ConnectionId: event.requestContext.connectionId, Data: postData }).promise();
    } catch(error) {
      console.log("Error when sending game state", error);
      return { statusCode: 200, body: error };
    }

    return { statusCode: 200, body: 'Data sent.' };
  }


  let connectionData;

  try {
    connectionData = await ddb.scan({ TableName: connectionsTable, ProjectionExpression: 'connectionId' }).promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  await ddb.putItem({
    TableName: gamesTable,
    Item: {
      "id": { S: 'default' },
      "game_state": { S: JSON.stringify(requestData.state) }
    }
  }).promise();

  const postData = JSON.stringify({
    mutation: 'newMessage',
    data: {
      action: 'newState',
      state: requestData.state
    }
  });


  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    connectionId = connectionId.S;
    console.log("connection", connectionId)
    try {
      await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb.delete({ TableName: connectionsTable, Key: { connectionId } }).promise();
      } else {
        throw e;
      }
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (e) {
    console.log("Error", e)
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
