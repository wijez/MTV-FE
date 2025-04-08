import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRoundPlus, BellPlus, Eye, Telescope, ChartLine, FileChartColumn } from 'lucide-react';

const Menu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Nút Toggle Menu */}
      <button
        className=" bg-blue-700 top-2 left-3 flex justify-between items-center p-4 text-white fixed z-50 rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✖' : '☰'}
      </button>

      {/* Menu */}
      <div
        className={`pt-10 bg-blue-500 text-white w-64 h-screen p-4 flex flex-col space-y-4 fixed top-0 left-0 z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform md:relative md:translate-x-0`}
      >
        <button
          className="flex items-center space-x-2 hover:bg-blue-600 p-2 rounded transition"
          onClick={() => navigate('/create-teacher')}
        >
          <UserRoundPlus />
          <span>Tạo giảng viên</span>
        </button>
        <button
          className="flex items-center space-x-2 hover:bg-blue-600 p-2 rounded transition"
          onClick={() => navigate('/notifications')}
        >
          <BellPlus />
          <span>Thông báo</span>
        </button>
        <button
          className="flex items-center space-x-2 hover:bg-blue-600 p-2 rounded transition"
          onClick={() => navigate('/funding')}
        >
          <Eye />
          <span>Xem đề xuất kinh phí</span>
        </button>
        <button
          className="flex items-center space-x-2 hover:bg-blue-600 p-2 rounded transition"
          onClick={() => navigate('/scientific-requests')}
        >
          <Telescope />
          <span>Xem yêu cầu NCKH</span>
        </button>
        <button
          className="flex items-center space-x-2 hover:bg-blue-600 p-2 rounded transition"
          onClick={() => navigate('/statistics')}
        >
          <ChartLine />
          <span>Thống kê chi tiết</span>
        </button>
        <button
          className="flex items-center space-x-2 hover:bg-blue-600 p-2 rounded transition"
          onClick={() => navigate('/scientific-contracts')}
        >
          <FileChartColumn />
          <span>HĐ-NCKH</span>
        </button>
      </div>
    </>
  );
};

export default Menu;