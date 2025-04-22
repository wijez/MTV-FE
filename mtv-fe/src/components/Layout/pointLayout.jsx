import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchUserScientificResearch } from '../../api/api';
// Thêm các dòng sau nếu chưa cài: npm install chart.js react-chartjs-2
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function groupPointsBy(researchList, type = 'year') {
  const groups = {};
  researchList.forEach(r => {
    if (!r.created_at) return;
    const date = new Date(r.created_at);
    const key = type === 'month'
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : `${date.getFullYear()}`;
    groups[key] = (groups[key] || 0) + (typeof r.point === 'number' ? r.point : 0);
  });
  return groups;
}

export default function PointLayout() {
  const [users, setUsers] = useState([]);
  const [userPoints, setUserPoints] = useState({});
  const [yearChartData, setYearChartData] = useState(null);
  const [monthChartData, setMonthChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userList = await fetchUsers();
      setUsers(userList);

      const pointsObj = {};
      const yearPoints = {};
      const monthPoints = {};

      for (const user of userList) {
        const researchList = await fetchUserScientificResearch(user.id);
        // Tổng điểm
        const totalPoint = researchList.reduce(
          (sum, r) => sum + (typeof r.point === 'number' ? r.point : 0),
          0
        );
        pointsObj[user.id] = totalPoint;

        // Theo năm
        const byYear = groupPointsBy(researchList, 'year');
        for (const [year, point] of Object.entries(byYear)) {
          yearPoints[year] = (yearPoints[year] || 0) + point;
        }

        // Theo tháng
        const byMonth = groupPointsBy(researchList, 'month');
        for (const [month, point] of Object.entries(byMonth)) {
          monthPoints[month] = (monthPoints[month] || 0) + point;
        }
      }
      setUserPoints(pointsObj);

      // Chuẩn bị dữ liệu cho biểu đồ năm
      const yearLabels = Object.keys(yearPoints).sort();
      setYearChartData({
        labels: yearLabels,
        datasets: [
          {
            label: 'Tổng điểm theo năm',
            data: yearLabels.map(y => yearPoints[y]),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
          },
        ],
      });

      // Chuẩn bị dữ liệu cho biểu đồ tháng
      const monthLabels = Object.keys(monthPoints).sort();
      setMonthChartData({
        labels: monthLabels,
        datasets: [
          {
            label: 'Tổng điểm theo tháng',
            data: monthLabels.map(m => monthPoints[m]),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
          },
        ],
      });
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Tiến độ nghiên cứu của giảng viên</h2>
      {/* Biểu đồ tổng điểm theo năm */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Biểu đồ tổng điểm theo năm */}
        <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Biểu đồ tổng điểm nghiên cứu theo năm</h3>
            {yearChartData && (
            <Bar data={yearChartData} options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }} height={200} />
            )}
        </div>
        {/* Biểu đồ tổng điểm theo tháng */}
        <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Biểu đồ tổng điểm nghiên cứu theo tháng</h3>
            {monthChartData && (
            <Bar data={monthChartData} options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }} height={200} />
            )}
        </div>
        </div>
      {/* Danh sách tiến trình từng user */}
      <div className="space-y-6">
        {users.map((user) => {
          const basePoint = user.profile?.base_point || 0;
          const point = userPoints[user.id] || 0;
          const percent = basePoint ? Math.min(100, Math.round((point / basePoint) * 100)) : 0;
          return (
            <div key={user.id} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{user.full_name}</span>
                <span className="text-sm text-gray-600">{point}/{basePoint}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">{percent}% hoàn thành</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
