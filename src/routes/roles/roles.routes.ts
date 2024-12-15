import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  createActionSchema,
  updateActionSchema,
  createRoleSchema,
  updateRoleSchema,
  createGroupSchema,
  updateGroupSchema,
  assignUserRolesSchema,
  getActionSchema,
  getRolesSchema,
  getUserPermissionsSchema,
  deleteActionSchema,
  getActionsSchema,
  deleteRoleSchema,
  getGroupsSchema,
  getGroupByIdSchema,
} from "./schema/validation";

const roles: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  // Action Routes
  fastify.route({
    method: "POST",
    url: "/actions",
    schema: createActionSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { body } = request;
      return await fastify.rolesService.createAction(body);
    },
  });

  fastify.route({
    method: "PUT",
    url: "/actions/:id",
    schema: updateActionSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const { body } = request;
      return await fastify.rolesService.updateAction(id, body);
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/actions/:id",
    schema: deleteActionSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      return await fastify.rolesService.deleteAction(id);
    },
  });

  fastify.route({
    method: "GET",
    url: "/actions",
    schema: getActionsSchema,
    preHandler: [fastify.authenticate],
    handler: async () => {
      return await fastify.rolesService.getActions();
    },
  });

  fastify.route({
    method: "GET",
    url: "/actions/:id",
    schema: getActionSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      return await fastify.rolesService.getActionById(id);
    },
  });

  // Role Routes
  fastify.route({
    method: "POST",
    url: "/roles",
    schema: createRoleSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.createRole(decoded, body);
    },
  });

  fastify.route({
    method: "PUT",
    url: "/roles/:id",
    schema: updateRoleSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.updateRole(decoded, id, body);
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/roles/:id",
    schema: deleteRoleSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.deleteRole(decoded, id);
    },
  });

  fastify.route({
    method: "GET",
    url: "/roles",
    schema: getRolesSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.getRoles(decoded);
    },
  });

  // Group Routes
  fastify.route({
    method: "POST",
    url: "/groups",
    schema: createGroupSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.createGroup(decoded, body);
    },
  });

  fastify.route({
    method: "PUT",
    url: "/groups/:id",
    schema: updateGroupSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const { body } = request;
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.updateGroup(decoded, id, body);
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/groups/:id",
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.deleteGroup(decoded, id);
    },
  });

  fastify.route({
    method: "GET",
    url: "/groups",
    schema: getGroupsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.getGroups(decoded);
    },
  });

  fastify.route({
    method: "GET",
    url: "/groups/:id",
    schema: getGroupByIdSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { id } = request.params as { id: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.getGroupById(decoded, id);
    },
  });

  // User Assignment Routes
  fastify.route({
    method: "POST",
    url: "/users/:userId/roles",
    schema: assignUserRolesSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { userId } = request.params as { userId: string };
      const { roleIds } = request.body as { roleIds: string[] };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.assignRolesToUser(
        decoded,
        userId,
        roleIds
      );
    },
  });

  fastify.route({
    method: "GET",
    url: "/users/:userId/permissions",
    schema: getUserPermissionsSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: any) => {
      const { userId } = request.params as { userId: string };
      const decoded = fastify.decode(request.headers.authorization);
      return await fastify.rolesService.getUserPermissions(decoded, userId);
    },
  });
};

export default roles;
