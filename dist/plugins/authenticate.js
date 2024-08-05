"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(jwt_1.default, {
        secret: process.env.SECRET_KEY || "secret",
    });
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply
                .code(401)
                .send({ message: "Authentication failed", error: err.message });
        }
    });
    fastify.decorate("decode", async function (token, reply) {
        try {
            const res = await fastify.jwt.decode(token);
            reply.send(res);
        }
        catch (err) {
            console.log(err);
            reply
                .code(500)
                .send({ message: "Failed to decode token", error: err.message });
        }
    });
});
//# sourceMappingURL=authenticate.js.map