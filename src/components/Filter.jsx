import React from "react";
import "./Filter.css";

const Filter = ({ filters, handleFilterChange }) => {
  return (
    <div className="filters">
      <input
        type="text"
        name="role"
        value={filters.role}
        onChange={handleFilterChange}
        placeholder="Roles"
      />
      <input
        type="text"
        name="totalEmployees"
        value={filters.totalEmployees}
        onChange={handleFilterChange}
        placeholder="Number Of Employees"
      />
      <input
        type="text"
        name="minExperience"
        value={filters.minExperience}
        onChange={handleFilterChange}
        placeholder="Experience"
      />
      <input
        type="text"
        name="remote"
        value={filters.remote}
        onChange={handleFilterChange}
        placeholder="Remote"
      />
      <input
        type="text"
        name="salary"
        value={filters.salary}
        onChange={handleFilterChange}
        placeholder="Minimum Base Salary"
      />
      <input
        type="text"
        name="companyName"
        value={filters.companyName}
        onChange={handleFilterChange}
        placeholder="Search Company Name"
      />
    </div>
  );
};

export default Filter;
