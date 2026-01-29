import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import AdminDashboard from './pages/AdminDashboard';
import BackgroundPattern from './components/ui/BackgroundPattern';
import PageTransition from './components/ui/PageTransition';

// Placeholder for PostDetails while we build it
const PostDetailsPlaceholder = () => <div>Post Details...</div>;

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-bg text-text-primary transition-none relative">
            <BackgroundPattern />

            <Navbar />
            <main className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/posts/:slug" element={<PostDetails />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </PageTransition>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
