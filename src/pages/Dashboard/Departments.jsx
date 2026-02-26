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

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // 🔥 SEND TO API ANYWAY - LET SERVER DECIDE
      const apiData = { 
        name: trimmedName, 
        description: form.description?.trim() || "" 
      }
      
      console.log("🔥 SENDING ANYWAY:", apiData)
      const response = await createDepartment(apiData)
      
      // If we get here, it SUCCEEDED
      console.log("✅ CREATED:", response.data)
    }

    // Success!
    setShowModal(false)
    setEditingDept(null)
    setForm({ name: "", description: "", is_active: true })
    await fetchDepartments()
    
  } catch (error) {
    console.error("💥 CAUGHT:", error.response?.data)
    
    // SERVER KNOWS BEST - TRUST IT
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex item-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Departments</h1>
          <p className="text-gray-500 text-sm">Organizational structure and team ownership</p>
        </div>
          <div>
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

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredDepartments.map((d) => (
            <DepartmentCard
              key={d.id}
              department={d}
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
        departments={departments}
        isSubmitting={isSubmitting} 
        disabled={!form.name.trim() || errorMessage.includes("exists")}
      />


    </div>
  )
}

export default Departments
