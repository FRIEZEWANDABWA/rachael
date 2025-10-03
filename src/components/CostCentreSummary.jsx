import React from 'react';

const CostCentreSummary = ({ summary, darkMode }) => {
  const totalDays = summary.reduce((sum, item) => sum + item.totalDays, 0);
  const totalEmployees = summary.reduce((sum, item) => sum + item.employeeCount, 0);

  const exportDepartmentCSV = (data) => {
    const headers = ['Cost Centre', 'Department Name', 'Employee Count', 'Total Days Lost', 'Average per Employee'];
    const csvData = [
      headers,
      ...data.map(item => [
        item.costCentre,
        item.departmentName,
        item.employeeCount,
        item.totalDays.toFixed(2),
        (item.totalDays / item.employeeCount).toFixed(1)
      ]),
      ['TOTAL', '', totalEmployees, totalDays.toFixed(2), (totalDays / totalEmployees).toFixed(1)]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Department-Training-Report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportDepartmentPDF = (data, totalDays, totalEmployees) => {
    // Dynamic import for jsPDF
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('Department Training Report', 20, 25);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);
        doc.text(`${data.length} Departments | ${totalEmployees} Employees | ${totalDays.toFixed(2)} Total Days Lost`, 20, 42);

        // Department data
        const tableData = data.map(item => [
          item.costCentre,
          item.departmentName,
          item.employeeCount.toString(),
          item.totalDays.toFixed(2),
          (item.totalDays / item.employeeCount).toFixed(1)
        ]);

        doc.autoTable({
          head: [['Cost Centre', 'Department', 'Employees', 'Days Lost', 'Avg/Employee']],
          body: tableData,
          startY: 50,
          theme: 'striped',
          headStyles: { fillColor: [52, 152, 219] },
          styles: { fontSize: 9 },
          foot: [['TOTAL', '', totalEmployees.toString(), totalDays.toFixed(2), (totalDays / totalEmployees).toFixed(1)]],
          footStyles: { fillColor: [231, 76, 60], textColor: 255, fontStyle: 'bold' }
        });

        doc.save(`Department-Training-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      });
    });
  };

  return (
    <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
      <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🏢 Department Training Report
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {summary.length} departments • {totalEmployees} employees • {totalDays.toFixed(1)} total days lost
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportDepartmentCSV(summary)}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
            >
              📊 Export CSV
            </button>
            <button
              onClick={() => exportDepartmentPDF(summary, totalDays, totalEmployees)}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
            >
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cost Centre</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Department Name</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Employees</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Days Lost</th>
              <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Avg per Employee</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {summary.map((item, index) => (
              <tr key={index} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{item.costCentre}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.departmentName}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.employeeCount}</td>
                <td className="px-4 py-3 text-sm font-bold text-red-600">{item.totalDays.toFixed(2)}</td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{(item.totalDays / item.employeeCount).toFixed(1)}</td>
              </tr>
            ))}
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} font-bold border-t-2`}>
              <td colSpan="2" className={`px-4 py-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>ORGANIZATION TOTAL</td>
              <td className={`px-4 py-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalEmployees}</td>
              <td className="px-4 py-3 text-sm font-bold text-red-600 text-lg">{totalDays.toFixed(2)}</td>
              <td className={`px-4 py-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{(totalDays / totalEmployees).toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostCentreSummary;