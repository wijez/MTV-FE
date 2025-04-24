import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useUserResearch } from '../../hook/Hook'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Statistical({ userId }) {
  const { researchList, loading } = useUserResearch(userId); 
  const [yearChartData, setYearChartData] = useState(null);
  const [monthChartData, setMonthChartData] = useState(null);
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (loading || !researchList.length) return;

    // Gom nhóm theo năm, tháng và status
    const statsYear = {};
    const statsMonth = {};
    researchList.forEach((item) => {
      if (!item.created_at || !item.status) return;
      const date = new Date(item.created_at);
      const year = date.getFullYear();
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      // Theo năm
      statsYear[year] = statsYear[year] || { OPEN: 0, COMPLETE: 0, UN_COMPLETE: 0 };
      statsYear[year][item.status] = (statsYear[year][item.status] || 0) + 1;
      // Theo tháng
      statsMonth[month] = statsMonth[month] || { OPEN: 0, COMPLETE: 0, UN_COMPLETE: 0 };
      statsMonth[month][item.status] = (statsMonth[month][item.status] || 0) + 1;
    });

    // Chuẩn bị dữ liệu cho biểu đồ theo năm
    const years = Object.keys(statsYear).sort();
    setYearChartData({
      labels: years,
      datasets: [
        {
          label: 'OPEN',
          data: years.map(y => statsYear[y]?.OPEN || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          stack: 'Stack 0',
        },
        {
          label: 'COMPLETE',
          data: years.map(y => statsYear[y]?.COMPLETE || 0),
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          stack: 'Stack 0',
        },
        {
          label: 'UN_COMPLETE',
          data: years.map(y => statsYear[y]?.UN_COMPLETE || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          stack: 'Stack 0',
        },
      ],
    });

    // Chuẩn bị dữ liệu cho biểu đồ theo tháng
    const months = Object.keys(statsMonth).sort();
    setMonthChartData({
      labels: months,
      datasets: [
        {
          label: 'OPEN',
          data: months.map(m => statsMonth[m]?.OPEN || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          stack: 'Stack 0',
        },
        {
          label: 'COMPLETE',
          data: months.map(m => statsMonth[m]?.COMPLETE || 0),
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          stack: 'Stack 0',
        },
        {
          label: 'UN_COMPLETE',
          data: months.map(m => statsMonth[m]?.UN_COMPLETE || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          stack: 'Stack 0',
        },
      ],
    });

    setOptions({
      responsive: true,
      plugins: {
        legend: { position: 'top' },
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true },
      },
    });
  }, [researchList, loading]);

  return (
    <div className="flex flex-col gap-8 items-center justify-center p-4 bg-white shadow-lg rounded-lg w-full h-full mx-auto md:p-10">
      <div className="w-full">
        <h4 className="font-semibold mb-2">Biểu đồ nghiên cứu theo năm</h4>
        {yearChartData ? (
          <Bar data={yearChartData} options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: 'Thống kê nghiên cứu theo năm' } } }} />
        ) : (
          <div className="text-center text-blue-500">Đang tải thống kê...</div>
        )}
      </div>
      <div className="w-full">
        <h4 className="font-semibold mb-2">Biểu đồ nghiên cứu theo tháng</h4>
        {monthChartData ? (
          <Bar data={monthChartData} options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: 'Thống kê nghiên cứu theo tháng' } } }} />
        ) : (
          <div className="text-center text-blue-500">Đang tải thống kê...</div>
        )}
      </div>
    </div>
  );
}
