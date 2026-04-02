import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const navClassName = ({ isActive }) => (
    `nav-link app-nav-link${isActive ? ' active' : ''}`
  );

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark app-nav">
        <div className="container py-1">
          <span className="navbar-brand app-brand">OctoFit Tracker</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#octofitNav"
            aria-controls="octofitNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="octofitNav">
            <div className="navbar-nav gap-2 ms-auto">
              <NavLink className={navClassName} to="/activities">Activities</NavLink>
              <NavLink className={navClassName} to="/leaderboard">Leaderboard</NavLink>
              <NavLink className={navClassName} to="/teams">Teams</NavLink>
              <NavLink className={navClassName} to="/users">Users</NavLink>
              <NavLink className={navClassName} to="/workouts">Workouts</NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="container mb-3">
          <div className="card page-card">
            <div className="card-body py-3">
              <h1 className="display-6 fw-bold mb-1">Fitness Data Dashboard</h1>
              <p className="text-secondary mb-0">Overzicht van activities, teams, users, workouts en leaderboard vanuit je Django REST API.</p>
            </div>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
