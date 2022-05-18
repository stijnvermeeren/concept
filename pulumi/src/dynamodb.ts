import * as aws from "@pulumi/aws";

export const connectionsTable = new aws.dynamodb.Table("concept_connections", {
    attributes: [
        {
            name: "connectionId",
            type: "S"
        }
    ],
    hashKey: "connectionId",
    billingMode: "PAY_PER_REQUEST"
});

export const gamesTable = new aws.dynamodb.Table("concept_games", {
    attributes: [
        {
            name: "id",
            type: "S"
        }
    ],
    hashKey: "id",
    billingMode: "PAY_PER_REQUEST"
});
