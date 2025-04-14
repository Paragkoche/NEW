import app from "./app";
import env from "./utility/env";
import logger from "./utility/logger";
import db from "./db";
const Port = env.PORT!;
app.listen(Port, async () => {
  console.clear();
  logger.info("connecting to db...");

  await db.$connect();
  logger.info("db connected..");
  logger.info("server start");
});
