# HR Training Time Tracker

A web-based application to track and calculate "days lost" when employees attend training sessions.

## Features

- **Manual Input**: Add employee training records via form
- **File Upload**: Import Excel/CSV files with training data
- **Automatic Calculation**: Converts training hours to days lost (÷ 8)
- **Interactive Dashboard**: View employee records and cost centre summaries
- **Data Visualization**: Bar and pie charts showing days lost by cost centre
- **Search & Filter**: Filter by employee name, cost centre, or date
- **Export Options**: Download reports as CSV or PDF
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: Toggle between light and dark themes

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Deployment

### GitHub + Netlify

1. Push code to GitHub repository
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy automatically on push

### File Format for Upload

Excel/CSV files should contain these columns:
- Employee Name
- Employee ID
- Cost Centre
- Training Date
- Training Hours

## Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **Charts**: Recharts
- **File Processing**: SheetJS (xlsx)
- **PDF Export**: jsPDF + jsPDF-AutoTable
- **Hosting**: Netlify-ready

## Usage

1. **Add Data**: Use manual form or upload Excel/CSV file
2. **View Results**: See calculated days lost in tables and charts
3. **Filter Data**: Search by name/cost centre or filter by date
4. **Export Reports**: Download CSV or PDF reports
5. **Toggle Theme**: Switch between light and dark modes

## Formula

**Training Days Lost = Training Hours ÷ 8**

The application automatically calculates days lost for each training session and aggregates totals by employee and cost centre.