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
  const { direction } = JSON.parse(event.body);

  const currentQuestion = await db("questions")
    .where({ show_question: true })
    .first();

  const allQuestions = await db("questions").select("*");
  const nextOrder =
    (currentQuestion.order + (direction === "next" ? 1 : -1)) %
    allQuestions.length;

  await db("questions").update({ show_question: false });
  await db("questions")
    .update({ show_question: true })
    .where({
      order: nextOrder === 0 ? allQuestions.length : nextOrder,
    });

  return {
    statusCode: 200,
    body: JSON.stringify({ progressed: true }),
  };
};

export { handler };
