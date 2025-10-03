import React from 'react';

const Navigation = ({ currentPage, setCurrentPage, darkMode, employeeCount }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Overview & Analytics' },
    { id: 'calendar', name: 'Training Calendar', icon: '📅', description: 'Schedule & Reminders' },
    { id: 'compliance', name: 'Compliance Tracker', icon: '🎯', description: 'Required vs Completed' },
    { id: 'cost-analysis', name: 'Cost Analysis', icon: '💰', description: 'ROI & Budget Planning' },
    { id: 'quick-actions', name: 'Quick Actions', icon: '⚡', description: 'Bulk Operations & Lookup' }
  ];

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-6`}>
      <div className="flex flex-wrap gap-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === item.id
                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <div className="text-left">
              <div className="font-medium">{item.name}</div>
              <div className={`text-xs ${currentPage === item.id ? 'text-blue-100' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                {item.description}
              </div>
            </div>
            {item.id === 'dashboard' && employeeCount > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                currentPage === item.id ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
              }`}>
                {employeeCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;