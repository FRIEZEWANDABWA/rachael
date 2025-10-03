import React, { useState, useMemo, useEffect } from 'react';
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
  const [employeeDatabase, setEmployeeDatabase] = useState({});

  // Load data from localStorage on startup
  useEffect(() => {
    const savedEmployees = localStorage.getItem('hrTrainingData');
    const savedDatabase = localStorage.getItem('hrEmployeeDatabase');
    
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
    if (savedDatabase) {
      setEmployeeDatabase(JSON.parse(savedDatabase));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('hrTrainingData', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hrEmployeeDatabase', JSON.stringify(employeeDatabase));
  }, [employeeDatabase]);

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
    const newEmployee = { ...employee, daysLost, id: Date.now() };
    
    // Add to employees list
    setEmployees(prev => [...prev, newEmployee]);
    
    // Update employee database for auto-complete
    if (employee.name && employee.employeeId) {
      setEmployeeDatabase(prev => ({
        ...prev,
        [employee.employeeId.toLowerCase()]: {
          name: employee.name,
          employeeId: employee.employeeId,
          costCentre: employee.costCentre,
          email: employee.email || ''
        }
      }));
    }
  };

  const addEmployees = (employeeList) => {
    const processedEmployees = employeeList.map(emp => ({
      ...emp,
      daysLost: emp.hours / 8,
      id: Date.now() + Math.random()
    }));
    
    setEmployees(prev => [...prev, ...processedEmployees]);
    
    // Update employee database from bulk upload
    const newDatabase = { ...employeeDatabase };
    employeeList.forEach(emp => {
      if (emp.name && emp.employeeId) {
        newDatabase[emp.employeeId.toLowerCase()] = {
          name: emp.name,
          employeeId: emp.employeeId,
          costCentre: emp.costCentre,
          email: emp.email || ''
        };
      }
    });
    setEmployeeDatabase(newDatabase);
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
          <ManualInputForm 
            onSubmit={addEmployee} 
            darkMode={darkMode} 
            employeeDatabase={employeeDatabase}
          />
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
          <button
            onClick={() => {
              localStorage.removeItem('hrTrainingData');
              localStorage.removeItem('hrEmployeeDatabase');
              setEmployees([]);
              setEmployeeDatabase({});
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🗑️ Clear All Data
          </button>
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