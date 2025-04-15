import { Routes, Route } from 'react-router-dom';
import Login from './components/Page/login';
import Home from './components/Page/home'; 
import Funding from './components/Page/funding';
import Scientific from './components/Page/scientific';
import Details from './components/Page/details';
import Report from './components/Page/report';
import ScientificSuccess from './components/Page/ScientificSuccess';

import ScientificDetails from './components/Details/ScientificDetails';

import { ProtectedRoute } from './components/ProtectedRoute';

import HomeAdmin from './components/AdminPage/home';
import ScientificRequest from './components/AdminPage/scientificRequest';
import Dashboard from './components/AdminPage/dashboard';
import FundingRequest from './components/AdminPage/fundingrequest';
import Teacher from './components/AdminPage/teacher';
import ScientificAdmin from './components/AdminPage/scientificdetails';


import './App.css';

function App() {
  return (
    <> 
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute role="TEACHER"><Home /></ProtectedRoute>} />
        <Route path="/funding" element={<ProtectedRoute role="TEACHER"><Funding/></ProtectedRoute>} />
        <Route path="/scientific" element={<ProtectedRoute role="TEACHER"><Scientific /></ProtectedRoute>} />
        <Route path="/scientific/scientific-details/:id" element={<ProtectedRoute role="TEACHER"><ScientificDetails /></ProtectedRoute>} />
        <Route path="/scientific-success" element={<ProtectedRoute role="TEACHER"><ScientificSuccess /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute role="TEACHER"><Report /></ProtectedRoute>} />
        <Route path="/details" element={<ProtectedRoute role="TEACHER"><Details/></ProtectedRoute>} />
        <Route path="/home-admin" element={<ProtectedRoute role="ADMIN"><HomeAdmin /></ProtectedRoute>} />
        <Route path="/scientific-requests" element={<ProtectedRoute role="ADMIN"><ScientificRequest /></ProtectedRoute>} />
        <Route path="/scientific-details/:id" element={<ProtectedRoute role="ADMIN">< ScientificAdmin/></ProtectedRoute>} />
        <Route path="/funding-requests" element={<ProtectedRoute role="ADMIN"><FundingRequest /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/teacher" element={<ProtectedRoute role="ADMIN"><Teacher /></ProtectedRoute>} />
      </Routes>
     
    </>
  );
}

export default App;