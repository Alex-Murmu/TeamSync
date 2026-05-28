import { Invitation } from "../model/Invitation.model.js";
import { Workspace } from "../model/Workspace.model.js";
import { User } from "../model/User.model.js";
import { CreateInvitationInputs } from "../validators/invitation.validation.js";
import { Types } from "mongoose";
import crypto from "crypto";

const INVITATION_EXPIRY_HOURS = 7 * 24; // 7 days

export class InvitationService {
  static generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  static async sendInvitation(
    workspaceId: string,
    invitedBy: string,
    data: CreateInvitationInputs
  ) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const inviterRole = workspace.members.find((m) => m.userId.toString() === invitedBy);
    if (!inviterRole || !["Owner", "Admin"].includes(inviterRole.role)) {
      throw new Error("Insufficient permissions to invite members");
    }

    // Check if user already exists in workspace
    const existingMember = workspace.members.find((m) => {
      const user = m.userId as any;
      return user.email?.toLowerCase() === data.email.toLowerCase();
    });
    if (existingMember) throw new Error("User is already a member of this workspace");

    // Check if pending invitation exists
    const pendingInvite = await Invitation.findOne({
      workspaceId,
      email: data.email.toLowerCase(),
      status: "pending",
    });
    if (pendingInvite) throw new Error("Invitation already sent to this email");

    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000);

    const invitation = await Invitation.create({
      workspaceId: new Types.ObjectId(workspaceId),
      email: data.email.toLowerCase(),
      token,
      role: data.role,
      invitedBy: new Types.ObjectId(invitedBy),
      expiresAt,
    });

    // TODO: Send email with invitation link
    // Email link format: https://app.com/accept-invitation/{token}

    return invitation;
  }

  static async verifyInvitation(token: string) {
    const invitation = await Invitation.findOne({ token });

    if (!invitation) throw new Error("Invalid invitation token");

    if (invitation.status === "accepted") throw new Error("Invitation already accepted");

    if (invitation.status === "cancelled") throw new Error("Invitation has been cancelled");

    if (new Date() > invitation.expiresAt) {
      invitation.status = "expired";
      await invitation.save();
      throw new Error("Invitation has expired");
    }

    return invitation;
  }

  static async acceptInvitation(token: string, userId: string) {
    const invitation = await this.verifyInvitation(token);

    const workspace = await Workspace.findById(invitation.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Verify user email matches invitation email
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new Error("Email mismatch: logged in user email does not match invitation email");
    }

    // Check if user already in workspace
    const existingMember = workspace.members.find((m) => m.userId.toString() === userId);
    if (existingMember) throw new Error("User is already a member of this workspace");

    // Add user to workspace
    workspace.members.push({
      userId: new Types.ObjectId(userId),
      role: invitation.role,
    });
    await workspace.save();

    // Mark invitation as accepted
    invitation.status = "accepted";
    invitation.acceptedAt = new Date();
    invitation.acceptedBy = new Types.ObjectId(userId);
    await invitation.save();

    return workspace.populate("members.userId", "firstName lastName email");
  }

  static async cancelInvitation(invitationId: string, userId: string) {
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) throw new Error("Invitation not found");

    const workspace = await Workspace.findById(invitation.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const inviterRole = workspace.members.find((m) => m.userId.toString() === userId);
    if (!inviterRole || !["Owner", "Admin"].includes(inviterRole.role)) {
      throw new Error("Insufficient permissions to cancel invitation");
    }

    invitation.status = "cancelled";
    await invitation.save();

    return invitation;
  }
}
