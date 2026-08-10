export class WorkspaceDTO {
  static toResponse(workspace) {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      status: workspace.status,
      description: workspace.description,
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
      owner: {
        id: workspace?.ownerId,
        username: workspace?.owner?.username,
        email: workspace?.owner?.email,
        status: workspace?.owner?.status,
        createdAt: workspace?.owner?.createdAt?.toISOString(),
      },
    };
  }

  static toCollection(workspaces) {
    return workspaces.map((workspace) => WorkspaceDTO.toResponse(workspace));
  }
}
