import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../../services/api";
import { toast } from "react-hot-toast";
import { getAllUsersService } from "../../services/user.service";

export default function AddMemberModal({
  open,
  onClose,
  projectId,
  onSuccess,
}) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    role: "contributor",
  });
  const [loading, setLoading] = useState(false);

  /* FETCH USERS */
  useEffect(() => {
    if (open) fetchUsers();
  }, [open]);

    const fetchUsers = async () => {
    try {
        const res = await getAllUsersService();

        //  handle both possible shapes safely
        const usersArray = Array.isArray(res) ? res : res?.data || [];

        setUsers(usersArray);
    } catch (err) {
        console.error(err);
        setUsers([]);
    }
    };


  const handleSubmit = async () => {
    if (!formData.user_id) {
      toast.error("Please select a user");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/projects/${projectId}/members`, {
        user_id: Number(formData.user_id),
        role: formData.role,
      });

      toast.success("Member added");

      onSuccess && onSuccess();
      onClose();

      setFormData({
        user_id: "",
        role: "contributor",
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* OVERLAY */}
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />

        {/* MODAL */}
        <Dialog.Content className="fixed text-slate-900 z-50 top-1/2 left-1/2 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl">

          {/* CLOSE */}
          <Dialog.Close asChild>
            <button className="absolute right-5 top-5 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </Dialog.Close>

          {/* TITLE */}
          <Dialog.Title className="text-xl font-semibold text-gray-900">
            Add Team Member
          </Dialog.Title>

          {/* FORM */}
          <div className="mt-6 space-y-5">

            {/* SELECT USER */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase">
                Select User
              </label>
              <select
                value={formData.user_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    user_id: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              >
                <option value="">Select a user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.email}
                  </option>
                ))}
              </select>
            </div>

            {/* ROLE */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              >
                <option value="contributor">Contributor</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end items-center gap-3 mt-8 pt-5 border-t border-gray-100">
            <Dialog.Close asChild>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </button>
            </Dialog.Close>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-5 py-2 text-sm rounded-md font-medium text-white 
                ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
