import fp from "fastify-plugin";
import { MongoClient, Db } from "mongodb";
require("dotenv").config();

export interface TtlockTokenPluginOptions {
  // Specify support plugin options here.
}

const mongoPlugin = fp<TtlockTokenPluginOptions>(async (fastify, opts) => {
  const uri = process.env.DATABASE_URL as string;

  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db("WSLAH_DB");

  // Decorate the Fastify instance with the database object
  fastify.decorate("mongo", database);

  // Ensure the database connection is closed when the Fastify server shuts down
  // fastify.addHook("onClose", async (fastify, done) => {
  //   await client.close();
  //   done();
  // });
});

declare module "fastify" {
  export interface FastifyInstance {
    mongo: Db;
  }
}

export default mongoPlugin;
