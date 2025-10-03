import React, { useMemo } from 'react';

const ExecutiveDashboard = ({ employees, costCentreSummary, darkMode }) => {
  const metrics = useMemo(() => {
    const totalEmployees = employees.length;
    const totalDaysLost = employees.reduce((sum, emp) => sum + emp.daysLost, 0);
    const totalHours = employees.reduce((sum, emp) => sum + emp.hours, 0);
    const avgDaysPerEmployee = totalEmployees > 0 ? totalDaysLost / totalEmployees : 0;
    
    // Find most impacted department
    const topDepartment = costCentreSummary.length > 0 
      ? costCentreSummary.reduce((max, dept) => dept.totalDays > max.totalDays ? dept : max)
      : null;
    
    // Calculate financial impact (assuming $200/day average cost)
    const financialImpact = totalDaysLost * 200;
    
    // Recent training (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTraining = employees.filter(emp => {
      if (!emp.date) return false;
      const empDate = new Date(emp.date);
      return empDate >= thirtyDaysAgo;
    }).length;

    return {
      totalEmployees,
      totalDaysLost,
      totalHours,
      avgDaysPerEmployee,
      topDepartment,
      financialImpact,
      recentTraining,
      departments: costCentreSummary.length
    };
  }, [employees, costCentreSummary]);

  const MetricCard = ({ icon, title, value, subtitle, color, trend }) => (
    <div className={`p-6 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl mb-2`}>{icon}</div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>
            {title}
          </h3>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <span className="text-white text-xl">{trend || '📊'}</span>
        </div>
      </div>
    </div>
  );

  if (employees.length === 0) {
    return (
      <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-100'} text-center`}>
        <div className="text-6xl mb-4">🚀</div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          Welcome to HR Training Analytics
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Upload your training data or add employees manually to see powerful insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-600 to-indigo-700'} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Training Analytics Dashboard</h1>
            <p className="text-blue-100">
              Real-time insights into your organization's training performance
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">Last Updated</div>
            <div className="text-lg font-semibold">{new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon="👥"
          title="Total Employees"
          value={metrics.totalEmployees.toLocaleString()}
          subtitle={`${metrics.departments} departments`}
          color="bg-blue-500"
          trend="📈"
        />
        
        <MetricCard
          icon="⏰"
          title="Days Lost"
          value={metrics.totalDaysLost.toFixed(1)}
          subtitle={`${metrics.totalHours} training hours`}
          color="bg-red-500"
          trend="📉"
        />
        
        <MetricCard
          icon="💰"
          title="Financial Impact"
          value={`$${metrics.financialImpact.toLocaleString()}`}
          subtitle="Estimated productivity cost"
          color="bg-yellow-500"
          trend="💸"
        />
        
        <MetricCard
          icon="📅"
          title="Recent Training"
          value={metrics.recentTraining}
          subtitle="Last 30 days"
          color="bg-green-500"
          trend="🔥"
        />
      </div>

      {/* Department Spotlight */}
      {metrics.topDepartment && (
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Most Impacted Department
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-bold text-red-600">{metrics.topDepartment.departmentName}</span> 
                {' '}({metrics.topDepartment.costCentre}) has lost{' '}
                <span className="font-bold">{metrics.topDepartment.totalDays.toFixed(1)} days</span> 
                {' '}across {metrics.topDepartment.employeeCount} employees
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Average: {(metrics.topDepartment.totalDays / metrics.topDepartment.employeeCount).toFixed(1)} days per employee
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Bar */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex flex-wrap gap-6 text-sm`}>
        <div className="flex items-center gap-2">
          <span className="text-blue-500">📊</span>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Avg per employee: <strong>{metrics.avgDaysPerEmployee.toFixed(1)} days</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">⚡</span>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Training efficiency: <strong>{(metrics.totalHours / metrics.totalEmployees).toFixed(1)} hrs/employee</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-500">🏢</span>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Department coverage: <strong>{metrics.departments} active departments</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;