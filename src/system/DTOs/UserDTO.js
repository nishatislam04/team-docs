export class UserDTO {
  static toResponse(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      isWorkspaceOwner: user.isWorkspaceOwner,
      createdAt: user?.createdAt?.toISOString(),
      updatedAt: user?.updatedAt?.toISOString(),
    };
  }

  static toCollection(users) {
    return users.map((user) => UserDTO.toResponse(user));
  }
}
