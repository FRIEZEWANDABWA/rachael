import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CostAnalysisDashboard = ({ employees, darkMode }) => {
  const [salaryRates, setSalaryRates] = useState({
    'IT': 75,
    'HR': 65,
    'Finance': 70,
    'Operations': 60,
    'Management': 90,
    'Unknown': 55
  });
  const [showSettings, setShowSettings] = useState(false);

  const costAnalysis = useMemo(() => {
    const departmentCosts = {};
    let totalTrainingCost = 0;
    let totalProductivityLoss = 0;
    let totalEmployees = employees.length;

    employees.forEach(emp => {
      const dept = emp.departmentName || emp.costCentre || 'Unknown';
      const hourlyRate = salaryRates[dept] || salaryRates['Unknown'];
      const trainingCost = emp.hours * hourlyRate;
      const productivityLoss = emp.daysLost * (hourlyRate * 8);

      if (!departmentCosts[dept]) {
        departmentCosts[dept] = {
          department: dept,
          employees: 0,
          totalHours: 0,
          totalDays: 0,
          trainingCost: 0,
          productivityLoss: 0,
          hourlyRate: hourlyRate
        };
      }

      departmentCosts[dept].employees++;
      departmentCosts[dept].totalHours += emp.hours;
      departmentCosts[dept].totalDays += emp.daysLost;
      departmentCosts[dept].trainingCost += trainingCost;
      departmentCosts[dept].productivityLoss += productivityLoss;

      totalTrainingCost += trainingCost;
      totalProductivityLoss += productivityLoss;
    });

    const departmentArray = Object.values(departmentCosts).sort((a, b) => 
      (b.trainingCost + b.productivityLoss) - (a.trainingCost + a.productivityLoss)
    );

    return {
      totalTrainingCost,
      totalProductivityLoss,
      totalCost: totalTrainingCost + totalProductivityLoss,
      totalEmployees,
      avgCostPerEmployee: totalEmployees > 0 ? (totalTrainingCost + totalProductivityLoss) / totalEmployees : 0,
      departments: departmentArray
    };
  }, [employees, salaryRates]);

  const chartColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  const CostCard = ({ title, value, subtitle, icon, color, trend }) => (
    <div className={`p-6 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-xl transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>
              {title}
            </h3>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ${value.toLocaleString()}
          </p>
          {subtitle && (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
          <span className="text-white text-2xl">{trend}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-green-600 to-emerald-700'} text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">💰 Cost Analysis & ROI Dashboard</h1>
            <p className="text-green-100">Financial impact analysis of training programs</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            ⚙️ Salary Settings
          </button>
        </div>
      </div>

      {/* Salary Settings */}
      {showSettings && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💼 Department Hourly Rates (USD)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(salaryRates).map(([dept, rate]) => (
              <div key={dept}>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {dept}
                </label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setSalaryRates(prev => ({ ...prev, [dept]: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CostCard
          title="Training Costs"
          value={costAnalysis.totalTrainingCost}
          subtitle="Direct training expenses"
          icon="🎓"
          color="bg-blue-500"
          trend="📊"
        />
        
        <CostCard
          title="Productivity Loss"
          value={costAnalysis.totalProductivityLoss}
          subtitle="Lost work time value"
          icon="⏰"
          color="bg-red-500"
          trend="📉"
        />
        
        <CostCard
          title="Total Impact"
          value={costAnalysis.totalCost}
          subtitle="Combined financial impact"
          icon="💸"
          color="bg-purple-500"
          trend="💰"
        />
        
        <CostCard
          title="Cost Per Employee"
          value={costAnalysis.avgCostPerEmployee}
          subtitle="Average training cost"
          icon="👤"
          color="bg-green-500"
          trend="📈"
        />
      </div>

      {/* Department Cost Breakdown */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏢 Department Cost Analysis
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Department</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Employees</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Hours</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Training Cost</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Productivity Loss</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Cost</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cost/Employee</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {costAnalysis.departments.map((dept, index) => (
                <tr key={index} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {dept.department}
                  </td>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {dept.employees}
                  </td>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {dept.totalHours.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">
                    ${dept.trainingCost.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">
                    ${dept.productivityLoss.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-purple-600">
                    ${(dept.trainingCost + dept.productivityLoss).toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ${((dept.trainingCost + dept.productivityLoss) / dept.employees).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Chart */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Department Cost Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costAnalysis.departments}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="department" 
                stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                fontSize={12}
              />
              <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="trainingCost" fill="#3B82F6" name="Training Cost" />
              <Bar dataKey="productivityLoss" fill="#EF4444" name="Productivity Loss" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Distribution Pie Chart */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🥧 Total Cost Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costAnalysis.departments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, trainingCost, productivityLoss }) => 
                  `${department}: $${(trainingCost + productivityLoss).toLocaleString()}`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey={(entry) => entry.trainingCost + entry.productivityLoss}
              >
                {costAnalysis.departments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Total Cost']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gradient-to-r from-green-900 to-emerald-900' : 'bg-gradient-to-r from-green-50 to-emerald-50'} border ${darkMode ? 'border-green-700' : 'border-green-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
          📈 ROI & Budget Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800/50' : 'bg-white'}`}>
            <h3 className={`font-semibold ${darkMode ? 'text-green-200' : 'text-green-800'}`}>Annual Projection</h3>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-green-900'}`}>
              ${(costAnalysis.totalCost * 4).toLocaleString()}
            </p>
            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              Quarterly × 4 estimate
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800/50' : 'bg-white'}`}>
            <h3 className={`font-semibold ${darkMode ? 'text-green-200' : 'text-green-800'}`}>Efficiency Score</h3>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-green-900'}`}>
              {costAnalysis.totalEmployees > 0 ? Math.round((costAnalysis.totalTrainingCost / costAnalysis.totalCost) * 100) : 0}%
            </p>
            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              Training vs total cost ratio
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800/50' : 'bg-white'}`}>
            <h3 className={`font-semibold ${darkMode ? 'text-green-200' : 'text-green-800'}`}>Budget Recommendation</h3>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-green-900'}`}>
              ${Math.round(costAnalysis.avgCostPerEmployee * 1.2).toLocaleString()}
            </p>
            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              Per employee (+20% buffer)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysisDashboard;