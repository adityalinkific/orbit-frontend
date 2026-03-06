import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa6"

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

const Departments = () => {
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingDepartments, setLoadingDepartments] = useState(true)

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
    setErrorMessage("Department name is required")
    return
  }

  setIsSubmitting(true)
  setErrorMessage("")

  const payload = {
    name: form.name.trim(),
    description: form.description?.trim() || "",
    department_head_id: typeof form.department_head_id === "number"
      ? form.department_head_id
      : null,
    is_active: form.is_active, 
  }

  try {
    if (editingDept) {
      await updateDepartment(editingDept.id, payload) 
    } else {
      await createDepartment(payload)
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
  const handleDelete = async (id) => {
    if (!confirm("Delete department?")) return

    try {
      await deleteDepartment(id)
      setDepartments((prev) => prev.filter((d) => d.id !== id))

      if (selectedDepartment?.id === id) {
        setSidebarOpen(false)
        setSelectedDepartment(null)
      }
    } catch (err) {
      console.error("Delete failed", err)
      alert("Delete failed (backend CORS issue)")
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
            className="flex items-center text-[14px] font-medium gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-white"
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
                onDelete={() => handleDelete(d.id)}
              />
            ))}
          </div>
        ) : (
          <DepartmentListView
            departments={filteredDepartments}
            onDepartmentClick={handleDepartmentClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
    </>
  )
}

export default Departments
