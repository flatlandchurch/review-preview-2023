import { Handler, HandlerEvent } from "@netlify/functions";
import { v4 as uuid } from "uuid";

const handler: Handler = async (event: HandlerEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ user_id: uuid() }),
  };
};

export { handler };
