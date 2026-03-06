import * as Dialog from "@radix-ui/react-dialog"
import { Users, X, Plus, FolderKanban } from "lucide-react"
import { useEffect, useState } from "react"

import { getAllUsersService } from "../../services/user.service"
import { getDepartmentById } from "../../services/department.service"
import ManageMembersModal from "./AddMembersModal"

const DepartmentDetailsModal = ({ department, open, onOpenChange }) => {
  const [members, setMembers] = useState([])
  const [deptMeta, setDeptMeta] = useState(null)
  const [openManageMembers, setOpenManageMembers] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (department?.id && open) {
      fetchDepartmentMeta()
      fetchMembers()
    }
  }, [department?.id, open])

  const fetchDepartmentMeta = async () => {
    try {
      const data = await getDepartmentById(department.id)
      setDeptMeta(data)
    } catch (err) {
      console.error("Failed to fetch department meta", err)
    }
  }

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const users = await getAllUsersService()

      const deptMembers =
        users.data?.filter((u) => u.department_id === department.id) || []

      setMembers(deptMembers)
    } catch (err) {
      console.error("Failed to fetch members", err)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const handleManageMembersSuccess = () => {
    fetchMembers()
    fetchDepartmentMeta()
  }

  if (!department) return null

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          {/* Overlay */}
          <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />

          {/* Modal */}
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white shadow-xl z-50">

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b">
              <div className="flex gap-3 items-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  {department.name}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    department.is_active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {department.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <Dialog.Close>
                <X size={18} color="gray" />
              </Dialog.Close>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Description
                </h3>

                <p className="text-sm text-slate-900">
                  {department.description || "No description available"}
                </p>
              </div>

              {/* Head */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Head of Department
                </h3>

                {department.department_head_name ? (
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                      {department.department_head_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <span className="text-sm font-medium text-slate-900">
                      {department.department_head_name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users size={16} />
                    No team lead assigned
                  </div>
                )}
              </div>

              {/* Members */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-sm text-gray-600 flex items-center gap-2">
                    <Users size={16} />
                    Members
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {deptMeta?.total_members ?? members.length}
                    </span>
                  </h3>

                  {/* <button
                    onClick={() => setOpenManageMembers(true)}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600"
                  >
                    <Plus size={14} /> Manage
                  </button> */}
                </div>

                {loading ? (
                  <p className="text-sm text-gray-400">Loading members…</p>
                ) : members.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No members in this department
                  </p>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex text-slate-900 items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                      >
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                          {member.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.role?.role || "—"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects */}
              <div>
                <h3 className="font-medium text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <FolderKanban size={16} /> Associated Projects
                </h3>

                <div className="rounded-lg bg-gray-100 p-3 flex justify-between">
                  <span className="text-sm text-gray-600">
                    Total Projects
                  </span>

                  <span className="text-lg font-semibold">
                    {deptMeta?.total_associated_projects ?? "—"}
                  </span>
                </div>
              </div>

              {/* Created */}
              <div className="pt-4 border-t text-sm text-gray-500">
                <span className="font-medium">Created on:</span>{" "}
                {new Date(department.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* <ManageMembersModal
        open={openManageMembers}
        onOpenChange={setOpenManageMembers}
        departmentId={department.id}
        existingMembers={members}
        onSuccess={handleManageMembersSuccess}
      /> */}
    </>
  )
}

export default DepartmentDetailsModal
