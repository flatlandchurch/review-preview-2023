import { Handler, HandlerEvent } from "@netlify/functions";
import knex from "knex";
import knexServerlessMysql from "knex-serverless-mysql";

const db = knex({
  client: knexServerlessMysql,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const handler: Handler = async (event: HandlerEvent) => {
  const { id, value, user_id } = JSON.parse(event.body);

  await db("votes").insert({
    question_id: id,
    value,
    user_id,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Vote added" }),
  };
};

export { handler };
