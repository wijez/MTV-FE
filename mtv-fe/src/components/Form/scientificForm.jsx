import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ResearchQuestions from '../Common/researchQuestions';
import { createScientificResearch, searchUsers, uploadDocuments } from '../../api/api';
import JSZip from 'jszip';
import { useNavigate } from 'react-router-dom'; 


const minioHost = import.meta.env.VITE_MINIO_HOST 
export default function ScientificForm({ onSubmit, onClose }) {

  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: '',
    number_member: 1,
    description: '',
    status: 'OPEN',
    quantity: '',
    time_volume: '',
    documents: '',
    data: {},
    sr_activities: '',
    list_user: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [createdResearchId, setCreatedResearchId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [modalPreview, setModalPreview] = useState(null);

  // Nhận dữ liệu từ ResearchQuestions
  const handleActivitySelect = (selectedData) => {
    setFormData((prev) => ({
      ...prev,
      data: selectedData,
      sr_activities: selectedData.activityId,
      time_volume: selectedData.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (currentStep === 1 && !formData.name.trim()) {
      toast.error('Vui lòng nhập tên nghiên cứu!');
      return;
    }

    if (currentStep === 2 && (!formData.sr_activities || !formData.time_volume)) {
      toast.error('Vui lòng chọn hoạt động NCKH!');
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => prev - 1);
  };

  const handleUserSearch = async () => {
    try {
      const response = await searchUsers(userSearch);
      let users = [];
      if (Array.isArray(response)) {
        users = response;
      } else if (Array.isArray(response.data)) {
        users = response.data;
      }
      setUserResults(users);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      toast.error('Không thể tìm kiếm người dùng.');
      setUserResults([]);
    }
  };

  const handleAddUser = (user) => {
    if (!formData.list_user.some((u) => u.id === user.id)) {
      setFormData((prev) => ({
        ...prev,
        list_user: [...prev.list_user, { id: user.id, point: 0 }],
        number_member: prev.list_user.length + 1,
      }));
      setUserDetails((prev) => ({
        ...prev,
        [user.id]: user.full_name,
      }));
    }
  };

  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      list_user: prev.list_user.filter((u) => u.id !== userId),
      number_member: prev.list_user.filter((u) => u.id !== userId).length,
    }));
    setUserDetails((prev) => {
      const updatedDetails = { ...prev };
      delete updatedDetails[userId];
      return updatedDetails;
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  
    const previews = files.map((file) => {
      if (file.type.startsWith('image/')) {
        return { type: 'image', url: URL.createObjectURL(file), name: file.name };
      }
      if (file.type.startsWith('video/')) {
        return { type: 'video', url: URL.createObjectURL(file), name: file.name };
      }
      if (file.type === 'application/pdf') {
        return { type: 'pdf', url: URL.createObjectURL(file), name: file.name };
      }
      if (file.type.startsWith('text/')) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({ type: 'text', content: reader.result, name: file.name });
          reader.readAsText(file);
        });
      }
      return { type: 'other', name: file.name };
    });
  
    Promise.all(previews).then(setFilePreviews);
  };

  const handleUploadDocuments = async () => {
    if (!selectedFiles.length) {
      toast.error('Vui lòng chọn ít nhất một tệp');
      return;
    }
    
    try {
      const zip = new JSZip();
      selectedFiles.forEach(file => {
        zip.file(file.name, file);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      await uploadDocuments(createdResearchId, new File([zipBlob], 'documents.zip', { type: 'application/zip' }));
      
      toast.success('Tải tệp đính kèm thành công!');
      // onClose(); // Đóng form sau khi hoàn tất
      navigate(`/scientific/scientific-details/${createdResearchId}`);
      if (onSubmit) onSubmit(); // Gọi callback nếu cần
    } catch (error) {
      console.error('Lỗi khi tải tệp đính kèm:', error);
      toast.error('Tải tệp đính kèm thất bại!');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (currentStep < 3) {
      toast.error('Vui lòng hoàn thành tất cả các bước trước khi submit!');
      return;
    }
  
    if (!formData.time_volume || Number(formData.time_volume) <= 0) {
      toast.error('Vui lòng chọn hoạt động NCKH để có thời lượng hợp lệ');
      return;
    }
  
    const timeVolume = Number(formData.time_volume);
    const submitData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      number_member: Math.max(1, Number(formData.number_member) || 1),
      quantity: Math.max(0, Number(formData.quantity) || 0),
      time_volume: timeVolume,
      sr_activities: formData.sr_activities || formData.data?.activityId,
      list_user: (formData.list_user || []).map((u) => ({
        id: u.id,
        point: Math.max(0, Number(u.point) || 0),
      })),
    };
  
    const totalMemberPoints = submitData.list_user.reduce((sum, user) => sum + user.point, 0);
  
    if (totalMemberPoints > timeVolume) {
      toast.error(`Tổng điểm thành viên (${totalMemberPoints}) vượt quá thời lượng (${timeVolume})`);
      return;
    }
  
    let leader_point = timeVolume;
    if (submitData.list_user.length > 0) {
      leader_point = Math.max(0, timeVolume - totalMemberPoints);
    }
    submitData.leader_point = leader_point;
  
    console.log('Payload being sent:', submitData); // Add this line to debug the payload
  
    try {
      const response = await createScientificResearch(submitData);
      setCreatedResearchId(response.data?.id || response.id); // Lưu ID nghiên cứu vừa tạo
      toast.success('Tạo nghiên cứu khoa học thành công! Tiến hành tải tệp đính kèm...');
      setCurrentStep(4); // Chuyển sang bước tải tệp đính kèm
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Lỗi khi tạo nghiên cứu';
      console.error('Error response:', error.response?.data); // Log the error response
      toast.error(`Lỗi: ${errorMsg}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[90vh] relative"
        onSubmit={handleFormSubmit}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Tạo Nghiên Cứu</h2>

        {/* Bước 1: Thông tin cơ bản */}
        {currentStep === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Tên Nghiên Cứu
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}

        {/* Bước 2: Chọn hoạt động nghiên cứu */}
        {currentStep === 2 && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Hoạt Động Nghiên cứu</label>
              <ResearchQuestions onSelect={handleActivitySelect} />
            </div>
            {formData.time_volume && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Thời lượng (time_volume)</label>
                <input
                  type="number"
                  value={formData.time_volume}
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
            )}
          </>
        )}

        {/* Bước 3: Thêm thành viên */}
        {currentStep === 3 && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Thêm Thành Viên</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleUserSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Tìm
                </button>
              </div>
              <ul className="mt-2">
                {(userResults || []).map((user) => (
                  <li key={user.id} className="flex justify-between items-center p-2 border-b">
                    <span>{user.full_name || user.email}</span>
                    <button
                      type="button"
                      onClick={() => handleAddUser(user)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Thêm
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Danh Sách Thành Viên</label>
              <ul>
                {(formData.list_user || []).map((userObj) => (
                  <li key={userObj.id} className="flex justify-between items-center p-2 border-b">
                    <span>{userDetails[userObj.id]}</span>
                    <input
                      type="number"
                      min={0}
                      className="w-20 border rounded px-2 py-1 mx-2"
                      value={userObj.point}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          list_user: prev.list_user.map((u) =>
                            u.id === userObj.id ? { ...u, point: val } : u
                          ),
                        }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(userObj.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
              {formData.time_volume && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-700">
                    <strong>Thời lượng tổng:</strong> {formData.time_volume}
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>Đã phân bổ cho thành viên:</strong> {formData.list_user.reduce((sum, user) => sum + Number(user.point || 0), 0)}
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>Còn lại cho người tạo:</strong> {Math.max(0, Number(formData.time_volume) - formData.list_user.reduce((sum, user) => sum + Number(user.point || 0), 0))}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Bước 4: Tải tệp đính kèm (sau khi tạo nghiên cứu) */}
        {currentStep === 4 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4">Tải tệp đính kèm</h3>
            <p className="mb-4">Nghiên cứu đã được tạo thành công. Bạn có thể tải lên các tệp đính kèm.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full mb-4"
              />
              
              {/* Hiển thị preview các file đã chọn */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Các tệp sẽ được tải lên:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {filePreviews.map((preview, idx) => (
                      <li key={idx} className="flex items-center">
                        <span 
                          className="cursor-pointer hover:underline"
                          onClick={() => setModalPreview(preview)}
                        >
                          {preview.name}
                        </span>
                        {preview.type === 'image' && (
                          <img
                            src={`${minioHost}/${preview.url}`}
                            alt="Preview"
                            className="ml-2 w-10 h-10 object-cover cursor-pointer"
                            onClick={() => setModalPreview(preview)}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                  setSelectedFiles([]);
                  setFilePreviews([]);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Quay lại
              </button>
              
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onSubmit) onSubmit();
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Bỏ qua
                </button>
                <button
                  type="button"
                  onClick={handleUploadDocuments}
                  disabled={!selectedFiles.length}
                  className={`px-4 py-2 rounded ${selectedFiles.length ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Tải lên
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xem trước file */}
        {modalPreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{modalPreview.name}</h3>
              <button
                onClick={() => setModalPreview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="flex justify-center">
              {modalPreview.type === 'image' && (
                <img src={modalPreview.url} alt="Preview" className="max-h-[70vh] max-w-full" />
              )}
              {modalPreview.type === 'pdf' && (
                <iframe
                  src={modalPreview.url}
                  className="w-full h-[70vh]"
                  title="PDF Preview"
                />
              )}
              {modalPreview.type === 'video' && (
                <video controls src={modalPreview.url} className="max-h-[70vh] max-w-full" />
              )}
              {modalPreview.type === 'text' && (
                <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap max-h-[70vh] overflow-auto">
                  {modalPreview.content}
                </pre>
              )}
              {modalPreview.type === 'other' && (
                <p className="text-gray-500">Không có preview cho loại file này</p>
              )}
            </div>
          </div>
        </div>
      )}
        {/* Nút điều hướng (chỉ hiển thị khi chưa đến bước 4) */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Quay lại
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Tạo nghiên cứu
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}