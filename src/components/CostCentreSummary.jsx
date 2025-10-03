import React from 'react';

const CostCentreSummary = ({ summary, darkMode }) => {
  const totalDays = summary.reduce((sum, item) => sum + item.totalDays, 0);
  const totalEmployees = summary.reduce((sum, item) => sum + item.employeeCount, 0);

  return (
    <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
      <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏢 Department Training Report
        </h2>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {summary.length} departments • {totalEmployees} employees • {totalDays.toFixed(1)} total days lost
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cost Centre</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Department Name</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Employees</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Days Lost</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Avg per Employee</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {summary.map((item, index) => (
              <tr key={index} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{item.costCentre}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.departmentName}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.employeeCount}</td>
                <td className="px-4 py-3 text-sm font-bold text-red-600">{item.totalDays.toFixed(2)}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{(item.totalDays / item.employeeCount).toFixed(1)}</td>
              </tr>
            ))}
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} font-bold border-t-2`}>
              <td colSpan="2" className={`px-4 py-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>ORGANIZATION TOTAL</td>
              <td className={`px-4 py-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalEmployees}</td>
              <td className="px-4 py-3 text-sm font-bold text-red-600 text-lg">{totalDays.toFixed(2)}</td>
              <td className={`px-4 py-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{(totalDays / totalEmployees).toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostCentreSummary;