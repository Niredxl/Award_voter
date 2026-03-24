import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AwardList from './components/AwardList';
import NomineeList from './components/NomineeList';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { initializeStorage } from './utils/storage';

const App = () => {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Routes>
          <Route path="/" element={<AwardList />} />
          <Route path="/award/:id" element={<NomineeList />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      
      <footer className="border-t border-dark-800 py-6 mt-12 text-center text-dark-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Golden Gala Awards. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
