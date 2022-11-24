// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

const connectionsTable = process.env.CONNECTIONS_TABLE

exports.handler = async function (event, context, callback) {
  const deleteParams = {
    TableName: connectionsTable,
    Key: {
      id: { S: event.requestContext.connectionId }
    }
  };

  try {
    await DDB.deleteItem(deleteParams).promise();
  } catch (e) {
    console.log("Error while disconnecting.", e)
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
