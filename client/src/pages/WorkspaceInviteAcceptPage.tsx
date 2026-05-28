import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@shared/hooks/redux";
import { acceptInvitation } from "@features/workspaces/api/workspaceApi";

export function WorkspaceInviteAcceptPage() {
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const { currentWorkspace, isLoading, error } = useAppSelector((state) => state.workspace);
  const ranRef = useRef(false);

  useEffect(() => {
    if (!token || ranRef.current) return;
    ranRef.current = true;

    dispatch(acceptInvitation({ token }))
      .unwrap()
      .then(() => toast.success("Invitation accepted"))
      .catch((err) => toast.error(String(err)));
  }, [dispatch, token]);

  return (
    <div className="min-h-screen bg-[#150f23] px-6 py-16 text-white">
      <div className="mx-auto max-w-xl rounded-xl border border-[#2d214d] bg-[#1f1633] p-8 shadow-lg">
        <p className="text-xs uppercase tracking-[0.2px] text-[#9c89c5]">Workspace invite</p>
        <h1 className="mt-2 text-2xl font-semibold">Accepting invitation</h1>
        <p className="mt-3 text-sm text-[#c8b9e6]">
          {isLoading
            ? "Hang tight while we connect your account to the workspace."
            : error
            ? "We could not accept this invitation. Please verify the link or contact the owner."
            : "You are now connected to the workspace."}
        </p>
        {currentWorkspace && !isLoading && !error && (
          <div className="mt-4 rounded-lg border border-[#2d214d] bg-[#150f23] p-4">
            <p className="text-xs uppercase tracking-[0.2px] text-[#c8b9e6]">Workspace</p>
            <p className="mt-2 text-lg font-semibold text-white">{currentWorkspace.name}</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/workspaces"
            className="flex-1 rounded-lg border border-[#3a2a60] bg-[#1f1633] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
          >
            View workspaces
          </Link>
          <Link
            to="/"
            className="flex-1 rounded-lg border border-[#2d214d] bg-[#150f23] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2px] text-white shadow-inset-btn transition duration-200 hover:border-[#5c4496]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
