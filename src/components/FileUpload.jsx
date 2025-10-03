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
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div 
      className={`p-6 rounded-lg border-2 border-dashed transition-colors ${
        isDragging 
          ? (darkMode ? 'border-blue-400 bg-blue-900/20' : 'border-blue-400 bg-blue-50')
          : (darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white')
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Upload Excel/CSV File
      </h2>
      
      <div className="text-center mb-4">
        <div className={`text-4xl mb-2 ${isDragging ? 'animate-bounce' : ''}`}>📁</div>
        <p className={`text-lg mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {isDragging ? 'Drop your file here!' : 'Drag & drop your file here'}
        </p>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>or</p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="mb-4 w-full"
      />
      
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Expected columns: Employee Name, Employee ID, Cost Centre, Training Date, Training Hours
      </p>
    </div>
  );
};

export default FileUpload;