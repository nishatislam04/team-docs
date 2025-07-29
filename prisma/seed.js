import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding process...");

  // Create nishat user
  const nishat = await prisma.user.create({
    data: {
      username: "nishat",
      email: "nishatislam3108@gmail.com",
      password: "$2b$10$NFBfr4vxrvrJ3BI7.Bqdge55rOXWwl6lYCaeUGKzEtfNB9MxaT8BO",
      status: "ACTIVE",
      isSuperAdmin: true,
      isWorkspaceOwner: true,
    },
  });
  console.log("✅ Created nishat user");

  // Create workspace for Admin
  const workspace = await prisma.workspace.create({
    data: {
      name: "Admin Workspace",
      slug: "admin-workspace",
      description: "A demo workspace for testing",
      ownerId: nishat.id,
      status: "ACTIVE",
    },
  });
  console.log("✅ Created workspace");

  // assign workspace to admin user
  await prisma.user.update({
    where: {
      id: nishat.id,
    },
    data: {
      workspaceId: workspace.id,
    },
  });

  // Create two projects
  await Promise.all([
    prisma.project.create({
      data: {
        name: "Admin Project1",
        slug: "admin-project-1",
        description: "Admin project 1",
        workspaceId: workspace.id,
        ownerId: nishat.id,
        status: "ACTIVE",
      },
    }),
    prisma.project.create({
      data: {
        name: "Admin Project2",
        slug: "admin-project-2",
        description: "Admin project 2",
        workspaceId: workspace.id,
        ownerId: nishat.id,
        status: "ACTIVE",
      },
    }),
  ]);

  console.log("✅ Created projects");

  // // create system permissions for assigning to workspace
  // const workspacePermissions = [
  //   {
  //     name: "create workspace",
  //     description: "Create a workspace",
  //     scope: "SYSTEM",
  //     resource: "WORKSPACE",
  //     action: "CREATE",
  //   },
  //   {
  //     name: "read workspace",
  //     description: "Read a workspace",
  //     scope: "SYSTEM",
  //     resource: "WORKSPACE",
  //     action: "READ",
  //   },
  //   {
  //     name: "update workspace",
  //     description: "Update a workspace",
  //     scope: "SYSTEM",
  //     resource: "WORKSPACE",
  //     action: "UPDATE",
  //   },
  //   {
  //     name: "delete workspace",
  //     description: "Delete a workspace",
  //     scope: "SYSTEM",
  //     resource: "WORKSPACE",
  //     action: "DELETE",
  //   },
  //   {
  //     name: "create project",
  //     description: "Create a project",
  //     scope: "SYSTEM",
  //     resource: "PROJECT",
  //     action: "CREATE",
  //   },
  //   {
  //     name: "read project",
  //     description: "Read a project",
  //     scope: "SYSTEM",
  //     resource: "PROJECT",
  //     action: "READ",
  //   },
  //   {
  //     name: "update project",
  //     description: "Update a project",
  //     scope: "SYSTEM",
  //     resource: "PROJECT",
  //     action: "UPDATE",
  //   },
  //   {
  //     name: "delete project",
  //     description: "Delete a project",
  //     scope: "SYSTEM",
  //     resource: "PROJECT",
  //     action: "DELETE",
  //   },
  //   {
  //     name: "create section",
  //     description: "Create a section",
  //     scope: "SYSTEM",
  //     resource: "SECTION",
  //     action: "CREATE",
  //   },
  //   {
  //     name: "read section",
  //     description: "Read a section",
  //     scope: "SYSTEM",
  //     resource: "SECTION",
  //     action: "READ",
  //   },
  //   {
  //     name: "update section",
  //     description: "Update a section",
  //     scope: "SYSTEM",
  //     resource: "SECTION",
  //     action: "UPDATE",
  //   },
  //   {
  //     name: "delete section",
  //     description: "Delete a section",
  //     scope: "SYSTEM",
  //     resource: "SECTION",
  //     action: "DELETE",
  //   },
  //   {
  //     name: "create page",
  //     description: "Create a page",
  //     scope: "SYSTEM",
  //     resource: "PAGE",
  //     action: "CREATE",
  //   },
  //   {
  //     name: "read page",
  //     description: "Read a page",
  //     scope: "SYSTEM",
  //     resource: "PAGE",
  //     action: "READ",
  //   },
  //   {
  //     name: "update page",
  //     description: "Update a page",
  //     scope: "SYSTEM",
  //     resource: "PAGE",
  //     action: "UPDATE",
  //   },
  //   {
  //     name: "delete page",
  //     description: "Delete a page",
  //     scope: "SYSTEM",
  //     resource: "PAGE",
  //     action: "DELETE",
  //   },
  //   {
  //     name: "create user",
  //     description: "Create a user",
  //     scope: "SYSTEM",
  //     resource: "USER",
  //     action: "CREATE",
  //   },
  //   {
  //     name: "read user",
  //     description: "Read a user",
  //     scope: "SYSTEM",
  //     resource: "USER",
  //     action: "READ",
  //   },
  //   {
  //     name: "update user",
  //     description: "Update a user",
  //     scope: "SYSTEM",
  //     resource: "USER",
  //     action: "UPDATE",
  //   },
  //   {
  //     name: "delete user",
  //     description: "Delete a user",
  //     scope: "SYSTEM",
  //     resource: "USER",
  //     action: "DELETE",
  //   },
  //   {
  //     name: "create role",
  //     description: "Create a role",
  //     scope: "SYSTEM",
  //     resource: "ROLE",
  //     action: "CREATE",
  //   },
  //   {
  //     name: "read role",
  //     description: "Read a role",
  //     scope: "SYSTEM",
  //     resource: "ROLE",
  //     action: "READ",
  //   },
  //   {
  //     name: "update role",
  //     description: "Update a role",
  //     scope: "SYSTEM",
  //     resource: "ROLE",
  //     action: "UPDATE",
  //   },
  //   {
  //     name: "delete role",
  //     description: "Delete a role",
  //     scope: "SYSTEM",
  //     resource: "ROLE",
  //     action: "DELETE",
  //   },
  //   {
  //     name: "create permission",
  //     description: "Create a permission",
  //     scope: "SYSTEM",
  //     resource: "PERMISSION",
  //     action: "CREATE",
  //   },
  //   {
  //     name: "read permission",
  //     description: "Read a permission",
  //     scope: "SYSTEM",
  //     resource: "PERMISSION",
  //     action: "READ",
  //   },
  //   {
  //     name: "update permission",
  //     description: "Update a permission",
  //     scope: "SYSTEM",
  //     resource: "PERMISSION",
  //     action: "UPDATE",
  //   },
  //   {
  //     name: "delete permission",
  //     description: "Delete a permission",
  //     scope: "SYSTEM",
  //     resource: "PERMISSION",
  //     action: "DELETE",
  //   },
  // ];

  // await prisma.permission.createMany({
  //   data: workspacePermissions,
  //   skipDuplicates: true,
  // });

  // console.log("✅ Created system permissions for workspace");

  // Create project-scoped permissions
  const projectPermissions = [
    {
      name: "create page",
      description: "Create a page",
      status: "ACTIVE",
      scope: "WORKSPACE",
      resource: "PAGE",
      action: "CREATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "read page",
      description: "Read a page",
      status: "ACTIVE",
      scope: "WORKSPACE",
      resource: "PAGE",
      action: "READ",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "update page",
      description: "Update a page",
      status: "ACTIVE",
      scope: "WORKSPACE",
      resource: "PAGE",
      action: "UPDATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "delete page",
      description: "Delete a page",
      status: "ACTIVE",
      scope: "WORKSPACE",
      resource: "PAGE",
      action: "DELETE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
  ];

  await prisma.permission.createMany({
    data: projectPermissions,
    skipDuplicates: true,
  });

  console.log("✅ Created project-scoped permissions");

  // Create system roles
  const systemRoles = [
    {
      name: "ADMIN",
      description: "Full access to all settings and data",
      isSystem: true,
      ownerId: nishat.id,
    },
    {
      name: "DEVELOPER",
      description: "Can access and modify development resources",
      isSystem: true,
      ownerId: nishat.id,
    },
    {
      name: "VIEWER",
      description: "Can view data but cannot make changes",
      isSystem: true,
      ownerId: nishat.id,
    },
    {
      name: "PROJECT_MANAGER",
      description: "Manages project timelines and members",
      isSystem: true,
      ownerId: nishat.id,
    },
    {
      name: "SUPPORT",
      description: "Handles user queries and support tickets",
      isSystem: true,
      ownerId: nishat.id,
    },
  ];

  await prisma.role.createMany({
    data: systemRoles,
    skipDuplicates: true,
  });

  console.log("✅ Created system roles");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
