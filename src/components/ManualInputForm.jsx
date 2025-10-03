import React, { useState } from 'react';

const ManualInputForm = ({ onSubmit, darkMode, employeeDatabase }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    costCentre: '',
    date: '',
    hours: '',
    email: ''
  });
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.hours) {
      alert('Please fill in at least Employee Name and Training Hours');
      return;
    }
    onSubmit({
      ...formData,
      hours: parseFloat(formData.hours)
    });
    setFormData({ name: '', employeeId: '', costCentre: '', date: '', hours: '', email: '' });
    setSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-complete logic
    if (name === 'employeeId' && value.length > 0) {
      const matches = Object.values(employeeDatabase).filter(emp => 
        emp.employeeId.toLowerCase().includes(value.toLowerCase()) ||
        emp.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
    
    // Auto-fill if exact match found
    if (name === 'employeeId') {
      const exactMatch = employeeDatabase[value.toLowerCase()];
      if (exactMatch) {
        setFormData(prev => ({
          ...prev,
          name: exactMatch.name,
          costCentre: exactMatch.costCentre,
          email: exactMatch.email
        }));
        setSuggestions([]);
      }
    }
  };
  
  const selectSuggestion = (employee) => {
    setFormData(prev => ({
      ...prev,
      name: employee.name,
      employeeId: employee.employeeId,
      costCentre: employee.costCentre,
      email: employee.email
    }));
    setSuggestions([]);
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Manual Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Employee Name *"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          required
        />
        
        <div className="relative">
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID (start typing for suggestions)"
            value={formData.employeeId}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          />
          {suggestions.length > 0 && (
            <div className={`absolute z-10 w-full mt-1 rounded border shadow-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
              {suggestions.map((emp, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(emp)}
                  className={`px-3 py-2 cursor-pointer hover:${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
                >
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{emp.name}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{emp.employeeId} • {emp.costCentre}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
        />
        <input
          type="text"
          name="costCentre"
          placeholder="Cost Centre"
          value={formData.costCentre}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
        />
        <input
          type="number"
          name="hours"
          placeholder="Training Hours *"
          value={formData.hours}
          onChange={handleChange}
          step="0.5"
          min="0"
          className={`w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default ManualInputForm;