import React, { useState, useMemo } from 'react';

const TrainingCalendar = ({ employees, onAddTraining, darkMode }) => {
  const [newTraining, setNewTraining] = useState({
    employeeName: '',
    employeeId: '',
    trainingType: '',
    scheduledDate: '',
    estimatedHours: '',
    status: 'scheduled'
  });
  const [viewMode, setViewMode] = useState('upcoming');

  const trainingEvents = useMemo(() => {
    const events = employees.map(emp => ({
      ...emp,
      status: 'completed',
      trainingType: 'General Training'
    }));

    // Add upcoming training from localStorage
    const upcomingTraining = JSON.parse(localStorage.getItem('upcomingTraining') || '[]');
    return [...events, ...upcomingTraining];
  }, [employees]);

  const categorizedTraining = useMemo(() => {
    const now = new Date();
    const upcoming = trainingEvents.filter(event => {
      if (event.status === 'completed') return false;
      const eventDate = new Date(event.scheduledDate || event.date);
      return eventDate >= now;
    });

    const overdue = trainingEvents.filter(event => {
      if (event.status === 'completed') return false;
      const eventDate = new Date(event.scheduledDate || event.date);
      return eventDate < now;
    });

    const completed = trainingEvents.filter(event => event.status === 'completed');

    return { upcoming, overdue, completed };
  }, [trainingEvents]);

  const handleAddTraining = (e) => {
    e.preventDefault();
    const training = {
      ...newTraining,
      id: Date.now(),
      estimatedDaysLost: parseFloat(newTraining.estimatedHours) / 8
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('upcomingTraining') || '[]');
    localStorage.setItem('upcomingTraining', JSON.stringify([...existing, training]));

    setNewTraining({
      employeeName: '',
      employeeId: '',
      trainingType: '',
      scheduledDate: '',
      estimatedHours: '',
      status: 'scheduled'
    });

    // Refresh page to show new training
    window.location.reload();
  };

  const getStatusColor = (status, date) => {
    if (status === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    
    const eventDate = new Date(date);
    const now = new Date();
    const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 'bg-red-100 text-red-800 border-red-200'; // Overdue
    if (daysUntil <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Due soon
    return 'bg-blue-100 text-blue-800 border-blue-200'; // Upcoming
  };

  const TrainingCard = ({ training }) => {
    const eventDate = new Date(training.scheduledDate || training.date);
    const daysUntil = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
    
    return (
      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {training.employeeName || training.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {training.employeeId} • {training.trainingType || 'General Training'}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(training.status, training.scheduledDate || training.date)}`}>
            {training.status === 'completed' ? 'Completed' : 
             daysUntil < 0 ? 'Overdue' : 
             daysUntil <= 7 ? 'Due Soon' : 'Upcoming'}
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Date:</span>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              {eventDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Hours:</span>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              {training.estimatedHours || training.hours}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Days Lost:</span>
            <span className="font-semibold text-red-600">
              {((training.estimatedHours || training.hours) / 8).toFixed(1)}
            </span>
          </div>
          {daysUntil >= 0 && training.status !== 'completed' && (
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Days Until:</span>
              <span className={`font-medium ${daysUntil <= 7 ? 'text-yellow-600' : 'text-blue-600'}`}>
                {daysUntil} days
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-600 to-indigo-700'} text-white`}>
        <h1 className="text-3xl font-bold mb-2">📅 Training Calendar & Reminders</h1>
        <p className="text-blue-100">Schedule upcoming training and track compliance deadlines</p>
      </div>

      {/* Add New Training */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          ➕ Schedule New Training
        </h2>
        <form onSubmit={handleAddTraining} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Employee Name"
            value={newTraining.employeeName}
            onChange={(e) => setNewTraining(prev => ({ ...prev, employeeName: e.target.value }))}
            className={`px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
            required
          />
          <input
            type="text"
            placeholder="Employee ID"
            value={newTraining.employeeId}
            onChange={(e) => setNewTraining(prev => ({ ...prev, employeeId: e.target.value }))}
            className={`px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          />
          <select
            value={newTraining.trainingType}
            onChange={(e) => setNewTraining(prev => ({ ...prev, trainingType: e.target.value }))}
            className={`px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
            required
          >
            <option value="">Select Training Type</option>
            <option value="Safety Training">Safety Training</option>
            <option value="Compliance Training">Compliance Training</option>
            <option value="Skills Development">Skills Development</option>
            <option value="Leadership Training">Leadership Training</option>
            <option value="Technical Training">Technical Training</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            value={newTraining.scheduledDate}
            onChange={(e) => setNewTraining(prev => ({ ...prev, scheduledDate: e.target.value }))}
            className={`px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
            required
          />
          <input
            type="number"
            placeholder="Estimated Hours"
            value={newTraining.estimatedHours}
            onChange={(e) => setNewTraining(prev => ({ ...prev, estimatedHours: e.target.value }))}
            step="0.5"
            min="0"
            className={`px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            📅 Schedule Training
          </button>
        </form>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        {['upcoming', 'overdue', 'completed'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)} ({categorizedTraining[mode].length})
          </button>
        ))}
      </div>

      {/* Training Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorizedTraining[viewMode].map((training, index) => (
          <TrainingCard key={training.id || index} training={training} />
        ))}
      </div>

      {categorizedTraining[viewMode].length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="text-4xl mb-4">📅</div>
          <p>No {viewMode} training found</p>
        </div>
      )}
    </div>
  );
};

export default TrainingCalendar;