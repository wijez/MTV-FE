import React, { useEffect, useState } from 'react';
import { fetchScientificResearch, getListScientificActivities, createSponsorshipProposal, fetchUserScientificResearch } from '../../api/api';

export default function FundingForm({ setShowFormModal }) {
  const [formData, setFormData] = useState({
    s_research: '',
    funding: '',
    context: '',
    status: 'OPEN',
  });
  const [nckhOptions, setNckhOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [studentGuidanceList, setStudentGuidanceList] = useState([]);

  // Lấy danh sách NCKH từ API
  useEffect(() => {
    const fetchNckhOptions = async () => {
      try {
        // Lấy userId hiện tại
        const userId = localStorage.getItem('userId');
        // Lấy các bản ghi user-scientific-research của user
        const userResearchList = await fetchUserScientificResearch(userId);
        // Lọc các nghiên cứu mà user là chủ nhiệm
        const leaderResearch = userResearchList.filter(item => item.is_leader);
  
        // Lấy toàn bộ danh sách nghiên cứu khoa học
        const allResearch = await fetchScientificResearch();
        // Tạo map id -> name cho nhanh
        const researchMap = {};
        allResearch.data.forEach(r => {
          researchMap[r.id] = r.name;
        });
  
        // Tạo options chỉ gồm các nghiên cứu user làm chủ nhiệm
        const myResearchOptions = leaderResearch.map(item => ({
          sr_activities: item.scientific_research,
          name: researchMap[item.scientific_research] || 'Không rõ tên'
        }));
  
        setNckhOptions(myResearchOptions);
      } catch (error) {
        console.error('Lỗi khi tải danh sách NCKH:', error);
      }
    };
    fetchNckhOptions();
  }, []);

  // Lấy danh sách STUDENT_GUIDANCE để show bên phải
  useEffect(() => {
    const fetchStudentGuidance = async () => {
      try {
        const activities = await getListScientificActivities();
        const filtered = activities.filter(act => act.group === 'STUDENT_GUIDANCE');
        setStudentGuidanceList(filtered);
      } catch (error) {
        setStudentGuidanceList([]);
      }
    };
    fetchStudentGuidance();
  }, []);

  // Khi chọn NCKH, lấy group từ getListScientificActivities
  useEffect(() => {
    const checkGroup = async () => {
      if (!formData.s_research) {
        setGroup('');
        setShowWarning(false);
        return;
      }
      try {
        const activities = await getListScientificActivities();
        // Tìm hoạt động có id trùng với sr_activities
        const found = activities.find(act => act.id === formData.s_research);
        if (found) {
          setGroup(found.group);
          setShowWarning(found.group !== 'STUDENT_GUIDANCE');
        } else {
          setGroup('');
          setShowWarning(true);
        }
      } catch (error) {
        setGroup('');
        setShowWarning(true);
      }
    };
    checkGroup();
  }, [formData.s_research]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createSponsorshipProposal(formData);
      alert('Đề xuất tài trợ đã được tạo thành công!');
      setShowFormModal(false);
    } catch (error) {
      console.error('Lỗi khi tạo đề xuất tài trợ:', error);
      alert('Không thể tạo đề xuất tài trợ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] flex gap-6">
        {/* Form bên trái */}
        <div className="w-1/2">
          <h2 className="text-xl font-bold mb-4">Tạo đề xuất tài trợ</h2>
          <form onSubmit={handleSubmit}>
            {/* Tên NCKH */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="s_research">
                Tên Nghiên cứu
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="s_research"
                name="s_research"
                value={formData.s_research}
                onChange={handleChange}
                required
              >
                <option value="">Chọn Tên Nghiên cứu</option>
                {nckhOptions.map((option) => (
                  <option key={option.sr_activities} value={option.sr_activities}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Thông báo nếu không phải nhóm STUDENT_GUIDANCE */}
            {showWarning && (
              <div className="mb-4 text-red-500 text-sm">
                Nghiên cứu này không được đề xuất kinh phí
              </div>
            )}

            {/* Kinh phí đề xuất */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="funding">
                Kinh phí đề xuất
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="funding"
                name="funding"
                type="number"
                placeholder="Kinh phí đề xuất"
                value={formData.funding}
                onChange={handleChange}
                required
                disabled={showWarning}
              />
            </div>

            {/* Nội dung */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="context">
                Nội dung
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="context"
                name="context"
                placeholder="Nội dung"
                value={formData.context}
                onChange={handleChange}
                required
                disabled={showWarning}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                type="submit"
                disabled={loading || showWarning}
              >
                {loading ? 'Đang tải...' : 'Tạo'}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                type="button"
                onClick={() => setShowFormModal(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
        {/* Danh sách STUDENT_GUIDANCE bên phải */}
        <div className="w-1/2 border-l pl-6 max-h-[500px] overflow-auto">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Các đề tài nhóm Hướng dẫn sinh viên</h3>
          {studentGuidanceList.length === 0 ? (
            <div className="text-gray-400">Không có dữ liệu.</div>
          ) : (
            <ul className="space-y-2">
              {studentGuidanceList.map(item => (
                <li key={item.id} className="border rounded p-2 bg-gray-50">
                  <div className="font-medium">{item.content}</div>
                  <div className="text-xs text-gray-500">ID: {item.id}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}