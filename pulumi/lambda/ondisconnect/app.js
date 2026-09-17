// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const ddb = new DynamoDBClient({});

const connectionsTable = process.env.CONNECTIONS_TABLE

exports.handler = async function (event, context, callback) {
  try {
    await ddb.send(new DeleteItemCommand({
      TableName: connectionsTable,
      Key: { id: { S: event.requestContext.connectionId } }
    }));
  } catch (e) {
    console.log("Error while disconnecting.", e)
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
