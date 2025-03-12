import React from 'react'
import NotificationLayout from './notificationLayout'
import InfoUser from './infoUser'
import Propose from './propose'
import ScientificResearch from './scientificResearch'
import Statistical from './statistical'
function HomeLayout() {
  return (
    <>
     <div className="min-h-screen flex flex-col md:flex-row  bg-blue-700">
      {/* Left Column */}
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex-1  md:px-10 md:py-3">
          <InfoUser />
        </div>
        <div className="flex-1 md:px-10 md:pb-3  flex items-center justify-center">
          <Propose />
        </div>
        <div className="flex-1 md:px-10 md:py-3 flex items-center justify-center">
          <Statistical />
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex-1 md:px-10 md:py-3">
          <NotificationLayout />
        </div>
        <div className="flex-2 md:px-10 md:pt-2 md:my-3">
          <ScientificResearch/>
        </div>
      </div>
    </div>
    </>
  )
}

export default HomeLayout