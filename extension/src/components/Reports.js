import React, { useState, useEffect } from 'react';
import { getDailyReport } from '../utils/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Displays the daily productivity report.
 * @param {object} props - Component props.
 * @param {string} props.token - The user's auth token.
 */
const Reports = ({ token }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getDailyReport(token);
        setReportData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    return `${m}m`;
  };

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!reportData || reportData.length === 0) return <p>No activity recorded today.</p>;

  const chartData = {
    labels: reportData.map(log => log.domain),
    datasets: [
      {
        label: 'Time Spent',
        data: reportData.map(log => log.timeSpent),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  return (
    <div>
      <h3>Today's Activity</h3>
      <div style={{ maxWidth: '250px', margin: 'auto' }}>
        <Pie data={chartData} options={{ maintainAspectRatio: true, plugins: { legend: { display: false } } }} />
      </div>
      <br/>
      <div>
        {reportData.map(log => (
          <div key={log._id} className="report-item">
            <span>{log.domain}</span>
            <span>{formatTime(log.timeSpent)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;