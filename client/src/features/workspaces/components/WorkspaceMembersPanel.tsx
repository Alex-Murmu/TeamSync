import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@shared/hooks/redux";
import {
  InviteMemberSchema,
  UpdateMemberRoleSchema,
  type InviteMemberInput,
  type UpdateMemberRoleInput,
  type WorkspaceMember,
} from "@shared/validations/workspace.zod";
import {
  inviteMember,
  removeMember,
  updateMemberRole,
} from "../api/workspaceApi";
import { clearError } from "../slices/workspaceSlice";

const inviteRoleOptions = ["Admin", "Member", "Viewer"] as const;
const memberRoleOptions = ["Owner", "Admin", "Member", "Viewer"] as const;

function resolveMemberProfile(member: WorkspaceMember) {
  if (typeof member.userId === "string") {
    return {
      id: member.userId,
      name: "",
      email: "",
    };
  }

  return {
    id: member.userId._id,
    name: `${member.userId.firstName ?? ""} ${member.userId.lastName ?? ""}`.trim(),
    email: member.userId.email ?? "",
  };
}

export function WorkspaceMembersPanel() {
  const dispatch = useAppDispatch();
  const { currentWorkspace, isLoading, error } = useAppSelector((state) => state.workspace);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const inviteForm = useForm<InviteMemberInput>({
    resolver: zodResolver(InviteMemberSchema),
    defaultValues: {
      email: "",
      role: "Member",
    },
  });

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearError());
  }, [error, dispatch]);

  const members = useMemo(() => currentWorkspace?.members ?? [], [currentWorkspace]);

  const handleInviteSubmit = inviteForm.handleSubmit(async (data) => {
    if (!currentWorkspace) return;
    try {
      await dispatch(inviteMember({ workspaceId: currentWorkspace._id, data })).unwrap();
      toast.success("Invitation sent");
      inviteForm.reset({ email: "", role: "Member" });
      setIsInviteOpen(false);
    } catch (inviteError) {
      toast.error(String(inviteError));
    }
  });

  if (!currentWorkspace) {
    return (
      <section className="rounded-xl border border-[#2d214d] bg-[#1f1633] p-6 text-white">
        <p className="text-xs uppercase tracking-[0.2px] text-[#9c89c5]">Member controls</p>
        <h2 className="mt-2 text-xl font-semibold">Select a workspace</h2>
        <p className="mt-3 text-sm text-[#c8b9e6]">
          Pick a workspace to manage members, send invites, and update roles.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#2d214d] bg-[#1f1633] p-6 text-white">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2px] text-[#9c89c5]">Member controls</p>
        <h2 className="text-xl font-semibold">{currentWorkspace.name}</h2>
        {currentWorkspace.description && (
          <p className="text-sm text-[#c8b9e6]">{currentWorkspace.description}</p>
        )}
      </div>

      <div className="mt-6">
        <button
          type="button"
          className="w-full rounded-lg border border-[#3a2a60] bg-[#150f23] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
          onClick={() => setIsInviteOpen((prev) => !prev)}
        >
          {isInviteOpen ? "Close invite" : "Invite member"}
        </button>

        {isInviteOpen && (
          <form
            className="mt-4 space-y-4 rounded-lg border border-[#2d214d] bg-[#150f23] p-4"
            onSubmit={handleInviteSubmit}
          >
            <div>
              <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">
                Email address
              </label>
              <input
                {...inviteForm.register("email")}
                className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#1f1633] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
                placeholder="member@teamsync.com"
                type="email"
              />
              {inviteForm.formState.errors.email?.message && (
                <p className="mt-1 text-xs text-[#f0b4c4]">
                  {inviteForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">
                Role
              </label>
              <select
                {...inviteForm.register("role")}
                className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#1f1633] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              >
                {inviteRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg border border-[#3a2a60] bg-[#1f1633] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
              disabled={isLoading || inviteForm.formState.isSubmitting}
            >
              {isLoading || inviteForm.formState.isSubmitting ? "Sending..." : "Send invite"}
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.2px] text-[#9c89c5]">Members</p>
        {members.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#2d214d] bg-[#150f23] p-4 text-sm text-[#c8b9e6]">
            No members yet. Invite someone to start collaborating.
          </div>
        ) : (
          members.map((member) => (
            <WorkspaceMemberRow
              key={typeof member.userId === "string" ? member.userId : member.userId._id}
              member={member}
              workspaceId={currentWorkspace._id}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </section>
  );
}

function WorkspaceMemberRow({
  member,
  workspaceId,
  isLoading,
}: {
  member: WorkspaceMember;
  workspaceId: string;
  isLoading: boolean;
}) {
  const dispatch = useAppDispatch();
  const profile = resolveMemberProfile(member);

  const roleForm = useForm<UpdateMemberRoleInput>({
    resolver: zodResolver(UpdateMemberRoleSchema),
    defaultValues: { role: member.role },
  });

  useEffect(() => {
    roleForm.reset({ role: member.role });
  }, [member.role, roleForm]);

  const handleRoleSubmit = roleForm.handleSubmit(async (data) => {
    try {
      await dispatch(
        updateMemberRole({ workspaceId, memberId: profile.id, data })
      ).unwrap();
      toast.success("Role updated");
    } catch (roleError) {
      toast.error(String(roleError));
    }
  });

  const handleRemove = async () => {
    try {
      await dispatch(removeMember({ workspaceId, memberId: profile.id })).unwrap();
      toast.success("Member removed");
    } catch (removeError) {
      toast.error(String(removeError));
    }
  };

  return (
    <div className="rounded-lg border border-[#2d214d] bg-[#150f23] p-4">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {profile.name || profile.email || profile.id}
          </p>
          {profile.email && <p className="text-xs text-[#c8b9e6]">{profile.email}</p>}
        </div>

        <form className="space-y-3" onSubmit={handleRoleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">
              Role
            </label>
            <select
              {...roleForm.register("role")}
              className="mt-2 w-full rounded-lg border border-[#2d214d] bg-[#1f1633] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(0,0,0,0.4)] focus:border-[#6b4aa5] focus:outline-none focus:ring-2 focus:ring-[#6b4aa5]"
              disabled={member.role === "Owner"}
            >
              {memberRoleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-lg border border-[#3a2a60] bg-[#1f1633] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496] disabled:opacity-60"
              disabled={isLoading || roleForm.formState.isSubmitting || member.role === "Owner"}
            >
              {isLoading || roleForm.formState.isSubmitting ? "Updating..." : "Update role"}
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg border border-[#4a1f2f] bg-[#2a0f1c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#7a2c44] disabled:opacity-60"
              disabled={isLoading || member.role === "Owner"}
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
