import { useEffect, useState } from "react";
import { FaBuilding, FaPlus  } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";

import { getDepartments } from "../../services/department.service";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

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

        <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md shadow hover:bg-slate-700 transition">
          <FaPlus size={18} />
          Add Department
        </button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <FaBuilding size={22} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {dept.name}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm mt-2 min-h-[48px]">
                {dept.description || "No description available"}
              </p>

              <hr className="my-4 border-slate-300" />

              {/* Members */}
              <div className="flex items-center text-gray-500 text-sm gap-2 mb-4">
                <FiUsers size={16} />
                <span>{dept.member_count || 0} members</span>
              </div>
                            <hr className="my-4 border-slate-300" />


              {/* Leader */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center text-sm font-medium">
                  {dept.leader_name
                    ? dept.leader_name.charAt(0).toUpperCase()
                    : "?"}
                </div>

                <span className="text-sm text-gray-600">
                  {dept.leader_name
                    ? `Led by ${dept.leader_name}`
                    : "No leader assigned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;
