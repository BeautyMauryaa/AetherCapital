import { useState } from "react";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);

  const addDepartment = () => {
    setDepartments([...departments, `Dept ${departments.length + 1}`]);
  };

  return (
    <div className="mb-8">
      <p className="text-sm mb-2">Department Hierarchy</p>

      <button
        onClick={addDepartment}
        className="px-4 py-2 bg-purple-500 rounded-lg mb-3"
      >
        + Add Department
      </button>

      {departments.map((dept, i) => (
        <div key={i} className="p-2 bg-white/10 rounded mb-2">
          {dept}
        </div>
      ))}
    </div>
  );
};

export default DepartmentList;