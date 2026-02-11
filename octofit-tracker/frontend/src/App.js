import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              OctoFit Tracker
            </NavLink>
            <div className="navbar-nav ms-auto">
              <NavLink className={navLinkClass} to="/" end>
                Activities
              </NavLink>
              <NavLink className={navLinkClass} to="/leaderboard">
                Leaderboard
              </NavLink>
              <NavLink className={navLinkClass} to="/teams">
                Teams
              </NavLink>
              <NavLink className={navLinkClass} to="/users">
                Users
              </NavLink>
              <NavLink className={navLinkClass} to="/workouts">
                Workouts
              </NavLink>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
