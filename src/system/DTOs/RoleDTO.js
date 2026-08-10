export class RoleDTO {
  static toResponse(role) {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
    };
  }

  static toCollection(roles) {
    return roles.map((role) => RoleDTO.toResponse(role));
  }
}
