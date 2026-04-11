import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa6"
import toast from "react-hot-toast"

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/department.service"

import { getAllUsersService } from "../../services/user.service"

import DepartmentModal from "../../components/department/DepartmentModal"
import DepartmentCard from "../../components/department/DepartmentCard"
import DepartmentListView from "../../components/department/DepartmentListView"
import DepartmentsToolbar from "../../components/department/DepartmentsToolbar"
import DepartmentDetailsModal from "../../components/department/DepartmentDetailsModal"
import DepartmentCardSkeleton from "../../components/department/DepartmentCardSkeleton"
import DepartmentTableSkeleton from "../../components/department/DepartmentTableSkeleton"
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal"

const Departments = () => {
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [view, setView] = useState("grid")

  const [form, setForm] = useState({
    name: "",
    description: "",
    department_head_id: null,
    is_active: true,
  })

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    fetchDepartments()
    fetchUsers()
  }, [])

  

const fetchDepartments = async () => {
  try {
    setLoadingDepartments(true)
    const data = await getDepartments()
    setDepartments(data)
  } catch (err) {
    console.error(err)
  } finally {
    setLoadingDepartments(false)
  }
}





  const fetchUsers = async () => {
    try {
      const res = await getAllUsersService()
      setUsers(Array.isArray(res.data) ? res.data : [])
    } catch {
      setUsers([])
    }
  }

  /* ---------------- CREATE / UPDATE ---------------- */
const handleSubmit = async (e) => {
  e.preventDefault()
  if (isSubmitting) return

if (!form.name.trim()) {
  toast.error("Department name is required")
  return
}


  setIsSubmitting(true)
  setErrorMessage("")

  const payload = {
    name: form.name.trim(),
    description: form.description?.trim() || "",
    department_head_id: typeof form.department_head_id === "number"
      ? form.department_head_id
      : 0,
    is_active: form.is_active, 
  }

  try {
     if (editingDept) {
    await toast.promise(
      updateDepartment(editingDept.id, payload),
      {
        loading: "Updating department...",
        success: "Department updated successfully",
        error: "Failed to update department",
      }
    )
  } else {
    await toast.promise(
      createDepartment(payload),
      {
        loading: "Creating department...",
        success: "Department created successfully",
        error: "Failed to create department",
      }
    )
  }

    await fetchDepartments() 
    setShowModal(false)
    setEditingDept(null)
    setForm({
      name: "",
      description: "",
      department_head_id: null,
      is_active: true, 
    })
  } catch (err) {
    console.error(err)
    setErrorMessage("Operation failed")
  } finally {
    setIsSubmitting(false)
  }
}



  /* ---------------- DELETE ---------------- */
const handleDeleteClick = (id) => {
  const dept = departments.find((d) => d.id === id)
  if (!dept) return

  if (dept.total_members > 0) {
    toast.error(
      "This department has members. Please reassign them from the People page before deleting."
    )
    return
  }

  setDepartmentToDelete(id)
  setDeleteModalOpen(true)
}


const confirmDelete = async () => {
  if (!departmentToDelete) return

  try {
    setIsDeleting(true)

    await toast.promise(
      deleteDepartment(departmentToDelete),
      {
        loading: "Deleting department...",
        success: "Department deleted successfully",
        error: "Failed to delete department",
      }
    )

    setDepartments((prev) =>
      prev.filter((d) => d.id !== departmentToDelete)
    )

    if (selectedDepartment?.id === departmentToDelete) {
      setSidebarOpen(false)
      setSelectedDepartment(null)
    }

    setDeleteModalOpen(false)
    setDepartmentToDelete(null)
  } catch (err) {
    console.error(err)
  } finally {
    setIsDeleting(false)
  }
}


  /* ---------------- EDIT ---------------- */
const handleEdit = (id) => {
  const dept = departments.find((d) => d.id === id)
  if (!dept) return

  setEditingDept(dept)
  setForm({
    name: dept.name,
    description: dept.description || "",
    department_head_id: dept.department_head_id ?? null,
    is_active: dept.is_active ?? true, 
  })
  setShowModal(true)
}


  /* ---------------- SIDEBAR ---------------- */
  const handleDepartmentClick = (dept) => {
    setSelectedDepartment(dept)
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedDepartment(null)
  }

  /* ---------------- FILTER ---------------- */
const filteredDepartments = departments
  .filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )
  .filter((d) =>
    status === "all" ? true : status === "active" ? d.is_active : !d.is_active
  )
  .sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name)
    
    if (sortBy === "members") return b.total_members - a.total_members
    
    if (sortBy === "created")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    
    return 0
  })





  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={closeSidebar}
        />
      )}

      <div className="relative z-20 min-h-screen bg-gray-50 p-8">
        <div className="mb-6 flex justify-between">
          <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">Departments</h1>
              <p className="text-gray-500 text-sm">Organizational structure and team ownership</p>
            </div>
            <div>
          <button
            onClick={() => {
              setEditingDept(null)
              setForm({
                name: "",
                description: "",
                department_head_id: null,
                is_active: true,
              })
              setShowModal(true)
            }}
            className="flex cursor-pointer items-center text-[14px] font-medium gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-white"
          >
            <FaPlus /> Add Department
          </button>
                      </div>

        </div>

        <DepartmentsToolbar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          view={view}
          setView={setView}
        />

        {loadingDepartments ? (
  view === "grid" ? (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <DepartmentCardSkeleton key={i} />
      ))}
    </div>
  ) : (
    <DepartmentTableSkeleton />
  )
) :view === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDepartments.map((d) => (
              <DepartmentCard
                key={d.id}
                department={d}
                onClick={handleDepartmentClick}
                onEdit={() => handleEdit(d.id)}
                onDelete={() => handleDeleteClick(d.id)}
              />
            ))}
          </div>
        ) : (
          <DepartmentListView
            departments={filteredDepartments}
            onDepartmentClick={handleDepartmentClick}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            sortBy={sortBy}           
            onSortChange={setSortBy} 
          />
        )}

        <DepartmentModal
          open={showModal}
          onOpenChange={setShowModal}
          mode={editingDept ? "edit" : "create"}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isSubmitting={isSubmitting}
          users={users}
        />
      </div>

      <DepartmentDetailsModal
        department={selectedDepartment}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
            />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
      />
    </>
  )
}

export default Departments
