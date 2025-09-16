import { auth } from "@/app/auth";
import { UserModel } from "@/system/Models/UserModel";
import { forbidden } from "next/navigation";
import { cache } from "react";
import Logger from "./Logger";

export class Session {
  /**
   * Get the current user from session
   * @returns {Promise<UserModel|null>}
   */
  static async getCurrentUser() {
    try {
      const session = await auth();
      return session?.user || null;
    } catch (err) {
      Logger.error(err.message, "Failed to get current user session");
    }
  }

  /**
   * Check if the user is authenticated
   * @returns {Promise<boolean>}
   */
  static async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  /**
   * Redirect to forbidden page if not authenticated
   * @returns {Promise<void>}
   */
  static async requireAuth() {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) return forbidden();
  }

  static async requireSuperAdmin() {
    const user = await this.getCurrentUser();
    if (!user || !user.isSuperAdmin) return forbidden();
  }

  /**
   * When workspaceId is not available in JWT, get it from database
   * @param {string} userId
   * @returns {Promise<string|null>}
   */
  static async getWorkspaceId(id) {
    try {
      const user = cache(
        await UserModel.findUnique({
          where: { id },
          select: { workspaceId: true },
        })
      );

      return user?.workspaceId;
    } catch (err) {
      Logger.error(err.message, "getting workspace id error");
      return null;
    }
  }

  /**
   * Get the workspaceId for the current user.
   * Either from JWT or database
   * @returns {Promise<string|null>} The workspaceId or null if not found
   */
  static async getWorkspaceIdForUser() {
    const session = await this.getCurrentUser();
    if (!session) return null;

    // Try JWT first
    if (session.workspaceId) return session.workspaceId;

    // Fallback to database
    return this.getWorkspaceId(session.id);
  }
}
