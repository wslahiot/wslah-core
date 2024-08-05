import { FastifyPluginAsync } from "fastify";
import bcrypt from "bcrypt";

interface UserTemplate {
  email: string;
  password: string;
  name?: string;
}

interface SignupRequest {
  Body: UserTemplate;
}

interface LoginRequest {
  Body: UserTemplate;
}

const authPlugin: FastifyPluginAsync = async (fastify, opts) => {
  //   fastify.register(require("@fastify/jwt"), {
  //     secret: process.env.SECRET_KEY || "secret",
  //   });

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
      const {
        email,
        password,
        name = "",
      } = request.body as SignupRequest["Body"];

      // Check if a user with the same email already exists
      const existingUser = await fastify.mongo
        .collection("users")
        .findOne({ email });

      if (existingUser) {
        return reply.send({
          status: "error",
          message: "A user with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

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
      const { email, password } = request.body as LoginRequest["Body"];

      const userData = await fastify.mongo
        .collection("users")
        .findOne({ email });

      if (!userData) {
        return reply
          .code(401)
          .send({ message: "Invalid username or password" });
      }

      const match = await bcrypt.compare(password, userData.password);

      if (!match) {
        return reply
          .code(401)
          .send({ message: "Invalid username or password" });
      }

      const token = fastify.jwt.sign(
        { userId: userData._id.toString() }
        // { expiresIn: "1h" }
      );

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

export default authPlugin;
