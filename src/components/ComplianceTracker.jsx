import React, { useMemo } from 'react';

const ComplianceTracker = ({ employees, darkMode }) => {
  const complianceData = useMemo(() => {
    // Required training types for compliance
    const requiredTraining = [
      { type: 'Safety Training', frequency: 365, critical: true },
      { type: 'Compliance Training', frequency: 365, critical: true },
      { type: 'Skills Development', frequency: 180, critical: false },
      { type: 'Leadership Training', frequency: 365, critical: false }
    ];

    // Group employees by department
    const departments = {};
    employees.forEach(emp => {
      const dept = emp.departmentName || emp.costCentre || 'Unknown';
      if (!departments[dept]) {
        departments[dept] = {
          name: dept,
          employees: [],
          totalEmployees: 0,
          compliantEmployees: 0,
          criticalNonCompliant: 0
        };
      }
      departments[dept].employees.push(emp);
      departments[dept].totalEmployees++;
    });

    // Calculate compliance for each department
    Object.values(departments).forEach(dept => {
      dept.employees.forEach(emp => {
        // Simulate compliance check (in real system, this would check actual training records)
        const hasRecentTraining = emp.date && new Date(emp.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        const isCompliant = hasRecentTraining || Math.random() > 0.3; // 70% compliance rate simulation
        
        if (isCompliant) {
          dept.compliantEmployees++;
        } else {
          dept.criticalNonCompliant++;
        }
      });
      
      dept.complianceRate = (dept.compliantEmployees / dept.totalEmployees) * 100;
    });

    return { departments: Object.values(departments), requiredTraining };
  }, [employees]);

  const overallCompliance = useMemo(() => {
    const totalEmployees = complianceData.departments.reduce((sum, dept) => sum + dept.totalEmployees, 0);
    const totalCompliant = complianceData.departments.reduce((sum, dept) => sum + dept.compliantEmployees, 0);
    return totalEmployees > 0 ? (totalCompliant / totalEmployees) * 100 : 0;
  }, [complianceData]);

  const getComplianceColor = (rate) => {
    if (rate >= 90) return 'text-green-600 bg-green-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getComplianceStatus = (rate) => {
    if (rate >= 90) return { status: 'Excellent', icon: '🟢' };
    if (rate >= 70) return { status: 'Good', icon: '🟡' };
    return { status: 'Needs Attention', icon: '🔴' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-green-600 to-emerald-700'} text-white`}>
        <h1 className="text-3xl font-bold mb-2">🎯 Compliance Tracker</h1>
        <p className="text-green-100">Monitor training compliance across all departments</p>
      </div>

      {/* Overall Compliance */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Organization Overview
          </h2>
          <div className={`px-4 py-2 rounded-full font-bold ${getComplianceColor(overallCompliance)}`}>
            {overallCompliance.toFixed(1)}% Compliant
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className="text-2xl font-bold text-blue-600">
              {complianceData.departments.reduce((sum, dept) => sum + dept.totalEmployees, 0)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Employees</div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <div className="text-2xl font-bold text-green-600">
              {complianceData.departments.reduce((sum, dept) => sum + dept.compliantEmployees, 0)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Compliant</div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
            <div className="text-2xl font-bold text-red-600">
              {complianceData.departments.reduce((sum, dept) => sum + dept.criticalNonCompliant, 0)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Non-Compliant</div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <div className="text-2xl font-bold text-purple-600">
              {complianceData.departments.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Departments</div>
          </div>
        </div>
      </div>

      {/* Required Training Types */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📋 Required Training Matrix
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceData.requiredTraining.map((training, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              training.critical 
                ? (darkMode ? 'border-red-500 bg-red-900/20' : 'border-red-200 bg-red-50')
                : (darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50')
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{training.critical ? '🚨' : '📚'}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  training.critical ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {training.critical ? 'Critical' : 'Standard'}
                </span>
              </div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {training.type}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Every {training.frequency} days
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Compliance */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏢 Department Compliance Status
        </h2>
        <div className="space-y-4">
          {complianceData.departments.map((dept, index) => {
            const status = getComplianceStatus(dept.complianceRate);
            return (
              <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{status.icon}</span>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {dept.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {dept.totalEmployees} employees
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full font-bold ${getComplianceColor(dept.complianceRate)}`}>
                      {dept.complianceRate.toFixed(1)}%
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {status.status}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={`text-green-600 font-medium`}>
                    ✅ {dept.compliantEmployees} Compliant
                  </span>
                  <span className={`text-red-600 font-medium`}>
                    ❌ {dept.criticalNonCompliant} Non-Compliant
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className={`mt-3 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                    style={{ width: `${dept.complianceRate}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-500' : 'bg-red-50 border border-red-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
          🚨 Immediate Action Required
        </h2>
        <div className="space-y-2">
          {complianceData.departments
            .filter(dept => dept.complianceRate < 70)
            .map((dept, index) => (
              <div key={index} className={`p-3 rounded ${darkMode ? 'bg-red-800/30' : 'bg-red-100'}`}>
                <span className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                  {dept.name}: {dept.criticalNonCompliant} employees need immediate training
                </span>
              </div>
            ))}
          {complianceData.departments.every(dept => dept.complianceRate >= 70) && (
            <div className={`p-3 rounded ${darkMode ? 'bg-green-800/30' : 'bg-green-100'}`}>
              <span className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                🎉 All departments meet minimum compliance requirements!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceTracker;