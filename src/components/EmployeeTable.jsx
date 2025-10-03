import React from 'react';

const EmployeeTable = ({ employees, darkMode }) => {
  const totalDays = employees.reduce((sum, emp) => sum + emp.daysLost, 0);
  
  // Get column mapping from first employee (if from Excel)
  const columnMapping = employees.length > 0 && employees[0].columnMapping 
    ? employees[0].columnMapping 
    : {
        name: 'Name',
        employeeId: 'Employee ID', 
        email: 'Email',
        costCentre: 'Cost Centre',
        departmentName: 'Department',
        date: 'Date',
        hours: 'Hours'
      };
  
  // Determine which columns to show based on available data
  const visibleColumns = [];
  if (columnMapping.name) visibleColumns.push({ key: 'name', label: columnMapping.name });
  if (columnMapping.employeeId) visibleColumns.push({ key: 'employeeId', label: columnMapping.employeeId });
  if (columnMapping.email && employees.some(emp => emp.email)) visibleColumns.push({ key: 'email', label: columnMapping.email });
  if (columnMapping.costCentre && employees.some(emp => emp.costCentre)) visibleColumns.push({ key: 'costCentre', label: columnMapping.costCentre });
  if (columnMapping.departmentName && employees.some(emp => emp.departmentName)) visibleColumns.push({ key: 'departmentName', label: columnMapping.departmentName });
  if (columnMapping.date && employees.some(emp => emp.date)) visibleColumns.push({ key: 'date', label: columnMapping.date });
  if (columnMapping.hours) visibleColumns.push({ key: 'hours', label: columnMapping.hours });
  visibleColumns.push({ key: 'daysLost', label: 'Days Lost' });

  return (
    <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
      <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📋 Training Records ({employees.length} employees)
        </h2>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing columns from your data: {visibleColumns.slice(0, -1).map(col => col.label).join(', ')}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              {visibleColumns.map((col, index) => (
                <th key={index} className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {employees.map((emp) => (
              <tr key={emp.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {visibleColumns.map((col, index) => {
                  let value = emp[col.key] || '';
                  let className = `px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`;
                  
                  // Special formatting for specific columns
                  if (col.key === 'name') {
                    className = `px-4 py-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`;
                  } else if (col.key === 'email') {
                    className = `px-4 py-3 text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`;
                  } else if (col.key === 'daysLost') {
                    className = 'px-4 py-3 text-sm font-bold text-red-600';
                    value = typeof value === 'number' ? value.toFixed(2) : value;
                  }
                  
                  return (
                    <td key={index} className={className}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} font-bold border-t-2`}>
              <td colSpan={visibleColumns.length - 1} className={`px-4 py-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                TOTAL TRAINING DAYS LOST
              </td>
              <td className="px-4 py-3 text-sm font-bold text-red-600 text-lg">
                {totalDays.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;