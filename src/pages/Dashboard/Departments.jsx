import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa6"
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentById,
} from "../../services/department.service"

import DepartmentModal from "../../components/common/DepartmentModal"
import DepartmentCard from "../../components/common/DepartmentCard"
import DepartmentListView from "../../components/common/DepartmentListView"
import DepartmentsToolbar from "../../components/common/DepartmentsToolbar"
import DepartmentSidebar from "../../components/common/DepartmentSidebar"

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [view, setView] = useState("grid")

  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
  })

  useEffect(() => {
    console.log("Departments loaded:", departments.length)
  }, [departments])

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments()
      console.log("📥 API Response:", res)
      setDepartments(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Failed to fetch departments:", error)
      setDepartments([])
    }
  }

  const filteredDepartments = departments
    .filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((d) =>
      status === "all" ? true : status === "active" ? d.is_active : !d.is_active
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "members")
        return (b.member_count || 0) - (a.member_count || 0)
      if (sortBy === "created")
        return new Date(b.created_at) - new Date(a.created_at)
      return 0
    })

const handleDepartmentClick = async (dept) => {
  try {
    setSidebarOpen(true)
    setSelectedDepartment(null) 

    const res = await getDepartmentById(dept.id)
    setSelectedDepartment(res.data)
  } catch (error) {
    console.error("Failed to load department details", error)
    setSidebarOpen(false)
  }
}


  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : ""
    return () => (document.body.style.overflow = "")
  }, [sidebarOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    const trimmedName = form.name.trim()
    if (!trimmedName) {
      setErrorMessage("Department name is required")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, form)
      } else {
        const apiData = { 
          name: trimmedName, 
          description: form.description?.trim() || "" 
        }
        console.log("🔥 SENDING ANYWAY:", apiData)
        const response = await createDepartment(apiData)
        console.log("✅ CREATED:", response.data)
      }

      setShowModal(false)
      setEditingDept(null)
      setForm({ name: "", description: "", is_active: true })
      await fetchDepartments()
    } catch (error) {
      console.error("💥 CAUGHT:", error.response?.data)
      if (error.response?.status === 409) {
        setErrorMessage(`"${trimmedName}" already exists`)
      } else if (error.response?.status === 422) {
        setErrorMessage("Invalid data format")
      } else {
        setErrorMessage("Network error - try again")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (id) => {
    const res = await getDepartmentById(id)
    setEditingDept(res.data)
    setForm(res.data)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete department?")) return
    await deleteDepartment(id)
    fetchDepartments()
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedDepartment(null)
  }

  return (
    <>
      {/* FULL-SCREEN OVERLAY - Blurs + Blackish hue ENTIRE app (navbar + sidebar + content) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* MAIN CONTENT - Gets blurred + dimmed */}
      <div 
        className={`
          relative z-20 transition-all duration-300 min-h-screen bg-gray-50
          ${sidebarOpen 
            ? 'blur-sm brightness-75 pointer-events-none select-none' 
            : ''
          }
        `}
      >
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">Departments</h1>
              <p className="text-gray-500 text-sm">Organizational structure and team ownership</p>
            </div>
            <button
              onClick={async () => {
                await fetchDepartments()
                setEditingDept(null)
                setForm({ name: "", description: "", is_active: true })
                setErrorMessage("")
                setShowModal(true)
              }}
              className="flex items-center gap-2 rounded-md bg-[#005eff] px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FaPlus className="text-xs" />
              Add Department
            </button>
          </div>

          {/* Toolbar */}
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

          {/* Content */}
          {view === "grid" ? (
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
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDepartmentClick={handleDepartmentClick}
            />
          )}

          {/* Modal */}
          <DepartmentModal
            open={showModal}
            onOpenChange={setShowModal}
            mode={editingDept ? "edit" : "create"}
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            departments={departments}
            isSubmitting={isSubmitting}
            disabled={!form.name.trim() || isSubmitting}
          />
        </div>
      </div>

      {/* DEPARTMENT SIDEBAR - Always on top */}
      <DepartmentSidebar
        department={selectedDepartment}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
    </>
  )
}

export default Departments
