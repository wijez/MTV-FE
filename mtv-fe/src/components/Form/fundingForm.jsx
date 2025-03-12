import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

export default function FundingForm() {
    const [reasons] = useState(['Lý do 1', 'Lý do 2', 'Lý do 3']);
    const [researchProjects, setResearchProjects] = useState([
        { id: '1', tt_hk: 'NCKH-1' },
    ]);
    const [formData, setFormData] = useState({
        reason: '',
        amount: '',
        research: '',
        content: '',
        notes: '',
    });

    const navigate = useNavigate();
    
    useEffect(() => {
        // Fetch research projects from the NCKH table
        axios.get('/api/nckh')
          .then(response => {
            if (Array.isArray(response.data)) {
                const projects = response.data.map(project => ({
                  id: project.id,
                  tt_hk: project.tt_hk,
                }));
                setResearchProjects(projects);
              } else {
                console.error('API response is not an array:', response.data);
              }
          })
          .catch(error => {
            console.error('There was an error fetching the research projects!', error);
          });
      }, []);

      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [id]: value,
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/sponsorship_proposal', formData)
          .then(response => {
            toast.success('Đăng ký thành công!');
            // Reset form data
            setFormData({
              reason: '',
              amount: '',
              research: '',
              content: '',
              notes: '',
            });
            setTimeout(() => {
              navigate('/home');
            }, 2000);
          })
          .catch(error => {
            toast.error('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
          });
      };
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Đề xuất kinh phí</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">Tiêu đề lý do đề xuất</label>
          <select
            id="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn lý do</option>
            {reasons.map((reason, index) => (
              <option key={index} value={reason}>{reason}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="amount">Số kinh phí</label>
          <input
            type="number"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập số kinh phí"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="research">Chọn NCKH</label>
          <select
            id="research"
            value={formData.research}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn NCKH</option>
            {researchProjects.map((project, index) => (
              <option key={index} value={project.id}>{project.tt_hk}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="content">Nội dung</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập nội dung"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="notes">Ghi chú thêm</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập ghi chú thêm"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đăng ký
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}
