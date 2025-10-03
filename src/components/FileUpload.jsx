import React, { useRef } from 'react';
import * as XLSX from 'xlsx';

const FileUpload = ({ onUpload, darkMode }) => {
  const fileInputRef = useRef();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
        fileInputRef.current.value = '';
      } catch (error) {
        alert('Error reading file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={`p-6 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Upload Excel/CSV File
      </h2>
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