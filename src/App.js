import React, { useState, useMemo } from 'react';
import FileUpload from './components/FileUpload';
import ManualInputForm from './components/ManualInputForm';
import EmployeeTable from './components/EmployeeTable';
import CostCentreSummary from './components/CostCentreSummary';
import Charts from './components/Charts';
import ExportButtons from './components/ExportButtons';

function App() {
  const [employees, setEmployees] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.costCentre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !dateFilter || emp.date.startsWith(dateFilter);
      return matchesSearch && matchesDate;
    });
  }, [employees, searchTerm, dateFilter]);

  const costCentreSummary = useMemo(() => {
    const summary = {};
    filteredEmployees.forEach(emp => {
      summary[emp.costCentre] = (summary[emp.costCentre] || 0) + emp.daysLost;
    });
    return Object.entries(summary).map(([centre, days]) => ({ centre, days }));
  }, [filteredEmployees]);

  const totalDaysLost = useMemo(() => {
    return filteredEmployees.reduce((sum, emp) => sum + emp.daysLost, 0);
  }, [filteredEmployees]);

  const addEmployee = (employee) => {
    const daysLost = employee.hours / 8;
    setEmployees(prev => [...prev, { ...employee, daysLost, id: Date.now() }]);
  };

  const addEmployees = (employeeList) => {
    const processedEmployees = employeeList.map(emp => ({
      ...emp,
      daysLost: emp.hours / 8,
      id: Date.now() + Math.random()
    }));
    setEmployees(prev => [...prev, ...processedEmployees]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            HR Training Time Tracker
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FileUpload onUpload={addEmployees} darkMode={darkMode} />
          <ManualInputForm onSubmit={addEmployee} darkMode={darkMode} />
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or cost centre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          />
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          />
          <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} border`}>
            Total Days Lost: <span className="font-bold text-red-600">{totalDaysLost.toFixed(2)}</span>
          </div>
        </div>

        {employees.length > 0 && (
          <>
            <ExportButtons 
              employees={filteredEmployees} 
              costCentreSummary={costCentreSummary}
              darkMode={darkMode}
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <EmployeeTable employees={filteredEmployees} darkMode={darkMode} />
              <CostCentreSummary summary={costCentreSummary} darkMode={darkMode} />
            </div>

            <Charts data={costCentreSummary} darkMode={darkMode} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;