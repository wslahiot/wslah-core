import fp from "fastify-plugin";
import { v4 } from "uuid";
import {
  Action,
  Role,
  Group,
  UserRoles,
  TCreateActionDto,
  TUpdateActionDto,
  TCreateRoleDto,
  TUpdateRoleDto,
  TCreateGroupDto,
  TUpdateGroupDto,
} from "./schema/types";
import { decodeType } from "../../plugins/authenticate";

// import {
//   TResponse as GetCustomerSchema,
//   TParams as GetCustomerByIdSchema,
// } from "./schema/getCustomerInfoSchema";
// import {
//   TResponse as createCustomerType,
//   TBody as BodySchema,
// } from "./schema/createCustomerSchema";
// interface customerServiceType {
//   getCustomers: () => Promise<GetCustomerSchema | null>;
//   getCustomersById: (
//     id: GetCustomerByIdSchema
//   ) => Promise<GetCustomerSchema | null>;
//   createCustomer: (user: BodySchema) => Promise<createCustomerType | null>;
// }

// Ensure fastify is correctly typed
import { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
  // Helper Functions
  const getCurrentTimestamp = () => new Date().toISOString();

  const validateCompanyAccess = async (
    companyId: string,
    itemId: string,
    collection: string
  ) => {
    const item = await fastify.mongo
      .collection(collection)
      .findOne({ id: itemId });
    if (!item) throw new Error("Item not found");
    if (item.companyId !== companyId) throw new Error("Unauthorized access");
    return item;
  };

  // const getCustomers = async () => {
  //   const result = await fastify.mongo.collection("customers").find().toArray();

  //   return result;
  // };

  // const getCustomersById = async (id: string) => {
  //   const result = await fastify.mongo
  //     .collection("customers")
  //     .find({
  //       idNumber: id,
  //     })
  //     .toArray();

  //   return result;
  // };

  // const createCustomer = async (customer: BodySchema) => {
  //   //check if customer already exists
  //   const existingUser = await fastify.mongo.collection("customers").findOne({
  //     idNumber: customer.idNumber,
  //   });
  //   if (existingUser) {
  //     return { message: "Customer already exists" };
  //   }

  //   const result = await fastify.mongo.collection("customers").insertOne({
  //     ...customer,
  //     updatedAt: new Date().toISOString(),
  //     createdAt: new Date().toISOString(),
  //   });

  //   return result;
  // };

  // Action Methods
  const createAction = async (data: TCreateActionDto) => {
    const payload: Action = {
      id: v4(),
      ...data,
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    try {
      // Check if action code already exists
      const existing = await fastify.mongo
        .collection("actions")
        .findOne({ code: data.code });
      if (existing) throw new Error("Action code already exists");

      await fastify.mongo.collection("actions").insertOne(payload);
      return { status: "success", message: "Action created successfully" };
    } catch (error: any) {
      console.error("Failed to create action:", error);
      throw new Error(`Failed to create action: ${error.message}`);
    }
  };

  const updateAction = async (id: string, data: TUpdateActionDto) => {
    try {
      const payload = {
        $set: {
          ...data,
          updatedAt: getCurrentTimestamp(),
        },
      };

      const result = await fastify.mongo
        .collection("actions")
        .updateOne({ id, isActive: true }, payload);

      if (result.matchedCount === 0) throw new Error("Action not found");
      return { status: "success", message: "Action updated successfully" };
    } catch (error: any) {
      console.error("Failed to update action:", error);
      throw new Error(`Failed to update action: ${error.message}`);
    }
  };

  const deleteAction = async (id: string) => {
    try {
      const result = await fastify.mongo
        .collection("actions")
        .updateOne(
          { id },
          { $set: { isActive: false, updatedAt: getCurrentTimestamp() } }
        );

      if (result.matchedCount === 0) throw new Error("Action not found");
      return { status: "success", message: "Action deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete action:", error);
      throw new Error(`Failed to delete action: ${error.message}`);
    }
  };

  const getActions = async () => {
    try {
      return await fastify.mongo
        .collection("actions")
        .find({ isActive: true })
        .toArray();
    } catch (error: any) {
      console.error("Failed to get actions:", error);
      throw new Error(`Failed to get actions: ${error.message}`);
    }
  };

  const getActionById = async (id: string) => {
    try {
      const action = await fastify.mongo
        .collection("actions")
        .findOne({ id, isActive: true });
      if (!action) throw new Error("Action not found");
      return action;
    } catch (error: any) {
      console.error("Failed to get action:", error);
      throw new Error(`Failed to get action: ${error.message}`);
    }
  };

  // Role Methods
  const createRole = async (userInfo: decodeType, data: TCreateRoleDto) => {
    const payload: Role = {
      id: v4(),
      ...data,
      companyId: userInfo.companyId,
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    try {
      // Validate that all actions exist
      const actions = await fastify.mongo
        .collection("actions")
        .find({ id: { $in: data.actions }, isActive: true })
        .toArray();

      if (actions.length !== data.actions.length) {
        throw new Error("One or more actions do not exist");
      }

      await fastify.mongo.collection("roles").insertOne(payload);
      return { status: "success", message: "Role created successfully" };
    } catch (error: any) {
      console.error("Failed to create role:", error);
      throw new Error(`Failed to create role: ${error.message}`);
    }
  };

  const updateRole = async (
    userInfo: decodeType,
    id: string,
    data: TUpdateRoleDto
  ) => {
    try {
      await validateCompanyAccess(userInfo.companyId, id, "roles");

      if (data.actions) {
        const actions = await fastify.mongo
          .collection("actions")
          .find({ id: { $in: data.actions }, isActive: true })
          .toArray();

        if (actions.length !== data.actions.length) {
          throw new Error("One or more actions do not exist");
        }
      }

      const payload = {
        $set: {
          ...data,
          updatedAt: getCurrentTimestamp(),
        },
      };

      const result = await fastify.mongo
        .collection("roles")
        .updateOne({ id, isActive: true }, payload);

      if (result.matchedCount === 0) throw new Error("Role not found");
      return { status: "success", message: "Role updated successfully" };
    } catch (error: any) {
      console.error("Failed to update role:", error);
      throw new Error(`Failed to update role: ${error.message}`);
    }
  };

  const deleteRole = async (userInfo: decodeType, id: string) => {
    try {
      await validateCompanyAccess(userInfo.companyId, id, "roles");

      const result = await fastify.mongo
        .collection("roles")
        .updateOne(
          { id },
          { $set: { isActive: false, updatedAt: getCurrentTimestamp() } }
        );

      if (result.matchedCount === 0) throw new Error("Role not found");
      return { status: "success", message: "Role deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete role:", error);
      throw new Error(`Failed to delete role: ${error.message}`);
    }
  };

  const getRoles = async (userInfo: decodeType) => {
    try {
      return await fastify.mongo
        .collection("roles")
        .find({ companyId: userInfo.companyId })
        .toArray();
    } catch (error: any) {
      console.error("Failed to get roles:", error);
      throw new Error(`Failed to get roles: ${error.message}`);
    }
  };

  // Group Methods
  const createGroup = async (userInfo: decodeType, data: TCreateGroupDto) => {
    const payload: Group = {
      id: v4(),
      ...data,
      companyId: userInfo.companyId,
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    try {
      // Validate that all roles exist and belong to the company
      const roles = await fastify.mongo
        .collection("roles")
        .find({
          id: { $in: data.roles },
          companyId: userInfo.companyId,
          isActive: true,
        })
        .toArray();

      if (roles.length !== data.roles.length) {
        throw new Error(
          "One or more roles do not exist or do not belong to your company"
        );
      }

      await fastify.mongo.collection("groups").insertOne(payload);
      return { status: "success", message: "Group created successfully" };
    } catch (error: any) {
      console.error("Failed to create group:", error);
      throw new Error(`Failed to create group: ${error.message}`);
    }
  };

  const updateGroup = async (
    userInfo: decodeType,
    id: string,
    data: TUpdateGroupDto
  ) => {
    try {
      await validateCompanyAccess(userInfo.companyId, id, "groups");

      if (data.roles) {
        const roles = await fastify.mongo
          .collection("roles")
          .find({
            id: { $in: data.roles },
            companyId: userInfo.companyId,
            isActive: true,
          })
          .toArray();

        if (roles.length !== data.roles.length) {
          throw new Error(
            "One or more roles do not exist or do not belong to your company"
          );
        }
      }

      const payload = {
        $set: {
          ...data,
          updatedAt: getCurrentTimestamp(),
        },
      };

      const result = await fastify.mongo
        .collection("groups")
        .updateOne({ id, isActive: true }, payload);

      if (result.matchedCount === 0) throw new Error("Group not found");
      return { status: "success", message: "Group updated successfully" };
    } catch (error: any) {
      console.error("Failed to update group:", error);
      throw new Error(`Failed to update group: ${error.message}`);
    }
  };

  const deleteGroup = async (userInfo: decodeType, id: string) => {
    try {
      await validateCompanyAccess(userInfo.companyId, id, "groups");

      // Soft delete the group
      const result = await fastify.mongo
        .collection("groups")
        .updateOne(
          { id },
          { $set: { isActive: false, updatedAt: getCurrentTimestamp() } }
        );

      if (result.matchedCount === 0) throw new Error("Group not found");

      // Remove group from all user assignments
      await fastify.mongo.collection("userRoles");
      // .updateMany({ groupIds: id }, { $pull: { groupIds: { $eq: id } } });

      return { status: "success", message: "Group deleted successfully" };
    } catch (error: any) {
      console.error("Failed to delete group:", error);
      throw new Error(`Failed to delete group: ${error.message}`);
    }
  };

  const getGroups = async (userInfo: decodeType) => {
    try {
      return await fastify.mongo
        .collection("groups")
        .find({ companyId: userInfo.companyId, isActive: true })
        .toArray();
    } catch (error: any) {
      console.error("Failed to get groups:", error);
      throw new Error(`Failed to get groups: ${error.message}`);
    }
  };

  const getGroupById = async (userInfo: decodeType, id: string) => {
    try {
      const group = await fastify.mongo
        .collection("groups")
        .findOne({ id, companyId: userInfo.companyId, isActive: true });
      if (!group) throw new Error("Group not found");
      return group;
    } catch (error: any) {
      console.error("Failed to get group:", error);
      throw new Error(`Failed to get group: ${error.message}`);
    }
  };

  // User Assignment Methods
  const assignRolesToUser = async (
    userInfo: decodeType,
    userId: string,
    roleIds: string[]
  ) => {
    try {
      // Verify roles belong to the company
      const roles = await fastify.mongo
        .collection("roles")
        .find({
          id: { $in: roleIds },
          companyId: userInfo.companyId,
          isActive: true,
        })
        .toArray();

      if (roles.length !== roleIds.length) {
        throw new Error("Invalid role IDs or roles from different company");
      }

      // Get or create user roles document
      const userRolesDoc = await fastify.mongo
        .collection("userRoles")
        .findOne({ userId, companyId: userInfo.companyId });

      if (userRolesDoc) {
        await fastify.mongo.collection("userRoles").updateOne(
          { userId },
          {
            $set: {
              roleIds,
              updatedAt: getCurrentTimestamp(),
            },
          }
        );
      } else {
        const newUserRoles: UserRoles = {
          id: v4(),
          userId,
          roleIds,
          groupIds: [],
          companyId: userInfo.companyId,
          isActive: true,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        await fastify.mongo.collection("userRoles").insertOne(newUserRoles);
      }

      return { status: "success", message: "Roles assigned successfully" };
    } catch (error: any) {
      console.error("Failed to assign roles:", error);
      throw new Error(`Failed to assign roles: ${error.message}`);
    }
  };

  const getUserPermissions = async (userInfo: decodeType, userId: string) => {
    try {
      const userRoles = await fastify.mongo.collection("userRoles").findOne({
        userId,
        companyId: userInfo.companyId,
        isActive: true,
      });

      if (!userRoles) {
        return { roles: [], groups: [], actions: [] };
      }

      // Get direct roles
      const directRoles = await fastify.mongo
        .collection("roles")
        .find({
          id: { $in: userRoles.roleIds || [] },
          isActive: true,
        })
        .toArray();

      // Get groups and their roles
      const groups = await fastify.mongo
        .collection("groups")
        .find({
          id: { $in: userRoles.groupIds || [] },
          isActive: true,
        })
        .toArray();

      const groupRoleIds = groups.flatMap((group) => group.roles);
      const groupRoles = await fastify.mongo
        .collection("roles")
        .find({
          id: { $in: groupRoleIds },
          isActive: true,
        })
        .toArray();

      // Combine all roles and get unique actions
      const allRoles = [...directRoles, ...groupRoles];
      const actionIds = [...new Set(allRoles.flatMap((role) => role.actions))];

      const actions = await fastify.mongo
        .collection("actions")
        .find({
          id: { $in: actionIds },
          isActive: true,
        })
        .toArray();

      return {
        roles: directRoles.map((role) => ({ id: role.id, name: role.name })),
        groups: groups.map((group) => ({ id: group.id, name: group.name })),
        actions: actions.map((action) => ({
          code: action.code,
          name: action.name,
          module: action.module,
        })),
      };
    } catch (error: any) {
      console.error("Failed to get user permissions:", error);
      throw new Error(`Failed to get user permissions: ${error.message}`);
    }
  };

  // Decorate fastify instance
  fastify.decorate("rolesService", {
    createAction,
    updateAction,
    deleteAction,
    getActions,
    getActionById,
    createRole,
    updateRole,
    deleteRole,
    getRoles,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroups,
    getGroupById,
    assignRolesToUser,
    getUserPermissions,
  } as any);
});
// Type declarations
declare module "fastify" {
  interface FastifyInstance {
    rolesService: {
      createAction: (data: TCreateActionDto) => Promise<any | null>;
      updateAction: (id: string, data: TUpdateActionDto) => Promise<any | null>;
      deleteAction: (id: string) => Promise<any | null>;
      getActions: () => Promise<Action[]>;
      getActionById: (id: string) => Promise<Action>;
      createRole: (
        userInfo: decodeType,
        data: TCreateRoleDto
      ) => Promise<any | null>;
      updateRole: (
        userInfo: decodeType,
        id: string,
        data: TUpdateRoleDto
      ) => Promise<any | null>;
      deleteRole: (userInfo: decodeType, id: string) => Promise<any | null>;
      getRoles: (userInfo: decodeType) => Promise<Role[]>;
      createGroup: (
        userInfo: decodeType,
        data: TCreateGroupDto
      ) => Promise<any | null>;
      updateGroup: (
        userInfo: decodeType,
        id: string,
        data: TUpdateGroupDto
      ) => Promise<any | null>;
      deleteGroup: (userInfo: decodeType, id: string) => Promise<any | null>;
      getGroups: (userInfo: decodeType) => Promise<Group[]>;
      getGroupById: (userInfo: decodeType, id: string) => Promise<Group>;
      assignRolesToUser: (
        userInfo: decodeType,
        userId: string,
        roleIds: string[]
      ) => Promise<any | null>;
      getUserPermissions: (
        userInfo: decodeType,
        userId: string
      ) => Promise<{
        roles: Array<any | null>;
        groups: Array<any | null>;
        actions: Array<any | null>;
      }>;
    };
  }
}
