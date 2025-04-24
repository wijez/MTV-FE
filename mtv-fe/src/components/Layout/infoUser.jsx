import React, { useEffect, useState } from 'react';
import avatarDefault from '../../assets/avatagit.jpg';
import { useNavigate } from 'react-router-dom';
import { fetchMe } from '../../api/api';
import { User, Settings } from 'lucide-react';

export default function InfoUser() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getMe = async () => {
      const data = await fetchMe();
      setUser(data);
    };
    getMe();
  }, []);

  const handleClick = () => {
    navigate('/details');
  };

  const avatarSrc = user?.profile?.avatar || avatarDefault;
  const name = user?.full_name || '---';
  const degree = user?.profile?.degree || '---';
  const department = user?.profile?.department || '---';
  const country = user?.profile?.country || '';
  const address = user?.profile?.address || '';
  const id = user?.id || '---';

  return (
    <div className="rounded-lg border bg-gradient-to-br from-[#6C22A6]/5 to-[#96E9C6]/5 hover:from-[#6C22A6]/10 hover:to-[#96E9C6]/10 text-card-foreground shadow-sm transition-colors duration-300">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-lg font-medium text-[#6C22A6] flex items-center gap-2">
          <User className="h-5 w-5" />
          Thông tin cá nhân
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 rounded-full overflow-hidden">
            <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#6C22A6]">{name}</p>
            <p className="text-sm text-[#6962AD]">{degree}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-[#6962AD] flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {department}
          </p>
          <p className="text-sm text-[#6962AD]">ID: {id}</p>
          {country && <p className="text-sm text-[#6962AD]">Quốc gia: {country}</p>}
          {address && <p className="text-sm text-[#6962AD]">Địa chỉ: {address}</p>}
        </div>
        <button className="mt-4 text-blue-500 hover:underline" onClick={handleClick}>
          Chi tiết
        </button>
      </div>
    </div>
  );
}
