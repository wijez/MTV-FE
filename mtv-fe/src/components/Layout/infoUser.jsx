import React from 'react'
import avatar from '../../assets/avatagit.jpg';

const sampleUser = {
    id: 1,
    fullname: 'Nguyễn Văn A',
    degree: 'Thạc sĩ',
    department: 'Khoa học máy tính',
    country: 'Việt Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  };

export default function InfoUser() {
  return (
    <>
    <div className="flex flex-col md:flex-row items-center p-4 bg-white shadow-lg rounded-lg w-full h-full mx-auto md:p-10">
      <img className="w-40 h-40 rounded-full md:mr-4 mb-4 md:mb-0" src={avatar} alt="User Avatar" />
      <div className="text-center md:text-left md:ml-4">
            <h3 className="text-3xl font-extrabold">{sampleUser.fullname}</h3>
            <p className="text-gray-600">{sampleUser.degree}</p>
            <p className="text-gray-600">{sampleUser.department}</p>
            <p className="text-gray-600">{sampleUser.country}</p>
            <p className="text-gray-600">{sampleUser.address}</p>
        <button className="mt-2 text-blue-500 hover:underline">Chi tiết</button>
      </div>
    </div>
    </>
  )
}
