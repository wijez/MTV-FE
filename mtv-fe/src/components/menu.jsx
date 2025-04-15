import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRoundPlus, BellPlus, Eye, Telescope, ChartLine, FileChartColumn } from 'lucide-react';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className='flex flex-col items-center justify-center text-2xl text-blue-700 font-bold h-16'>
      <h1>MTV</h1>
    </div>
    <div className="pt-1 bg-white text-gray-800 h-screen p-4 flex flex-col space-y-4 transform text-sm transition-transform md:relative md:translate-x-0 overflow-y-auto">
      <button
        className="flex items-center space-x-2 hover:bg-blue-600 hover:text-white p-3 rounded transition cursor-pointer"
        onClick={() => navigate('/teacher')}
      >
        <UserRoundPlus />
        <span>Tạo giảng viên</span>
      </button>
      <button
        className="flex items-center space-x-2 hover:bg-blue-600 hover:text-white p-3 rounded transition cursor-pointer"
        onClick={() => navigate('/notifications')}
      >
        <BellPlus />
        <span>Thông báo</span>
      </button>
      <button
        className="flex items-center space-x-2 hover:bg-blue-600 hover:text-white p-3 rounded transition cursor-pointer"
        onClick={() => navigate('/funding-requests')}
      >
        <Eye />
        <span>Xem đề xuất kinh phí</span>
      </button>
      <button
        className="flex items-center space-x-2 hover:bg-blue-600 hover:text-white p-3 rounded transition cursor-pointer"
        onClick={() => navigate('/scientific-requests')}
      >
        <Telescope />
        <span>Xem yêu cầu Nghiên cứu</span>
      </button>
      <button
        className="flex items-center space-x-2 hover:bg-blue-600 hover:text-white p-3 rounded transition cursor-pointer"
        onClick={() => navigate('/scientific-requests')}
      >
        <ChartLine />
        <span>Thống kê chi tiết</span>
      </button>
      <button
        className="flex items-center space-x-2 hover:bg-blue-600 hover:text-white p-3 rounded transition cursor-pointer"
        onClick={() => navigate('/scientific-contracts')}
      >
        <FileChartColumn />
        <span>Hướng dẫn Nghiên cứu</span>
      </button>
    </div>
    </>
  );
};

export default Menu;