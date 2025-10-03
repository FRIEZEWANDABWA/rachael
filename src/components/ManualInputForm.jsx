import React, { useState } from 'react';

const ManualInputForm = ({ onSubmit, darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    costCentre: '',
    date: '',
    hours: ''
  });

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
    setFormData({ name: '', employeeId: '', costCentre: '', date: '', hours: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
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