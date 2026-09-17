// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("@aws-sdk/client-apigatewaymanagementapi");

const ddb = new DynamoDBClient({});

const connectionsTable = process.env.CONNECTIONS_TABLE
const gamesTable = process.env.GAMES_TABLE

exports.handler = async (event, context) => {
  const apigw = new ApiGatewayManagementApiClient({
    endpoint: 'https://' + event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const requestData = JSON.parse(event.body).data

  console.log("Received request", requestData)

  if (requestData.action === 'connectToGame') {
    const gameStateResponse = await ddb.send(new GetItemCommand({
      TableName: gamesTable,
      Key: { "id": { S: requestData.gameId }},
      ProjectionExpression: 'game_state'
    }));

    let gameState = { id: null, concept: [] }
    if (gameStateResponse.Item) {
      gameState = JSON.parse(gameStateResponse.Item.game_state.S);
    }

    console.log("Game state", gameState);

    const postData = JSON.stringify({
      mutation: 'newMessage',
      data: { action: 'newState', state: gameState }
    });

    await ddb.send(new PutItemCommand({
      TableName: connectionsTable,
      Item: {
        "id": { S: event.requestContext.connectionId },
        "game_id": { S: requestData.gameId }
      }
    }));

    try {
      await apigw.send(new PostToConnectionCommand({ ConnectionId: event.requestContext.connectionId, Data: postData }));
    } catch(error) {
      console.log(`Error when sending game state to connection ${event.requestContext.connectionId}`, error);
      return { statusCode: 500, body: error };
    }

    return { statusCode: 200, body: 'Data sent.' };
  }

  await ddb.send(new PutItemCommand({
    TableName: gamesTable,
    Item: {
      "id": { S: requestData.gameId },
      "game_state": { S: JSON.stringify(requestData.state) }
    }
  }));

  let connectionData
  try {
    connectionData = await ddb.send(new QueryCommand({
      ExpressionAttributeValues: { ':game_id': { S: requestData.gameId } },
      KeyConditionExpression: 'game_id = :game_id',
      TableName: connectionsTable,
      IndexName: "game_id_index",
      ProjectionExpression: "id"
    }));
  } catch (e) {
    console.log(`Error finding connections for game ${requestData.gameId}`, e)
    return { statusCode: 500, body: e.stack };
  }

  const postData = JSON.stringify({
    mutation: 'newMessage',
    data: { action: 'newState', state: requestData.state }
  });

  const postCalls = connectionData.Items.map(async ({ id }) => {
    const connectionId = id.S;
    console.log(`Sending new game data to connection ${connectionId}`)
    try {
      return await apigw.send(new PostToConnectionCommand({ ConnectionId: connectionId, Data: postData }));
    } catch (e) {
      if (e.$metadata?.httpStatusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        return await ddb.send(new DeleteItemCommand({
          TableName: connectionsTable,
          Key: { "id": { S: connectionId } }
        }));
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
