import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportButtons = ({ employees, costCentreSummary, darkMode }) => {
  const exportToCSV = () => {
    const employeeCSV = [
      ['Employee Name', 'Employee ID', 'Cost Centre', 'Training Date', 'Training Hours', 'Days Lost'],
      ...employees.map(emp => [emp.name, emp.employeeId, emp.costCentre, emp.date, emp.hours, emp.daysLost.toFixed(2)])
    ];

    const costCentreCSV = [
      ['Cost Centre', 'Total Days Lost'],
      ...costCentreSummary.map(item => [item.centre, item.days.toFixed(2)])
    ];

    const csvContent = [
      'Employee Training Records',
      ...employeeCSV.map(row => row.join(',')),
      '',
      'Cost Centre Summary',
      ...costCentreCSV.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-days-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('HR Training Time Tracker Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    const employeeData = employees.map(emp => [
      emp.name, emp.employeeId, emp.costCentre, emp.date, emp.hours, emp.daysLost.toFixed(2)
    ]);

    doc.autoTable({
      head: [['Employee Name', 'Employee ID', 'Cost Centre', 'Training Date', 'Training Hours', 'Days Lost']],
      body: employeeData,
      startY: 50,
      theme: 'grid'
    });

    const costCentreData = costCentreSummary.map(item => [item.centre, item.days.toFixed(2)]);
    
    doc.autoTable({
      head: [['Cost Centre', 'Total Days Lost']],
      body: costCentreData,
      startY: doc.lastAutoTable.finalY + 20,
      theme: 'grid'
    });

    const totalDays = employees.reduce((sum, emp) => sum + emp.daysLost, 0);
    doc.text(`Organization Total Days Lost: ${totalDays.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 20);

    doc.save('training-days-report.pdf');
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