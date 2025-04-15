import React, { useState, useEffect } from 'react';
import CreateAccount from '../Form/CreateAccount';
import { fetchUsers, importUsersFromCSV } from '../../api/api';
import Pagination from '@mui/material/Pagination';
import defaultAvatar from '../../assets/avatagit.jpg';
import { Filter } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'; 


export default function TeacherLayout() {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [filters, setFilters] = useState({
    date_sort: '', // asc hoặc desc
    degree: '',
    department: '',
  });
  

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); 
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false); // Trạng thái mở dialog Import CSV
  const [selectedFile, setSelectedFile] = useState(null); // Lưu file CSV được chọn
  const handleOpenCreateAccount = () => {
    setShowCreateAccount(true);
  };

  const handleCloseCreateAccount = () => {
    setShowCreateAccount(false);
  };

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setFilteredUsers(data); // Khởi tạo danh sách lọc
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    getUsers();
  }, []);

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Lọc theo ngày tạo
  const filterByDate = () => {
    let filtered = [...users];
    if (filters.date_sort) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date_joined);
        const dateB = new Date(b.date_joined);
        return filters.date_sort === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Lọc theo học vị
  const filterByDegree = () => {
    let filtered = [...users];
    if (filters.degree) {
      filtered = filtered.filter((user) =>
        user.profile?.degree?.toLowerCase().includes(filters.degree.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Lọc theo phòng ban
  const filterByDepartment = () => {
    let filtered = [...users];
    if (filters.department) {
      filtered = filtered.filter((user) =>
        user.profile?.department?.toLowerCase().includes(filters.department.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên
  };
  const handleImportCSV = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn một file CSV!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await importUsersFromCSV(formData);
      alert('Import thành công!');
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Đã xảy ra lỗi khi import CSV.');
    }
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="p-4">
      {/* Nút Import CSV, Tạo tài khoản và Lọc */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
        <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            onClick={() => setIsImportDialogOpen(true)} // Mở dialog khi nhấn nút
          >
            <span>📤</span> Import CSV
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={handleOpenCreateAccount}
          >
            <span>➕</span> Tạo tài khoản
          </button>
        </div>

        {/* Menu Lọc */}
        <div className="relative">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
           <Filter />
          </button>
          {isFilterMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg z-10">
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-2">Lọc theo ngày tạo</h3>
                <select
                  name="date_sort"
                  value={filters.date_sort}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
                >
                  <option value="">Sắp xếp ngày tạo</option>
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
                <button
                  onClick={filterByDate}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full mb-4"
                >
                  Lọc ngày tạo
                </button>

                <h3 className="text-sm font-semibold mb-2">Lọc theo học vị</h3>
                <select
                  name="degree"
                  value={filters.degree}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
                >
                  <option value="">Chọn học vị</option>
                  <option value="TS">Tiến sĩ</option>
                  <option value="THS">Thạc sĩ</option>
                  <option value="PGS">Phó giáo sư</option>
                  <option value="GS">Giáo sư</option>
                </select>
                <button
                  onClick={filterByDegree}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full mb-4"
                >
                  Lọc học vị
                </button>

                <h3 className="text-sm font-semibold mb-2">Lọc theo phòng ban</h3>
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
                >
                  <option value="">Chọn phòng ban</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="LEGAL">LEGAL</option>
                  <option value="SALES">SALES</option>
                  <option value="TOURISM">TOURISM</option>
                  <option value="FINANCE">FINANCE</option>
                  <option value="MARKETING">MARKETING</option>
                  <option value="OPERATIONS">OPERATIONS</option>
                  <option value="ENGINEERING">ENGINEERING</option>
                  <option value="ARCHITECTURE">ARCHITECTURE</option>
                  <option value="ADMINISTRATION">ADMINISTRATION</option>
                  <option value="GRAPHIC_DESIGN">GRAPHIC DESIGN</option>
                  <option value="CUSTOMER_SERVICE">CUSTOMER SERVICE</option>
                  <option value="FOREIGN_LANGUAGES">FOREIGN LANGUAGES</option>
                  <option value="INFORMATION_TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                </select>
                <button
                  onClick={filterByDepartment}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
                >
                  Lọc phòng ban
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách người dùng dạng thẻ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentUsers.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            {/* Avatar bên trái */}
            <img
              src={user.avatar || defaultAvatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {user.full_name || 'N/A'}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Trạng thái:</strong>{' '}
                {user.is_active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Học vị:</strong>{' '}
                {user.profile.degree || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Ngày tạo:</strong>{' '}
                {new Date(user.date_joined).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(filteredUsers.length / itemsPerPage)} // Tổng số trang
          page={currentPage} // Trang hiện tại
          onChange={handlePageChange} // Xử lý khi thay đổi trang
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </div>

      {/* Form Tạo tài khoản */}
      {showCreateAccount && <CreateAccount onClose={handleCloseCreateAccount} />}
    </div>
  );
}
