"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const redis_1 = __importDefault(require("@fastify/redis"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    if (process.env.REDIS_ENABLED === "true") {
        fastify.register(redis_1.default, {
            host: process.env.REDIS_HOST || "127.0.0.1",
            username: process.env.REDIS_USERNAME || "",
            password: process.env.REDIS_PASSWORD || "",
            port: parseInt(process.env.REDIS_PORT || "") || 6379,
            family: 4,
        });
    }
});
//# sourceMappingURL=redis.js.map