import { Session } from "@/lib/Session";
import Logger from "@/lib/Logger";
import { UserServices } from "@/system/Services/UserServices";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";

/**
 * BaseAuthGuard - Laravel-like authorization base class
 *
 * Base class for authorization logic that can be inherited by
 * resource-specific authorization guards. This is a utility class
 * that does not use "use server" directive.
 */
export class BaseAuthGuard {
  /**
   * UTILITY FUNCTIONS
   * Get the current authenticated user session
   * @returns {Promise<Object|null>} User session object or null
   */
  static async getSession() {
    try {
      return await Session.getCurrentUser();
    } catch (err) {
      Logger.error(err.message, "failed to get user session from base auth guard");
      return null;
    }
  }

  /**
   * UTILITY FUNCTIONS
   * Require authentication - throws forbidden if not authenticated
   * @returns {Promise<Object>} User session object
   * @throws {Error} Forbidden error if not authenticated
   */
  static async requireAuth() {
    const session = await this.getSession();
    if (!session) return this.redirectUnauthorized();
    return session;
  }

  /**
   * UTILITY FUNCTIONS
   * Check if user is a super admin
   * @param {Object} session - User session object
   * @returns {boolean} True if user is super admin
   */
  static isSuperAdmin(session) {
    return session?.isSuperAdmin === true;
  }

  /**
   * UTILITY FUNCTIONS
   * Require super admin privileges
   * @returns {Promise<Object>} User session object
   * @throws {Error} Forbidden error if not super admin
   */
  static async requireSuperAdmin() {
    const session = await this.requireAuth();
    if (!this.isSuperAdmin(session)) return this.redirectUnauthorized();

    return session;
  }

  /**
   * UTILITY FUNCTIONS
   * Require workspace admin privileges
   * This is now our prismary function to perform authorization
   * @returns {Promise<boolean>} True if user is workspace admin
   * @throws {Error} Forbidden error if not workspace admin
   */
  static async isWorkspaceAdmin() {
    const session = await this.requireAuth();
    if (!session) return this.redirectUnauthorized();

    const user = await UserServices.getResource({
      where: { id: session.id },
      select: { isWorkspaceOwner: true },
    });

    if (!user.isWorkspaceOwner) return this.redirectUnauthorized();

    return true;
  }

  /**
   * Basic authentication check
   * Checking if user is auth & the user exists & has a workspace
   *
   * Check if user is authenticated and has a valid workspace membership
   * @returns {Promise<Object|null>} User session object or null
   * @throws {Error} Forbidden error if not authenticated
   */
  static async basicAuthCheck() {
    const session = await this.getSession();
    if (!session) return this.redirectUnauthorized();

    const workspaceId = session.workspaceId || Session.getWorkspaceId();

    const userExist = await UserServices.hasResource({
      where: { id: session.id },
    });

    if (!userExist) {
      Logger.warn(`User ${session.id} attempted to view projects without user membership`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to perform this action."] },
      };
    }

    const workspaceExist = await WorkspaceServices.hasResource({
      where: { id: workspaceId },
      include: {
        owner: true,
      },
    });

    if (!workspaceExist) {
      Logger.warn(`User ${session.id} attempted to view projects without workspace membership`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to perform this action."] },
      };
    }

    return session;
  }

  /**
   * Check if user owns a resource
   * @param {string} resourceOwnerId - Resource owner ID
   * @returns {boolean} True if user owns the resource
   */
  static isOwner(resourceOwnerId) {
    const session = this.getSession();
    return session?.id === resourceOwnerId;
  }
}
