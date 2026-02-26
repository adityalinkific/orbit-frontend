import { useEffect, useState } from "react";
import { FaBuilding, FaPlus } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentById,
} from "../../services/department.service";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE / UPDATE ================= */

  const [errorMessage, setErrorMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage("");

  try {
    if (editingDept) {
      await updateDepartment(editingDept.id, {
        name: form.name,
        description: form.description,
      });
    } else {
      await createDepartment({
        name: form.name,
        description: form.description,
      });
    }

    closeModal();
    fetchDepartments();
  } catch (error) {
    if (error.response?.status === 409) {
      setErrorMessage(
        error.response?.data?.message || "Department already exists."
      );
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }
};

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = async (id) => {
    try {
      const response = await getDepartmentById(id);
      const dept = response.data;

      setEditingDept(dept);
      setForm({
        name: dept.name,
        description: dept.description,
      });

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDept(null);
    setForm({ name: "", description: "" });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Departments
          </h1>
          <p className="text-gray-500 mt-1">
            Organizational structure and team ownership
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md shadow hover:bg-slate-700 transition"
        >
          <FaPlus size={18} />
          Add Department
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <FaBuilding size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {dept.name}
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                {dept.description || "No description available"}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(dept.id)}
                  className="text-sm text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(dept.id)}
                  className="text-sm text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">
              {errorMessage && (
  <div className="bg-red-100 text-red-600 px-3 py-2 rounded text-sm">
    {errorMessage}
  </div>
)}
              {editingDept ? "Edit Department" : "Create Department"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Department Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-sm text-gray-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingDept ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;