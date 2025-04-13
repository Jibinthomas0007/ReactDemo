import {  Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Dashboard from './Pages/dashboard';
import Register from './Pages/register';
import PrivateRoute from './components/ProtectedRoute';

function App() {
    return(
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
    );
}

export default App;
