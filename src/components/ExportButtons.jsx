import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportButtons = ({ employees, costCentreSummary, darkMode }) => {
  const exportToCSV = () => {
    if (!employees || employees.length === 0) {
      alert('No data to export. Please add employees first.');
      return;
    }

    // Get column mapping from first employee
    const columnMapping = employees[0].columnMapping || {
      name: 'Name',
      employeeId: 'Employee ID',
      email: 'Email',
      costCentre: 'Cost Centre',
      departmentName: 'Department',
      date: 'Date',
      hours: 'Hours'
    };

    // Create dynamic headers based on available data
    const headers = [];
    const dataKeys = [];
    
    if (columnMapping.name) { headers.push(columnMapping.name); dataKeys.push('name'); }
    if (columnMapping.employeeId) { headers.push(columnMapping.employeeId); dataKeys.push('employeeId'); }
    if (columnMapping.email && employees.some(emp => emp.email)) { headers.push(columnMapping.email); dataKeys.push('email'); }
    if (columnMapping.costCentre) { headers.push(columnMapping.costCentre); dataKeys.push('costCentre'); }
    if (columnMapping.departmentName && employees.some(emp => emp.departmentName)) { headers.push(columnMapping.departmentName); dataKeys.push('departmentName'); }
    if (columnMapping.date && employees.some(emp => emp.date)) { headers.push(columnMapping.date); dataKeys.push('date'); }
    if (columnMapping.hours) { headers.push(columnMapping.hours); dataKeys.push('hours'); }
    headers.push('Days Lost');
    dataKeys.push('daysLost');

    // Employee data
    const employeeCSV = [
      headers,
      ...employees.map(emp => dataKeys.map(key => {
        if (key === 'daysLost') return emp[key].toFixed(2);
        return emp[key] || '';
      }))
    ];

    // Department summary
    const costCentreCSV = [
      ['Cost Centre', 'Department Name', 'Employee Count', 'Total Days Lost', 'Avg per Employee'],
      ...costCentreSummary.map(item => [
        item.costCentre,
        item.departmentName,
        item.employeeCount,
        item.totalDays.toFixed(2),
        (item.totalDays / item.employeeCount).toFixed(1)
      ])
    ];

    const csvContent = [
      'EMPLOYEE TRAINING RECORDS',
      ...employeeCSV.map(row => row.join(',')),
      '',
      'DEPARTMENT SUMMARY',
      ...costCentreCSV.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HR-Training-Report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (!employees || employees.length === 0) {
      alert('No data to export. Please add employees first.');
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('HR Training Time Tracker Report', 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);
    doc.text(`Total Employees: ${employees.length} | Total Days Lost: ${employees.reduce((sum, emp) => sum + emp.daysLost, 0).toFixed(2)}`, 20, 42);

    // Get column mapping
    const columnMapping = employees[0].columnMapping || {};
    
    // Dynamic headers and data for employee table
    const headers = [];
    const dataKeys = [];
    
    if (columnMapping.name) { headers.push(columnMapping.name); dataKeys.push('name'); }
    if (columnMapping.employeeId) { headers.push('ID'); dataKeys.push('employeeId'); }
    if (columnMapping.costCentre) { headers.push('Cost Centre'); dataKeys.push('costCentre'); }
    if (columnMapping.departmentName && employees.some(emp => emp.departmentName)) { headers.push('Department'); dataKeys.push('departmentName'); }
    if (columnMapping.hours) { headers.push('Hours'); dataKeys.push('hours'); }
    headers.push('Days Lost');
    dataKeys.push('daysLost');

    const employeeData = employees.map(emp => 
      dataKeys.map(key => {
        if (key === 'daysLost') return emp[key].toFixed(2);
        return emp[key] || '';
      })
    );

    // Employee table
    doc.autoTable({
      head: [headers],
      body: employeeData,
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 }
    });

    // Department summary
    const deptData = costCentreSummary.map(item => [
      item.costCentre,
      item.departmentName,
      item.employeeCount.toString(),
      item.totalDays.toFixed(2),
      (item.totalDays / item.employeeCount).toFixed(1)
    ]);
    
    doc.autoTable({
      head: [['Cost Centre', 'Department', 'Employees', 'Days Lost', 'Avg/Employee']],
      body: deptData,
      startY: doc.lastAutoTable.finalY + 15,
      theme: 'striped',
      headStyles: { fillColor: [231, 76, 60] },
      styles: { fontSize: 8 }
    });

    doc.save(`HR-Training-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <button
        onClick={exportToCSV}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
      >
        📊 Export CSV
      </button>
      <button
        onClick={exportToPDF}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
      >
        📄 Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;