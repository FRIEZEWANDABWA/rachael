import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

const FileUpload = ({ onUpload, darkMode }) => {
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Store original column names for adaptive display
        const originalColumns = Object.keys(jsonData[0] || {});
        
        // Smart column detection - preserve original names
        const columnMapping = {};
        originalColumns.forEach(col => {
          const lowerCol = col.toLowerCase();
          
          // Detect column types while preserving original names
          if (lowerCol.includes('name') && !lowerCol.includes('dept')) {
            columnMapping.name = col;
          } else if (lowerCol.includes('id') || lowerCol.includes('emp')) {
            columnMapping.employeeId = col;
          } else if (lowerCol.includes('email') || lowerCol.includes('mail')) {
            columnMapping.email = col;
          } else if (lowerCol.includes('cost') || lowerCol.includes('centre') || lowerCol.includes('center')) {
            columnMapping.costCentre = col;
          } else if (lowerCol.includes('dept') || lowerCol.includes('department')) {
            columnMapping.departmentName = col;
          } else if (lowerCol.includes('date')) {
            columnMapping.date = col;
          } else if (lowerCol.includes('hour') || lowerCol.includes('time')) {
            columnMapping.hours = col;
          }
        });
        
        // Use first column as name if no name column found
        if (!columnMapping.name && originalColumns.length > 0) {
          columnMapping.name = originalColumns[0];
        }
        
        // Process data using detected columns
        const employees = jsonData.map((row, index) => {
          const processedRow = {
            id: Date.now() + index,
            originalData: { ...row }, // Keep original Excel data
            columnMapping: columnMapping // Store column mapping
          };
          
          // Map detected columns to standard fields
          if (columnMapping.name) processedRow.name = row[columnMapping.name] || '';
          if (columnMapping.employeeId) processedRow.employeeId = row[columnMapping.employeeId] || '';
          if (columnMapping.email) processedRow.email = row[columnMapping.email] || '';
          if (columnMapping.costCentre) processedRow.costCentre = row[columnMapping.costCentre] || '';
          if (columnMapping.departmentName) processedRow.departmentName = row[columnMapping.departmentName] || '';
          if (columnMapping.date) processedRow.date = row[columnMapping.date] || '';
          if (columnMapping.hours) processedRow.hours = parseFloat(row[columnMapping.hours]) || 0;
          
          // Calculate days lost
          processedRow.daysLost = processedRow.hours / 8;
          
          return processedRow;
        }).filter(emp => emp.name && emp.hours > 0);
        
        // Store column info globally for table display
        window.excelColumnMapping = columnMapping;
        
        console.log('Processed employees:', employees);
        
        if (employees.length === 0) {
          alert(`No valid data found. Available columns: ${originalColumns.join(', ')}\n\nDetected: ${Object.entries(columnMapping).map(([key, col]) => `${key}: ${col}`).join(', ')}`);
          return;
        }
        
        console.log('Column Mapping:', columnMapping);
        console.log('Original Columns:', originalColumns);

        onUpload(employees);
        alert(`Successfully imported ${employees.length} employee records!`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        alert('Error reading file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.match(/\.(xlsx|xls|csv)$/i)) {
        processFile(file);
      } else {
        alert('Please upload an Excel (.xlsx, .xls) or CSV file');
      }
    }
  };

  return (
    <div 
      className={`p-6 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
        isDragging 
          ? (darkMode ? 'border-blue-400 bg-blue-900/20' : 'border-blue-400 bg-blue-50')
          : (darkMode ? 'border-gray-600 bg-gray-800 hover:border-gray-500' : 'border-gray-300 bg-white hover:border-gray-400')
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Upload Excel/CSV File
      </h2>
      
      <div className="text-center mb-6">
        <div className={`text-6xl mb-4 ${isDragging ? 'animate-bounce' : ''}`}>📁</div>
        <p className={`text-xl mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {isDragging ? '🎯 Drop your file here!' : '📂 Drag & drop your Excel/CSV file'}
        </p>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>or use the file inputs below</p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          📁 Browse Files
        </button>
        
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className={`px-4 py-2 rounded-lg border ${
            darkMode 
              ? 'border-gray-600 bg-gray-700 text-gray-300' 
              : 'border-gray-300 bg-white text-gray-700'
          }`}
        />
      </div>
      
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <p className="mb-2">
          🤖 <strong>Smart Detection:</strong> System automatically detects and uses YOUR Excel column names
        </p>
        <p className="text-xs">
          Looks for: Name, ID, Email, Cost/Centre, Department, Date, Hours (any variation)
        </p>
      </div>
    </div>
  );
};

export default FileUpload;