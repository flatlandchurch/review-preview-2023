import { Handler, HandlerEvent } from "@netlify/functions";
import knex from "knex";
import knexServerlessMysql from "knex-serverless-mysql";

const mysql = require("serverless-mysql")({
  config: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
});

const db = knex({
  client: knexServerlessMysql,
  // @ts-ignore
  mysql,
});

const handler: Handler = async (event: HandlerEvent) => {
  const currentQuestion = await db("questions")
    .where({ show_question: true })
    .first();

  return {
    statusCode: 200,
    body: JSON.stringify(currentQuestion || {}),
  };
};

export { handler };
