import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function Statistical() {
    const data = [
        { month: 'January', hours: 20 },
        { month: 'February', hours: 15 },
        { month: 'March', hours: 25 },
        { month: 'April', hours: 30 },
        { month: 'May', hours: 20 },
        { month: 'June', hours: 10 },
        { month: 'July', hours: 5 },
        { month: 'August', hours: 15 },
        { month: 'September', hours: 20 },
        { month: 'October', hours: 25 },
        { month: 'November', hours: 30 },
        { month: 'December', hours: 35 },
      ];

      const chartData = {
        labels: data.map(item => item.month),
        datasets: [
          {
            label: 'Số giờ NCKH',
            data: data.map(item => item.hours),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Thống kê số giờ NCKH trong năm',
          },
        },
      };
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg w-full h-full mx-auto md:p-10">
        <div className="w-full">
            <Bar data={chartData} options={options} />
        </div>
    </div>
  )
}
