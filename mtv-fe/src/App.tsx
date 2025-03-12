import { Routes, Route } from 'react-router-dom';
import Login from './components/Page/login';
import Home from './components/Page/home'; 
import Funding from './components/Page/funding';
import Scientific from './components/Page/scientific';
import Details from './components/Page/details';

import './App.css';

function App() {
  return (
    <> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/funding" element={<Funding/>} />
        <Route path="/sientific" element={<Scientific />} />
        <Route path="/details" element={<Details/>} />
      </Routes>
    </>
  );
}

export default App;