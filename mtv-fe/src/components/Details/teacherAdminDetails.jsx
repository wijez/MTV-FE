import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserDetails, fetchUserScientificResearch,  fetchScientificResearchDetails } from '../../api/api';
import  UndefineImage  from '../../assets/undefine.png';
export default function TeacherAdminDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [completedResearch, setCompletedResearch] = useState([]);
  const [totalPoint, setTotalPoint] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserDetails(id);
      setUser(userData);

      const joinedList = await fetchUserScientificResearch(id);

      // Lấy chi tiết từng nghiên cứu
      const detailPromises = joinedList.map(async (item) => {
        const detail = await fetchScientificResearchDetails(item.scientific_research);
        return { ...detail, point: item.point }; 
      });
      const allResearch = await Promise.all(detailPromises);
  
      const completed = allResearch.filter(r => r.status === 'COMPLETE');
      setCompletedResearch(completed);

      const sum = completed.reduce((acc, cur) => acc + (typeof cur.point === 'number' ? cur.point : 0), 0);
      setTotalPoint(sum);
    };
    fetchData();
  }, [id]);

  return (
    <>
<div className="p-6 flex flex-col items-center h-[90vh] overflow-y-auto">
<h2 className="text-2xl font-bold mb-4 text-center">Thông tin chi tiết giảng viên</h2>
      {user && (
        <>
         <div className="mb-6 border-b pb-4 flex justify-center">
            <img
              src={user.avatar || UndefineImage}
              alt=""
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          </div>
          <div className="mb-6 border-b pb-4 text-start">
          <p><strong>Họ tên:</strong> {user.full_name || 'Chưa cập nhật'}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Trạng thái:</strong> {user.is_active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</p>
          <p><strong>Ngày tạo tài khoản:</strong> {new Date(user.date_joined).toLocaleDateString('vi-VN')}</p>
          <p><strong>Học vị:</strong> {user.profile?.degree || 'Chưa cập nhật'}</p>
          <p><strong>Phòng ban:</strong> {user.profile?.department || 'Chưa cập nhật'}</p>
          <p><strong>Giờ cần nghiên cứu:</strong> {user.profile?.base_point ?? 0}</p>
          <p><strong>Quê quán:</strong>{user.profile?.country || 'Chưa cập nhật'}</p>
        <p><strong>Địa chỉ:</strong> {user.profile?.address || 'Chưa cập nhật'}</p>
        <p><strong>Quốc tịch:</strong> {user.profile?.nation || 'Chưa cập nhật'}</p>
        <p><strong>Tôn giáo:</strong> {user.profile?.religion || 'Chưa cập nhật'}</p>
        </div>
        </>
      )}

        <div className="flex items-center w-full justify-between mb-4 border-b pb-4">
        <h3 className="text-xl font-semibold mb-2 m-0 ">
            Nghiên cứu khoa học đã hoàn thành
        </h3>
        <span className="font-bold text-lg text-green-700">
            Tổng điểm: {totalPoint}
        </span>
        </div>
      <ul className="flex flex-col gap-4 w-full">
        {completedResearch.map((r) => (
            <li
            key={r.id}
            className="flex flex-row items-center border border-gray-300 rounded-lg p-4 shadow bg-white"
            >
            <div className="flex-1">
                <div className="font-semibold text-lg mb-1">{r.name}</div>
                <div className="text-gray-600 mb-1">{r.created_at}</div>
            </div>
            <div className="ml-6 text-right">
                <div className="text-sm text-gray-500">Số điểm</div>
                <div className="text-xl font-bold text-blue-600">{r.point ?? 'Chưa có'}</div>
            </div>
            </li>
        ))}
        </ul>
    </div>
    </>
  );
}
