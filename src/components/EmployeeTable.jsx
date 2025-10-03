import React from 'react';

const EmployeeTable = ({ employees, darkMode }) => {
  const totalDays = employees.reduce((sum, emp) => sum + emp.daysLost, 0);

  return (
    <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
      <h2 className={`text-xl font-semibold p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Employee Training Records
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cost Centre</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Department</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Hours</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Days Lost</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{emp.name}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{emp.email}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{emp.costCentre}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{emp.departmentName}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{emp.date}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{emp.hours}</td>
                <td className={`px-4 py-3 text-sm font-bold text-red-600`}>{emp.daysLost.toFixed(2)}</td>
              </tr>
            ))}
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} font-bold`}>
              <td colSpan="6" className={`px-4 py-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>TOTAL TRAINING DAYS LOST</td>
              <td className="px-4 py-3 text-sm font-bold text-red-600 text-lg">{totalDays.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;