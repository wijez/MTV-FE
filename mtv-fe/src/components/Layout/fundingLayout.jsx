import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FundingForm from '../Form/fundingForm';

export default function FundingLayout() {
    const [createdForms, setCreatedForms] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [filterTime, setFilterTime] = useState('all');
    const [newForm, setNewForm] = useState({
        ten_nckh: '',
        nckh_id: '',
        hd_nckh_id: '',
        budget: '',
        content: ''
    });
    const [nckhOptions, setNckhOptions] = useState([]);
    const [hdNckhOptions, setHdNckhOptions] = useState([]);

    useEffect(() => {
        fetchForms();
        fetchNckhOptions();
        fetchHdNckhOptions();
    }, [filterTime]);

    const fetchForms = () => {
        axios.get('/api/sponsorship_proposals')
            .then(response => {
                if (Array.isArray(response.data)) {
                    let forms = response.data;
                    if (filterTime !== 'all') {
                        const now = new Date();
                        forms = forms.filter(form => {
                            const formDate = new Date(form.created_at);
                            if (filterTime === 'last_week') {
                                return (now - formDate) / (1000 * 60 * 60 * 24) <= 7;
                            } else if (filterTime === 'last_month') {
                                return (now - formDate) / (1000 * 60 * 60 * 24) <= 30;
                            }
                            return true;
                        });
                    }
                    setCreatedForms(forms);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the created forms!', error);
            });
    };

    const fetchNckhOptions = () => {
        axios.get('http://127.0.0.1:8000/scientific_research') // Thay đổi endpoint
            .then(response => {
                if (Array.isArray(response.data)) {
                    setNckhOptions(response.data);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the NCKH options!', error);
            });
    };

    const fetchHdNckhOptions = () => {
        axios.get('http://127.0.0.1:8000/scientific_research_activities') // Thay đổi endpoint
            .then(response => {
                if (Array.isArray(response.data)) {
                    setHdNckhOptions(response.data);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the HD-NCKH options!', error);
            });
    };

    const handleCreateForm = (form) => {
        axios.post('/api/sponsorship_proposals', form)
            .then(response => {
                if (response.data) {
                    setCreatedForms([...createdForms, response.data]);
                }
            })
            .catch(error => {
                console.error('There was an error creating the form!', error);
            });
        setShowFormModal(false);
        setNewForm({ ten_nckh: '', nckh_id: '', hd_nckh_id: '', budget: '', content: '' });
    };

    return (
        <div className="container mx-auto p-4">
            <div className="pt-30 flex justify-between items-center mb-4">
                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowFormModal(true)}
                >
                    Tạo đề xuất
                </button>
                <select
                    className="border p-2 rounded"
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                >
                    <option value="all">Tất cả</option>
                    <option value="last_week">Tuần trước</option>
                    <option value="last_month">Tháng trước</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                {createdForms.length > 0 ? (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">STT</th>
                                <th className="py-2 px-4 border-b">Tên NCKH</th>
                                <th className="py-2 px-4 border-b">Trạng thái</th>
                                <th className="py-2 px-4 border-b">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {createdForms.map((form, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{index + 1}</td>
                                    <td className="py-2 px-4 border-b">{form.ten_nckh}</td>
                                    <td className="py-2 px-4 border-b">{form.status}</td>
                                    <td className="py-2 px-4 border-b">{new Date(form.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
                        <p className="text-gray-500">Không có đề xuất nào</p>
                    </div>
                )}
            </div>
            {showFormModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full">
                        <h2 className="text-xl mb-4">Tạo đề xuất mới</h2>
                        <FundingForm
                            formData={newForm}
                            setFormData={setNewForm}
                            onSubmit={handleCreateForm}
                            nckhOptions={nckhOptions}
                            hdNckhOptions={hdNckhOptions}
                            setShowFormModal={setShowFormModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}