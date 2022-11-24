import * as aws from "@pulumi/aws";

export const connectionsTable = new aws.dynamodb.Table("concept_connections", {
    attributes: [
        {
            name: "id",
            type: "S"
        },
        {
            name: "game_id",
            type: "S"
        }
    ],
    hashKey: "id",
    globalSecondaryIndexes: [
        {
            name: "game_id_index",
            hashKey: "game_id",
            projectionType: "KEYS_ONLY"
        }
    ],
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
