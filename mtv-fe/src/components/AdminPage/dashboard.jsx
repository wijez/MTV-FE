import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold">DashStack</div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Dashboard</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Products</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Favorites</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Inbox</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Order Lists</li>
            <li className="p-4 hover:bg-gray-200 cursor-pointer">Product Stock</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="border rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <span>Moni Roy</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold">Total User</h2>
              <p className="text-2xl font-bold">40,689</p>
              <p className="text-green-500">8.5% Up from yesterday</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold">Total Order</h2>
              <p className="text-2xl font-bold">10,293</p>
              <p className="text-green-500">1.3% Up from past week</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold">Total Sales</h2>
              <p className="text-2xl font-bold">$89,000</p>
              <p className="text-red-500">4.3% Down from yesterday</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold">Total Pending</h2>
              <p className="text-2xl font-bold">2,040</p>
              <p className="text-green-500">1.8% Up from yesterday</p>
            </div>
          </div>

          {/* Sales Details */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Sales Details</h2>
            <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
              <p>Chart Placeholder</p>
            </div>
          </div>

          {/* Deals Details */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Deals Details</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-4 text-left">Product Name</th>
                  <th className="border-b p-4 text-left">Location</th>
                  <th className="border-b p-4 text-left">Date - Time</th>
                  <th className="border-b p-4 text-left">Piece</th>
                  <th className="border-b p-4 text-left">Amount</th>
                  <th className="border-b p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4">Apple Watch</td>
                  <td className="p-4">6096 Marjolaine Landing</td>
                  <td className="p-4">12.09.2019 - 12:53 PM</td>
                  <td className="p-4">423</td>
                  <td className="p-4">$34,295</td>
                  <td className="p-4 text-green-500">Delivered</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;