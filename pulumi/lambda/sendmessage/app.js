// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

const connectionsTable = process.env.CONNECTIONS_TABLE
const gamesTable = process.env.GAMES_TABLE

exports.handler = async (event, context) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const requestData = JSON.parse(event.body).data

  console.log("Received request", requestData)

  if (requestData.action === 'connectToGame') {
    const gameStateResponse = await ddb.getItem({
      TableName: gamesTable,
      Key: { "id": {
          S: requestData.gameId
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

    await ddb.putItem({
      TableName: connectionsTable,
      Item: {
        "id": { S: event.requestContext.connectionId },
        "game_id": { S: requestData.gameId }
      }
    }).promise();

    try {
      await apigwManagementApi.postToConnection({ ConnectionId: event.requestContext.connectionId, Data: postData }).promise();
    } catch(error) {
      console.log("Error when sending game state", error);
      return { statusCode: 200, body: error };
    }

    return { statusCode: 200, body: 'Data sent.' };
  }

  await ddb.putItem({
    TableName: gamesTable,
    Item: {
      "id": { S: requestData.gameId },
      "game_state": { S: JSON.stringify(requestData.state) }
    }
  }).promise();

  let connectionData
  try {
    connectionData = await ddb.query({
      ExpressionAttributeValues: {
        ':game_id' : {S: requestData.gameId}
      },
      KeyConditionExpression: 'game_id = :game_id',
      TableName: connectionsTable,
      IndexName: "game_id_index"
    }).promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const postData = JSON.stringify({
    mutation: 'newMessage',
    data: {
      action: 'newState',
      state: requestData.state
    }
  });

  const postCalls = connectionData.Items.map(async ({ id }) => {
    const connectionId = id.S;
    console.log(`Sending new game data to connection ${connectionId}`)
    try {
      return await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        return await ddb.deleteItem({
          TableName: connectionsTable,
          Key: { "id" : { S: connectionId } }
        }).promise();
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
