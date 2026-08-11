import { forbidden } from "next/navigation";
import { canReadPageAuth } from "@/authorization/PageAuthGuard";
import { canReadSectionAuth } from "@/authorization/SectionAuthGuard";
import { ProjectServices } from "@/system/Services/ProjectServices";
import { SectionServices } from "@/system/Services/SectionServices";
import ProjectEditorShell from "./ProjectEditorShell";
export default async function ProjectEditorPage({ params }) {
  const canReadSectionPermission = await canReadSectionAuth();
  if (canReadSectionPermission.success === false) forbidden();

  const canReadPagePermission = await canReadPageAuth();
  if (canReadPagePermission.success === false) forbidden();

  const { slug } = await params;
  const project = await ProjectServices.getResource({ where: { slug } });
  const hasSection = await SectionServices.hasResource({
    where: { projectId: project.id },
  });
  const getAllSections = await SectionServices.getAllSectionWithPages({
    projectId: project.id,
  });

  return <ProjectEditorShell project={project} hasSection={hasSection} sections={getAllSections} />;
}
