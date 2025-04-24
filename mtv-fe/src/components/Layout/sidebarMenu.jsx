import React from 'react';
import { Coins, BookPlus, LaptopMinimalCheck, ChartNoAxesCombined } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { Icon: Coins, label: 'Đề xuất kinh phí', link: '/funding' },
  { Icon: BookPlus, label: 'Tạo nghiên cứu', link: '/scientific' },
  { Icon: LaptopMinimalCheck, label: 'Nghiên cứu đã hoàn thành', link: '/scientific-success' },
  { Icon: ChartNoAxesCombined, label: 'Báo cáo chi tiết', link: '/report' },
];

export default function SidebarMenu() {
  const navigate = useNavigate();
  return (
    <aside className="bg-white shadow-lg rounded-2xl p-4 w-full md:w-60 flex flex-col gap-2">
      {menuItems.map(({ Icon, label, link }) => (
        <button
          key={label}
          onClick={() => navigate(link)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-100 transition text-left font-medium text-gray-700"
        >
          <Icon className="w-5 h-5 text-blue-500" />
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}