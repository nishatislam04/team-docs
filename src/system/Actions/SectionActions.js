"use server";

import { revalidatePath } from "next/cache";
import {
  canCreateSectionAuth,
  canDeleteSectionAuth,
  canUpdateSectionAuth,
} from "@/authorization/SectionAuthGuard";
import { requireWorkspaceAdmin } from "@/authorization/WorkspaceAuthGuard";
import Logger from "@/lib/Logger";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import { Session } from "@/lib/Session";
import { SectionSchema } from "@/lib/schemas/SectionSchema";
import { SectionModel } from "../Models/SectionModel";
import { ProjectServices } from "../Services/ProjectServices";
import { SectionServices } from "../Services/SectionServices";
import { BaseAction } from "./BaseAction";

class SectionActions extends BaseAction {
  static get schema() {
    return SectionSchema;
  }

  static async create(formData) {
    await requireWorkspaceAdmin();

    const canCreateSection = await canCreateSectionAuth();
    if (canCreateSection.success === false) return canCreateSection;

    const result = await SectionActions.execute(formData);

    if (!result.success) return result;

    try {
      const { name, description, projectId } = result.data;
      const session = await Session.getCurrentUser();
      const project = await ProjectServices.getResource({ where: { id: projectId } });
      Logger.debug(project, "project from create section");

      await SectionModel.create({
        name,
        description,
        projectId: project.id,
        ownerId: session.id,
      });

      revalidatePath(`/(home)/projects/${project.slug}/editor`, "layout");
      // revalidatePath(`/projects/${project.slug}/editor`, "page");
      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: `/projects/${project.slug}/editor`,
      };
    } catch (error) {
      Logger.error(error.message, `Section Create fail`);
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "description"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to create Section"] },
        data: result.data,
      };
    }
  }

  static async update(sectionId, formData) {
    await requireWorkspaceAdmin();

    const canUpdateSection = await canUpdateSectionAuth();
    Logger.debug(canUpdateSection, "canUpdateSection");
    if (canUpdateSection.success === false) return canUpdateSection;

    const result = await SectionActions.execute(formData);

    if (!result.success) return result;

    try {
      const section = await SectionServices.getSection(sectionId);
      const project = section.project;

      await SectionServices.updateResource(sectionId, {
        name: result.data.name,
        description: result.data.description,
      });

      revalidatePath(`/(home)/projects/${project.slug}/editor`, "layout");
      return {
        data: result.data,
        success: true,
        type: "success",
      };
    } catch (error) {
      Logger.error(error.message, "section update failed:");
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "description"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to update section"] },
        data: result.data,
      };
    }
  }

  static async delete(sectionId) {
    await requireWorkspaceAdmin();

    const canDeleteSection = await canDeleteSectionAuth();
    if (canDeleteSection.success === false) return canDeleteSection;

    try {
      Logger.debug(sectionId, "delete section");
      // const section = await SectionServices.getResource({
      //   where: { id: sectionId },
      //   include: { project: true },
      // });
      const section = await SectionServices.getSection(sectionId);
      const project = section.project;

      Logger.debug(project, "project from delete section");

      await SectionServices.deleteResource(sectionId);

      revalidatePath(`/(home)/projects/${project.slug}/editor`, "layout");
      return {
        success: true,
        type: "success",
        message: "Section successfully deleted",
      };
    } catch (error) {
      Logger.error(error.message, "section deletion failed:");
      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to delete section"] },
      };
    }
  }
}

export async function createSection(formData) {
  return await SectionActions.create(formData);
}

export async function updateSectionAction(sectionId, formData) {
  return await SectionActions.update(sectionId, formData);
}

export async function deleteSectionAction(prevState, sectionId) {
  return await SectionActions.delete(sectionId);
}
