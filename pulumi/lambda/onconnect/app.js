// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

var AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });

exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: "Connected."
  }
};
