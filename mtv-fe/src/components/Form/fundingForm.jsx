import React from 'react';

export default function FundingForm({ formData, setFormData, onSubmit, nckhOptions, hdNckhOptions, setShowFormModal }) {
    // Hàm xử lý thay đổi giá trị của các trường trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Hàm xử lý khi form được submit
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ten_nckh">
                    Tên NCKH
                </label>
                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="ten_nckh"
                    name="ten_nckh"
                    value={formData.ten_nckh}
                    onChange={handleChange}
                >
                    <option value="">Chọn Tên NCKH</option>
                    {nckhOptions.map((option, index) => (
                        <option key={index} value={option.name}>{option.name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hd_nckh_id">
                    Loại đề xuất
                </label>
                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="hd_nckh_id"
                    name="hd_nckh_id"
                    value={formData.hd_nckh_id}
                    onChange={handleChange}
                >
                    <option value="">Chọn Loại đề xuất</option>
                    {hdNckhOptions.map((option, index) => (
                        <option key={index} value={option.id}>{option.type}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
                    Kinh phí đề xuất
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="budget"
                    name="budget"
                    type="text"
                    placeholder="Kinh phí đề xuất"
                    value={formData.budget}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Nội dung
                </label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="content"
                    name="content"
                    placeholder="Nội dung"
                    value={formData.content}
                    onChange={handleChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    type="submit"
                >
                    Tạo
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    type="button"
                    onClick={() => setShowFormModal(false)}
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}