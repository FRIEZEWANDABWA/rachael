import React from 'react';

const CostCentreSummary = ({ summary, darkMode }) => {
  const totalDays = summary.reduce((sum, item) => sum + item.days, 0);

  return (
    <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
      <h2 className={`text-xl font-semibold p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Cost Centre Summary
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cost Centre</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Days Lost</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {summary.map((item, index) => (
              <tr key={index}>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.centre}</td>
                <td className="px-4 py-3 text-sm font-medium text-red-600">{item.days.toFixed(2)}</td>
              </tr>
            ))}
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} font-bold`}>
              <td className={`px-4 py-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total</td>
              <td className="px-4 py-3 text-sm font-bold text-red-600">{totalDays.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostCentreSummary;