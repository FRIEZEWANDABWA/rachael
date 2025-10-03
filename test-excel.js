const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const filePath = 'C:\\Users\\Frieze\\Downloads\\FEE Codes For Employees.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  console.log('📊 Excel File Analysis:');
  console.log('Sheet Name:', sheetName);
  console.log('Total Rows:', jsonData.length);
  console.log('\n📋 Column Headers:');
  if (jsonData.length > 0) {
    console.log(Object.keys(jsonData[0]));
  }
  
  console.log('\n📝 First 3 rows of data:');
  console.log(JSON.stringify(jsonData.slice(0, 3), null, 2));

  console.log('\n🔍 Compatibility Check for HR Training Tracker:');
  const requiredFields = ['Employee Name', 'Employee ID', 'Cost Centre', 'Training Date', 'Training Hours'];
  const availableFields = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
  
  requiredFields.forEach(field => {
    const found = availableFields.some(available => 
      available.toLowerCase().includes(field.toLowerCase().replace(' ', ''))
    );
    console.log(`${found ? '✅' : '❌'} ${field}: ${found ? 'Compatible' : 'Not found'}`);
  });

} catch (error) {
  console.error('Error reading Excel file:', error.message);
}