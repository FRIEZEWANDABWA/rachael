import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import SmartFieldMapper from './SmartFieldMapper';

const FileUpload = ({ onUpload, darkMode }) => {
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [showMapper, setShowMapper] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Check if we have complex data that needs mapping
        const originalColumns = Object.keys(jsonData[0] || {});
        
        if (originalColumns.length > 10 || !originalColumns.some(col => col.toLowerCase().includes('name'))) {
          // Show smart mapper for complex files
          setExcelData(jsonData);
          setShowMapper(true);
          return;
        }
        
        // Quick processing for simple files
        const employees = jsonData.map((row, index) => {
          const nameCol = originalColumns.find(col => col.toLowerCase().includes('name')) || originalColumns[0];
          const hoursCol = originalColumns.find(col => col.toLowerCase().includes('hour') || col.toLowerCase().includes('time'));
          
          return {
            id: Date.now() + index,
            name: row[nameCol] || '',
            hours: parseFloat(row[hoursCol]) || 0,
            employeeId: row[originalColumns.find(col => col.toLowerCase().includes('id'))] || '',
            email: row[originalColumns.find(col => col.toLowerCase().includes('email'))] || '',
            costCentre: row[originalColumns.find(col => col.toLowerCase().includes('cost'))] || 'Unknown',
            departmentName: row[originalColumns.find(col => col.toLowerCase().includes('dept'))] || '',
            date: row[originalColumns.find(col => col.toLowerCase().includes('date'))] || '',
            daysLost: (parseFloat(row[hoursCol]) || 0) / 8,
            originalData: row
          };
        }).filter(emp => emp.name && emp.hours > 0);
        
        if (employees.length === 0) {
          setExcelData(jsonData);
          setShowMapper(true);
          return;
        }
        
        onUpload(employees);
        alert(`✅ Quick import: ${employees.length} records processed!`);
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
          🤖 <strong>Smart Processing:</strong> Handles any Excel structure automatically
        </p>
        <p className="text-xs">
          • Simple files: Instant processing • Complex files: Smart field mapper • Any column names supported
        </p>
      </div>
      
      {showMapper && (
        <SmartFieldMapper
          excelData={excelData}
          onMappingComplete={(processedData) => {
            setShowMapper(false);
            setExcelData([]);
            onUpload(processedData);
            alert(`✨ Smart mapping complete: ${processedData.length} records processed!`);
          }}
          onCancel={() => {
            setShowMapper(false);
            setExcelData([]);
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default FileUpload;