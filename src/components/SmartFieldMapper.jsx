import React, { useState } from 'react';

const SmartFieldMapper = ({ excelData, onMappingComplete, onCancel, darkMode }) => {
  const [fieldMapping, setFieldMapping] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const excelColumns = Object.keys(excelData[0] || {});
  
  const requiredFields = [
    { key: 'name', label: 'Employee Name', required: true, icon: '👤' },
    { key: 'hours', label: 'Training Hours', required: true, icon: '⏰' },
    { key: 'employeeId', label: 'Employee ID', required: false, icon: '🆔' },
    { key: 'email', label: 'Email', required: false, icon: '📧' },
    { key: 'costCentre', label: 'Cost Centre', required: false, icon: '🏢' },
    { key: 'departmentName', label: 'Department', required: false, icon: '🏛️' },
    { key: 'date', label: 'Training Date', required: false, icon: '📅' }
  ];

  const handleAutoMap = React.useCallback(() => {
    const autoMapping = {};
    
    requiredFields.forEach(field => {
      const matchedColumn = excelColumns.find(col => {
        const colLower = col.toLowerCase();
        const fieldLower = field.key.toLowerCase();
        
        // Smart matching logic
        if (fieldLower === 'name') {
          return colLower.includes('name') && !colLower.includes('dept');
        }
        if (fieldLower === 'hours') {
          return colLower.includes('hour') || colLower.includes('time');
        }
        if (fieldLower === 'employeeid') {
          return colLower.includes('id') || colLower.includes('emp');
        }
        if (fieldLower === 'email') {
          return colLower.includes('email') || colLower.includes('mail');
        }
        if (fieldLower === 'costcentre') {
          return colLower.includes('cost') || colLower.includes('centre') || colLower.includes('center');
        }
        if (fieldLower === 'departmentname') {
          return colLower.includes('dept') || colLower.includes('department');
        }
        if (fieldLower === 'date') {
          return colLower.includes('date');
        }
        
        return colLower.includes(fieldLower);
      });
      
      if (matchedColumn) {
        autoMapping[field.key] = matchedColumn;
      }
    });
    
    setFieldMapping(autoMapping);
  }, [excelColumns, requiredFields]);

  const handleProcessData = () => {
    setIsProcessing(true);
    
    // Validate required fields
    const hasName = fieldMapping.name;
    const hasHours = fieldMapping.hours;
    
    if (!hasName || !hasHours) {
      alert('⚠️ Please map at least Employee Name and Training Hours fields');
      setIsProcessing(false);
      return;
    }
    
    // Process data with mapped fields
    const processedData = excelData.map((row, index) => ({
      id: Date.now() + index,
      name: row[fieldMapping.name] || '',
      hours: parseFloat(row[fieldMapping.hours]) || 0,
      employeeId: fieldMapping.employeeId ? row[fieldMapping.employeeId] || '' : '',
      email: fieldMapping.email ? row[fieldMapping.email] || '' : '',
      costCentre: fieldMapping.costCentre ? row[fieldMapping.costCentre] || 'Unknown' : 'Unknown',
      departmentName: fieldMapping.departmentName ? row[fieldMapping.departmentName] || '' : '',
      date: fieldMapping.date ? row[fieldMapping.date] || '' : '',
      daysLost: (parseFloat(row[fieldMapping.hours]) || 0) / 8,
      originalData: row // Keep original data for reference
    })).filter(emp => emp.name && emp.hours > 0);
    
    setTimeout(() => {
      onMappingComplete(processedData, fieldMapping);
      setIsProcessing(false);
    }, 500);
  };

  // Auto-map on component mount
  React.useEffect(() => {
    handleAutoMap();
  }, [handleAutoMap]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            🎯 Smart Field Mapper
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Map your Excel columns to system fields. Found {excelColumns.length} columns, {excelData.length} rows.
          </p>
        </div>

        <div className="p-6">
          {/* Auto-map button */}
          <div className="mb-6">
            <button
              onClick={handleAutoMap}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🤖 Auto-Map Fields
            </button>
          </div>

          {/* Field mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {requiredFields.map(field => (
              <div key={field.key} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{field.icon}</span>
                  <label className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {field.label}
                  </label>
                  {field.required && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                </div>
                <select
                  value={fieldMapping[field.key] || ''}
                  onChange={(e) => setFieldMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className={`w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'}`}
                >
                  <option value="">-- Select Column --</option>
                  {excelColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                {fieldMapping[field.key] && (
                  <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sample: {excelData[0][fieldMapping[field.key]]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} mb-6`}>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📋 Preview (First 3 rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className={`text-left p-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                    <th className={`text-left p-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hours</th>
                    <th className={`text-left p-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Days Lost</th>
                    <th className={`text-left p-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Other Fields</th>
                  </tr>
                </thead>
                <tbody>
                  {excelData.slice(0, 3).map((row, index) => (
                    <tr key={index}>
                      <td className={`p-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {fieldMapping.name ? row[fieldMapping.name] : '❌'}
                      </td>
                      <td className={`p-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {fieldMapping.hours ? row[fieldMapping.hours] : '❌'}
                      </td>
                      <td className="p-2 font-bold text-red-600">
                        {fieldMapping.hours ? ((parseFloat(row[fieldMapping.hours]) || 0) / 8).toFixed(1) : '0.0'}
                      </td>
                      <td className={`p-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {Object.entries(fieldMapping).filter(([key, col]) => key !== 'name' && key !== 'hours' && col).length} mapped
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleProcessData}
              disabled={isProcessing || !fieldMapping.name || !fieldMapping.hours}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                isProcessing || !fieldMapping.name || !fieldMapping.hours
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                `🚀 Process ${excelData.length} Records`
              )}
            </button>
            
            <button
              onClick={onCancel}
              className={`px-6 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFieldMapper;