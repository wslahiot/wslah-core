"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const mongodb_1 = require("mongodb");
require("dotenv").config();
const mongoPlugin = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    const uri = process.env.DATABASE_URL;
    const client = new mongodb_1.MongoClient(uri);
    await client.connect();
    const database = client.db("openAGI");
    fastify.decorate("mongo", database);
});
exports.default = mongoPlugin;
//# sourceMappingURL=mongo.js.map