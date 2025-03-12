import React from 'react'

const notifications = [
    { id: 1, message: 'Đề xuất kinh phí của bạn đã được chấp nhận' },
    { id: 2, message: 'Đề xuất kinh phí của bạn đã được chấp nhận' },
    // Add more notifications as needed
  ];
  

export default function NotificationLayout() {
    const handleNotificationClick = (id) => {
        // Handle the click event to show detailed notification
        console.log(`Notification ${id} clicked`);
    }
      
  return (
    <>
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-full ">
      <h3 className="text-lg font-semibold mb-4">Thông báo</h3>
      <ul className="space-y-2">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => handleNotificationClick(notification.id)}
          >
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}
