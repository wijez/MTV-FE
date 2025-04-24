import React, { useEffect, useState } from 'react'
import NotificationLayout from './notificationLayout'
import InfoUser from './infoUser'
import Propose from './propose'
import ScientificResearch from './scientificResearch'
import Statistical from './statistical'
import SidebarMenu from './sidebarMenu'
import { fetchMe } from '../../api/api'

function HomeLayout() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        const me = await fetchMe();
        setUserId(me.id);
      } catch (error) {
        setUserId(null);
      }
    };
    getMe();
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-700 via-blue-400 to-blue-100 py-10 px-2 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar bên trái */}
        <div>
          <SidebarMenu />
        </div>
        {/* Nội dung chính */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <InfoUser />
            </div>
            <div className="w-full md:w-1/3">
              <NotificationLayout />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Statistical userId={userId}/>
            </div>
            <div className="w-full md:w-1/3">
              {/* Truyền userId đã lấy từ fetchMe */}
              <ScientificResearch userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeLayout