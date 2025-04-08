import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ScientificForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    number_member: '',
    description: '',
    status: 'OPEN',
    level: '',
    quantity: '',
    time_volume: '',
    banner: [],
    sr_activities: '',
  });
  const [uploading, setUploading] = useState(false);
  const [activities, setActivities] = useState([]); 
  const [selectedActivity, setSelectedActivity] = useState(null); 
  
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'scientific'); 
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      formData
    );
  
    return response.data.secure_url; // Trả về URL của file đã upload
  };
  
  const handleFileUpload = async (e) => {
    const files = e.target.files; // Lấy danh sách file
    if (!files || files.length === 0) return;
  
    try {
      setUploading(true); // Đặt trạng thái đang upload
      const uploadedUrls = [];
  
      for (const file of files) {
        const url = await uploadToCloudinary(file); // Upload từng file lên Cloudinary
        uploadedUrls.push(url); // Lưu URL vào mảng
      }
  
      setFormData((prev) => ({
        ...prev,
        banner: [...prev.banner, ...uploadedUrls], // Thêm các URL mới vào mảng banner
      }));
  
      toast.success('Tải lên thành công!');
    } catch (error) {
      toast.error('Tải lên thất bại. Vui lòng thử lại.');
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false); // Kết thúc trạng thái upload
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form...', formData);
    try {
      const response = await axios.post('http://127.0.0.1:8000/scientific_research/', formData);
      toast.success('Tạo nghiên cứu khoa học thành công!');
      console.log('API Response:', response.data);
      onSubmit(response.data);
    } catch (error) {
      if(error.response && error.response.data) {
        toast.error(`Lỗi ${error.response.status}: ${error.response.data.message}`);
      } else {
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
      console.error('Error creating scientific research:', error);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/scientific_research_activities/');
        setActivities(response.data); 
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Không thể tải danh sách hoạt động NCKH.');
      }
    };

    fetchActivities();
  }, []);

   // Xử lý khi chọn một hoạt động
   const handleActivityChange = (e) => {
    const activityId = e.target.value;
    setFormData({ ...formData, sr_activities: activityId });

    // Tìm thông tin chi tiết của hoạt động được chọn
    const activity = activities.find((act) => act.id === activityId);
    setSelectedActivity(activity || null);
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[90vh] relative"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Tạo Nghiên Cứu</h2>

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

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="number_member">
            Số Lượng Thành Viên
          </label>
          <input
            type="number"
            id="number_member"
            name="number_member"
            value={formData.number_member}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Mô Tả
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="level">
              Cấp Độ
            </label>
            <input
              type="text"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">
              Số Lượng
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="number_member">
            Thời gian 
          </label>
          <input
            type="number"
            id="time_volume"
            name="time_volume"
            value={formData.time_volume}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="banner">
              Banner (URL)
            </label>
            <input
              type="file"
              id="banner"
              name="banner"
              onChange={handleFileUpload}
              accept="*/*"
              multiple
              disabled={uploading} 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
  {formData.banner.length > 0 && (
  <div className="mt-4">
    <p className="text-green-500 text-sm mb-2">Các file đã tải lên:</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {formData.banner.map((url, index) => (
        <div key={index} className="border border-gray-300 rounded p-2">
          {url.match(/\.(jpeg|jpg|gif|png)$/) ? (
            // Hiển thị ảnh
            <img
              src={url}
              alt={`Uploaded file ${index + 1}`}
              className="w-full h-auto max-h-64 object-contain"
            />
          ) : url.match(/\.(mp4|webm|ogg|mkv)$/) ? (
            // Hiển thị video
            <video
              src={url}
              controls
              className="w-full h-auto max-h-64 object-contain"
            />
          ) : url.match(/\.(pdf)$/) ? (
            // Hiển thị PDF
            <iframe
              src={url}
              title={`PDF file ${index + 1}`}
              className="w-full h-64 border border-gray-300 rounded"
            ></iframe>
          ) : url.match(/\.(doc|docx|xls|xlsx|txt)$/) ? (
            // Hiển thị file Word, Excel, hoặc văn bản
            <iframe
              src={`https://docs.google.com/gview?url=${url}&embedded=true`}
              title={`File ${index + 1}`}
              className="w-full h-64"
            ></iframe>
          ) : (
            // Hiển thị file khác
            <div className="flex flex-col items-center">
              <p className="text-gray-700 text-sm mb-2">Không thể xem trước tệp này:</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Xem tệp {index + 1}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="sr_activities">
            Hoạt Động NCKH (ID)
          </label>
          <select
            id="sr_activities"
            name="sr_activities"
            value={formData.sr_activities}
            onChange={handleActivityChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
           <option value="">Chọn một hoạt động</option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.group} - {activity.content}
              </option>
            ))}
          </select>
        </div>

        {selectedActivity && (
          <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-100">
            <h3 className="text-lg font-bold mb-2">Thông Tin Chi Tiết</h3>
            <p><strong>Nhóm:</strong> {selectedActivity.group}</p>
            <p><strong>Nội dung:</strong> {selectedActivity.content}</p>
            <p><strong>Thời gian chuyển đổi:</strong> {selectedActivity.conversion_time} phút</p>
            <p><strong>Bằng chứng:</strong> {selectedActivity.proof}</p>
            <p><strong>Ghi chú:</strong> {selectedActivity.note}</p>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full sm:w-auto"
        >
          Tạo
        </button>
      </form>
    </div>
  );
}