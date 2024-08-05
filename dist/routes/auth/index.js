"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const authPlugin = async (fastify, opts) => {
    fastify.route({
        method: "POST",
        url: "/signup",
        schema: {
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", minLength: 3 },
                    password: { type: "string", minLength: 6 },
                },
            },
        },
        handler: async (request, reply) => {
            const { email, password, name = "", } = request.body;
            const existingUser = await fastify.mongo
                .collection("users")
                .findOne({ email });
            if (existingUser) {
                return reply.send({
                    status: "error",
                    message: "A user with this email already exists",
                });
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const userData = await fastify.mongo.collection("users").insertOne({
                name,
                email,
                password: hashedPassword,
            });
            return reply.send({ status: "success", userId: userData.insertedId });
        },
    });
    fastify.route({
        method: "POST",
        url: "/login",
        schema: {
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", minLength: 3 },
                    password: { type: "string", minLength: 6 },
                },
            },
        },
        handler: async (request, reply) => {
            const { email, password } = request.body;
            const userData = await fastify.mongo
                .collection("users")
                .findOne({ email });
            if (!userData) {
                return reply
                    .code(401)
                    .send({ message: "Invalid username or password" });
            }
            const match = await bcrypt_1.default.compare(password, userData.password);
            if (!match) {
                return reply
                    .code(401)
                    .send({ message: "Invalid username or password" });
            }
            const token = fastify.jwt.sign({ userId: userData._id.toString() });
            return reply.send({
                token,
                userId: userData._id,
                userInfo: {
                    name: userData.name,
                    email: userData.email,
                    _id: userData._id.toString(),
                },
            });
        },
    });
};
exports.default = authPlugin;
//# sourceMappingURL=index.js.map