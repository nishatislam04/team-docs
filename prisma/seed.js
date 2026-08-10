import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/client/client";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

// ! add nishat project permissions

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

  // Create system-scoped permissions for all resources
  const systemPermissions = [
    // PAGE permissions (already existing)
    {
      name: "create page",
      description: "Create a page",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PAGE",
      action: "CREATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "read page",
      description: "Read a page",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PAGE",
      action: "READ",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "update page",
      description: "Update a page",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PAGE",
      action: "UPDATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "delete page",
      description: "Delete a page",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PAGE",
      action: "DELETE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    // WORKSPACE permissions
    {
      name: "create workspace",
      description: "Create a workspace",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "WORKSPACE",
      action: "CREATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "read workspace",
      description: "Read a workspace",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "WORKSPACE",
      action: "READ",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "update workspace",
      description: "Update a workspace",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "WORKSPACE",
      action: "UPDATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "delete workspace",
      description: "Delete a workspace",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "WORKSPACE",
      action: "DELETE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    // PROJECT permissions
    {
      name: "create project",
      description: "Create a project",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PROJECT",
      action: "CREATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "read project",
      description: "Read a project",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PROJECT",
      action: "READ",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "update project",
      description: "Update a project",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PROJECT",
      action: "UPDATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "delete project",
      description: "Delete a project",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PROJECT",
      action: "DELETE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    // SECTION permissions
    {
      name: "create section",
      description: "Create a section",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "SECTION",
      action: "CREATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "read section",
      description: "Read a section",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "SECTION",
      action: "READ",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "update section",
      description: "Update a section",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "SECTION",
      action: "UPDATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "delete section",
      description: "Delete a section",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "SECTION",
      action: "DELETE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    // USER permissions
    {
      name: "create user",
      description: "Create a user",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "USER",
      action: "CREATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "read user",
      description: "Read a user",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "USER",
      action: "READ",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "update user",
      description: "Update a user",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "USER",
      action: "UPDATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "delete user",
      description: "Delete a user",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "USER",
      action: "DELETE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    // ROLE permissions
    {
      name: "create role",
      description: "Create a role",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "ROLE",
      action: "CREATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "read role",
      description: "Read a role",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "ROLE",
      action: "READ",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "update role",
      description: "Update a role",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "ROLE",
      action: "UPDATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "delete role",
      description: "Delete a role",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "ROLE",
      action: "DELETE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    // PERMISSION permissions
    {
      name: "create permission",
      description: "Create a permission",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PERMISSION",
      action: "CREATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "read permission",
      description: "Read a permission",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PERMISSION",
      action: "READ",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "update permission",
      description: "Update a permission",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PERMISSION",
      action: "UPDATE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
    {
      name: "delete permission",
      description: "Delete a permission",
      status: "ACTIVE",
      scope: "SYSTEM",
      resource: "PERMISSION",
      action: "DELETE",
      ownerId: nishat.id,
      workspaceId: workspace.id,
    },
  ];

  await prisma.permission.createMany({
    data: systemPermissions,
    skipDuplicates: true,
  });

  console.log("✅ Created system-scoped permissions");

  // Create system roles
  const systemRoles = [
    {
      name: "ADMIN",
      role: "ADMIN",
      description: "Full access to all settings and data",
      isSystem: true,
      ownerId: nishat.id,
    },
    {
      name: "DEVELOPER",
      role: "DEVELOPER",
      description: "Can access and modify development resources",
      isSystem: true,
      ownerId: nishat.id,
    },
    {
      name: "VIEWER",
      role: "VIEWER",
      description: "Can view data but cannot make changes",
      isSystem: true,
      ownerId: nishat.id,
    },
    {
      name: "PROJECT_MANAGER",
      role: "PROJECT_MANAGER",
      description: "Manages project timelines and members",
      isSystem: true,
      ownerId: nishat.id,
    },
    {
      name: "SUPPORT",
      role: "SUPPORT",
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
