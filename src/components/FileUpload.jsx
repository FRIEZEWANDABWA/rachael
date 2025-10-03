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

        const employees = jsonData.map(row => ({
          name: row['Employee Name'] || row.name || '',
          employeeId: row['Employee ID'] || row.employeeId || '',
          costCentre: row['Cost Centre'] || row.costCentre || '',
          date: row['Training Date'] || row.date || '',
          hours: parseFloat(row['Training Hours'] || row.hours || 0)
        })).filter(emp => emp.name && emp.hours > 0);

        onUpload(employees);
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
      
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Expected columns: Employee Name, Employee ID, Cost Centre, Training Date, Training Hours
      </p>
    </div>
  );
};

export default FileUpload;