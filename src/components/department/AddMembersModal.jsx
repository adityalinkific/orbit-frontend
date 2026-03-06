import * as Dialog from "@radix-ui/react-dialog";
import { X, Check, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  getAllUsersService,
  updateUserService,
} from "../../services/user.service";

const ManageMembersModal = ({
  open,
  onOpenChange,
  departmentId,
  existingMembers = [], // [{ id, name }]
  onSuccess,
}) => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!open) return;

    fetchUsers();
    setSelected(existingMembers);
  }, [open]);

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async () => {
    try {
      const res = await getAllUsersService();

      // ✅ API returns { status, message, data }
      const allUsers = Array.isArray(res?.data) ? res.data : [];

      /**
       * RULE:
       * - user can belong to ONLY ONE department
       * - allow users with department_id = null
       * - allow users already in THIS department (editing case)
       */
      const allowedUsers = allUsers.filter(
        (u) =>
          u.department_id === null ||
          existingMembers.some((m) => m.id === u.id)
      );

      setUsers(allowedUsers);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    }
  };

  /* ---------------- SEARCH ---------------- */
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  /* ---------------- TOGGLE USER ---------------- */
  const toggleUser = (user) => {
    setSelected((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      setLoading(true);

      const selectedIds = selected.map((u) => u.id);
      const existingIds = existingMembers.map((u) => u.id);

      const toAdd = selectedIds.filter((id) => !existingIds.includes(id));
      const toRemove = existingIds.filter(
        (id) => !selectedIds.includes(id)
      );

      await Promise.all([
        ...toAdd.map((id) =>
          updateUserService(id, { department_id: departmentId })
        ),
        ...toRemove.map((id) =>
          updateUserService(id, { department_id: null })
        ),
      ]);

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update members", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[60]" />

        {/* Modal */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[70]
          w-full max-w-lg -translate-x-1/2 -translate-y-1/2
          rounded-2xl bg-white p-6 shadow-xl text-slate-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="flex gap-2 items-center text-lg font-semibold">
              <UserPlus size={20} color="#155dfc" />Manage Members
            </Dialog.Title>

            <Dialog.Close asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* Selected Members */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selected.map((user) => (
                <span
                  key={user.id}
                  className="flex items-center gap-2
                  rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {user.name}
                  <button
                    onClick={() => toggleUser(user)}
                    className="hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full mb-3 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          />

          {/* Users List */}
          <div className="divide-y divide-[#e0e0e0] max-h-56 overflow-y-auto rounded-lg border border-gray-300">
            {filteredUsers.map((user) => {
              const active = selected.some((u) => u.id === user.id);

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleUser(user)}
                  className={` w-full px-4 py-4 text-left text-md font-medium
                  flex items-center justify-between
                  hover:bg-gray-100
                  ${active ? "bg-white" : ""}`}
                >
                  <span>{user.name}</span>
                  {active && <Check size={16} />}
                </button>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                No users found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-sm border rounded-lg">
                Cancel
              </button>
            </Dialog.Close>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white
              bg-blue-600 rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ManageMembersModal;
