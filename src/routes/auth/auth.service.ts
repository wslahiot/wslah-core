// src/routes/auth/auth.service.ts
import fp from "fastify-plugin";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { v4 } from "uuid";
import { TBody as LoginBody } from "./schema/loginSchema";
import { TBody as SignupBody } from "./schema/signupSchema";
import { TBody as SignupCompanyBody } from "./schema/signupCompanySchema";

export default fp(async (fastify) => {
  const login = async (data: LoginBody) => {
    const userData = await fastify.mongo.collection("users").findOne({
      phone: data.phone,
    });

    if (!userData) {
      throw new Error("Invalid username or password");
    }

    const match = await bcrypt.compare(data.password, userData.password);

    if (!match) {
      throw new Error("Invalid username or password");
    }

    const token = fastify.jwt.sign({ ...userData }, { expiresIn: "1h" });
    console.log(userData);
    return {
      token,
      userId: userData.id,
      userInfo: {
        name: userData.name,
        email: userData.email,
        id: userData.id,
        companyId: userData.companyId,
      },
    };
  };

  const signup = async (data: SignupBody) => {
    const existingUser = await fastify.mongo
      .collection("users")
      .findOne({ $or: [{ email: data.email }, { phone: data.phone }] });

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = await fastify.mongo.collection("users").insertOne({
      id: v4(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      companyId: data.companyId,
    });

    return { status: "success", userId: userData.insertedId };
  };

  const signupCompany = async (data: SignupCompanyBody) => {
    const existingUser = await fastify.mongo
      .collection("companies")
      .findOne({ email: data.email });

    if (existingUser) {
      throw new Error("A company with this email already exists");
    }

    const id = v4();
    await fastify.mongo.collection("companies").insertOne({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { status: "success", companyId: id };
  };

  const verify = async (token?: string) => {
    if (!token) {
      throw new Error("Invalid token");
    }

    const decoded = await fastify.jwt.decode(token);

    const user = await fastify.mongo.collection("users").findOne({
      //@ts-ignore
      _id: new ObjectId(decoded._id),
    });

    if (!user) {
      throw new Error("unauthorized");
    }

    return "Authorized";
  };

  fastify.decorate("authService", {
    login,
    signup,
    signupCompany,
    verify,
  });
});

declare module "fastify" {
  interface FastifyInstance {
    authService: {
      login: (data: LoginBody) => Promise<any>;
      signup: (data: SignupBody) => Promise<any>;
      signupCompany: (data: SignupCompanyBody) => Promise<any>;
      verify: (token?: string) => Promise<string>;
    };
  }
}
