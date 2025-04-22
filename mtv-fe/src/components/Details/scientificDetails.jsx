import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderPage from '../header';
import { fetchScientificResearchDetails, uploadDocuments, 
  uploadBanner, sendScientificProcessingRequest } from '../../api/api'; 
import JSZip from 'jszip'; 
import { toast } from 'react-toastify';

export default function ScientificDetails() {
  const { id } = useParams();
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDocInput, setShowDocInput] = useState(false);
  const [showBannerInput, setShowBannerInput] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [modalPreview, setModalPreview] = useState(null); // Thêm state cho modal
  const minioHost = import.meta.env.VITE_MINIO_HOST;
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Tạo xem trước cho từng file
    const previews = files.map(file => {
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
        // Đọc nội dung text
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve({ type: 'text', content: reader.result, name: file.name });
          reader.readAsText(file);
        });
      }
      // Các loại khác chỉ xem tên
      return { type: 'other', name: file.name };
    });

    // Nếu có file text, chờ đọc xong
    Promise.all(previews).then(setFilePreviews);
  };

  const handleSendRequest = async () => {
    if (research.status === 'PROCESS') {
      toast.info('Bạn đã gửi yêu cầu, hãy để admin xem xét!');
      return;
    }
    if (research.status === 'COMPLETE') {
      toast.warn('Nghiên cứu đã hoàn thành, không thể gửi yêu cầu!');
      return;
    }
    try {
      await sendScientificProcessingRequest(research.id, research);
      toast.success('Gửi yêu cầu thành công!');
      setResearch({ ...research, status: 'PROCESS' });
    } catch (err) {
      toast.error('Gửi yêu cầu thất bại!');
    }
  };

  const handleUploadDocuments = async () => {
    if (!selectedFiles.length) return;
    try {
      const zip = new JSZip();
      selectedFiles.forEach(file => {
        zip.file(file.name, file);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      await uploadDocuments(research.id, new File([zipBlob], 'documents.zip', { type: 'application/zip' }));
      alert('Tải tệp đính kèm thành công!');
      setShowDocInput(false);
      setSelectedFiles([]);
      setFilePreviews([]);
      // Có thể reload lại chi tiết nếu muốn
    } catch (err) {
      alert('Tải tệp đính kèm thất bại!');
    }
  };

  const handleUploadBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadBanner(research.id, file);
      alert('Tải banner thành công!');
      setShowBannerInput(false);
      // Có thể reload lại chi tiết nếu muốn
    } catch (err) {
      alert('Tải banner thất bại!');
    }
  };

  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        const response = await fetchScientificResearchDetails(id);
        setResearch(response);
        setLoading(false);
      } catch (error) {
        setError('Không thể tải chi tiết nghiên cứu.');
        setLoading(false);
      }
    };

    fetchResearchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-yellow-500 text-6xl mb-4">⏳</div>
        <p className="text-gray-500 text-lg text-center">Đang tải chi tiết nghiên cứu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg text-center">{error}</p>
      </div>
    );
  }
  if (!research) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg text-center">Không tìm thấy dữ liệu nghiên cứu.</p>
      </div>
    );
  }

  return (
    <>
      <HeaderPage />
      {/* Modal xem trước file */}
      {modalPreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative overflow-auto max-h-[80vh]">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-red-500"
              onClick={() => setModalPreview(null)}
            >
              ×
            </button>
            <div>
              <div className="font-bold mb-2">{modalPreview.name}</div>
              {modalPreview.type === 'image' && (
                <img src={modalPreview.url} alt={modalPreview.name} className="max-w-full max-h-[70vh] mx-auto" />
              )}
              {modalPreview.type === 'video' && (
                <video src={modalPreview.url} controls className="max-w-full max-h-[70vh] mx-auto" />
              )}
              {modalPreview.type === 'pdf' && (
                <iframe src={modalPreview.url} title={modalPreview.name} className="w-full h-[70vh] border" />
              )}
              {modalPreview.type === 'text' && (
                <pre className="bg-gray-100 p-4 rounded max-h-[70vh] overflow-auto">{modalPreview.content}</pre>
              )}
              {modalPreview.type === 'other' && (
                <span className="italic text-gray-500">Không thể xem trước nội dung</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pt-20 container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cột trái: Thông tin nghiên cứu */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{research.name}</h1>
            <p><strong>Trạng thái:</strong> {research.status}</p>
            <p><strong>Mô tả:</strong> {research.description}</p>
            <p><strong>Thời gian tạo:</strong> {new Date(research.created_at).toLocaleDateString('vi-VN')}</p>
            <p><strong>Số lượng thành viên:</strong> {research.number_member}</p>
            
           
            {showDocInput && (
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  className="block"
                  onChange={handleFileChange}
                  onClick={e => e.stopPropagation()}
                />
                {/* Xem trước tên file */}
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <strong>File sẽ nén:</strong>
                    <ul className="list-disc ml-6">
                      {filePreviews.map((preview, idx) => (
                        <li key={idx} className="mb-2">
                          <div
                            className="font-semibold cursor-pointer hover:underline"
                            onClick={() => setModalPreview(preview)}
                          >
                            {preview.name}
                          </div>
                          {preview.type === 'image' && (
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="max-w-xs max-h-40 border my-2 cursor-pointer"
                              onClick={() => setModalPreview(preview)}
                            />
                          )}
                          {preview.type === 'video' && (
                            <video
                              src={preview.url}
                              controls
                              className="max-w-xs max-h-40 border my-2 cursor-pointer"
                              onClick={() => setModalPreview(preview)}
                            />
                          )}
                          {preview.type === 'pdf' && (
                            <iframe
                              src={preview.url}
                              title={preview.name}
                              className="w-60 h-40 border my-2 cursor-pointer"
                              onClick={() => setModalPreview(preview)}
                            ></iframe>
                          )}
                          {preview.type === 'text' && (
                            <pre
                              className="bg-gray-100 p-2 rounded max-h-40 overflow-auto my-2 cursor-pointer"
                              onClick={() => setModalPreview(preview)}
                            >
                              {preview.content}
                            </pre>
                          )}
                          {preview.type === 'other' && (
                            <span className="italic text-gray-500">Không thể xem trước nội dung</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                      onClick={handleUploadDocuments}
                    >
                      Xác nhận tải lên
                    </button>
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mt-2 ml-2"
                      onClick={() => { setShowDocInput(false); setSelectedFiles([]); setFilePreviews([]); }}
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            )}

           
            {/* Tệp đính kèm  */}
            <div className="mt-6">
  <h2 className="text-xl font-semibold mb-4">Tài liệu nghiên cứu</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {Array.isArray(research.data) && research.data.map((url, index) => (
      <div key={index} className="border border-gray-300 rounded p-2">
        {url.match(/\.(jpeg|jpg|gif|png)$/) ? (
          <img
            src={`${minioHost}/${url}`}
            alt={`File ${index + 1}`}
            className="w-full h-auto max-h-64 object-contain cursor-pointer"
            onClick={() => setModalPreview({ type: 'image', url: `${minioHost}/${url}`, name: url })}
          />
        ) : url.match(/\.(mp4|webm|ogg|mkv)$/) ? (
          <video
            src={`${minioHost}/${url}`}
            controls
            className="w-full h-auto max-h-64 object-contain cursor-pointer"
            onClick={() => setModalPreview({ type: 'video', url: `${minioHost}/${url}`, name: url })}
          />
        ) : url.match(/\.(pdf)$/) ? (
          <iframe
            src={`${minioHost}/${url}`}
            title={`PDF file ${index + 1}`}
            className="w-full h-64 border border-gray-300 rounded cursor-pointer"
            onClick={() => setModalPreview({ type: 'pdf', url: `${minioHost}/${url}`, name: url })}
          ></iframe>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-gray-700 text-sm mb-2">Không thể xem trước tệp này:</p>
            <a
              href={`${minioHost}/${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Xem file {index + 1}
            </a>
          </div>
        )}
      </div>
    ))}
  </div>
</div>
            {/* Nút thêm banner */}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-4 p-2 mr-2"
              onClick={() => setShowBannerInput(true)}
            >
              Thêm banner
            </button>
            {/* Nút thêm tệp đính kèm */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4 mr-2"
              onClick={() => setShowDocInput(true)}
            >
              Thêm tệp đính kèm
            </button>
            {/* Nút gửi yêu cầu */}
            {research.status !== 'COMPLETE' && (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mt-6"
              onClick={handleSendRequest}
            >
              Gửi yêu cầu
            </button>
            )}  
          </div>

          {/* Cột phải: Nội dung sr_activities */}
          <div className="bg-gray-50 rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">Thông tin hoạt động NCKH</h2>
            <p><strong>Nhóm:</strong> {research.sr_activities?.group}</p>
            <p><strong>Nội dung:</strong> {research.sr_activities?.content}</p>
            <div className="mt-2">
              <strong>Chi tiết các mức hỗ trợ:</strong>
              <ul className="list-disc ml-6">
                {Array.isArray(research.sr_activities?.input) && research.sr_activities.input.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    {item.note && <div><strong>Ghi chú:</strong> {item.note}</div>}
                    {item.proof && <div><strong>Minh chứng:</strong> {item.proof}</div>}
                    {item.value && Object.keys(item.value).length > 0 && (
                      <div>
                        <strong>Giá trị:</strong>
                        <ul className="list-disc ml-6">
                          {Object.entries(item.value).map(([k, v]) => (
                            <li key={k}>{k}: <span className="font-semibold">{v}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}