import React from 'react'
import NotificationLayout from './notificationLayout'
import InfoUser from './infoUser'
import Propose from './propose'
import ScientificResearch from './scientificResearch'
import Statistical from './statistical'

function HomeLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-400 to-blue-100 py-10 px-2 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <InfoUser />
          <Propose />
          <Statistical />
        </div>
        <div className="flex flex-col gap-6">
          <NotificationLayout />
          <ScientificResearch />
        </div>
      </div>
    </div>
  )
}

export default HomeLayout