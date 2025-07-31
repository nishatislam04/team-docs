export class PermissionDTO {
  static toResponse(permission) {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      scope: permission.scope,
      action: permission.action,
      resource: permission.resource,
      status: permission.status,
      workspaceId: permission.workspaceId,
    };
  }

  static toCollection(permissions) {
    return permissions.map((permission) => this.toResponse(permission));
  }
}
