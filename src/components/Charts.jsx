import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Charts = ({ data, darkMode }) => {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Days Lost by Cost Centre (Bar Chart)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
            <XAxis 
              dataKey="centre" 
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
            />
            <Bar dataKey="days" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Days Lost Distribution (Pie Chart)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ centre, percent }) => `${centre} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="days"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                color: darkMode ? '#FFFFFF' : '#000000'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;