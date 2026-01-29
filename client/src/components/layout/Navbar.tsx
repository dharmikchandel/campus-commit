import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Plus, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="border-b-3 border-text-primary bg-surface sticky top-0 z-50 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Left Side - Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-3xl font-black text-text-primary uppercase tracking-tighter hover:text-accent-1 transition-none decoration-4 underline-offset-4 hover:underline">
                            Campus-Commit
                        </Link>
                    </div>

                    {/* Right Side - Links/Menu */}
                    <div className="flex items-center">
                        <div className="hidden md:flex items-center space-x-4">
                            <Button variant="ghost" onClick={toggleTheme} className="text-xl px-2" title="Toggle Theme">
                                {theme === 'light' ? <Moon size={24} strokeWidth={3} /> : <Sun size={24} strokeWidth={3} />}
                            </Button>

                            {user ? (
                                <>
                                    <Link to="/create-post">
                                        <Button variant="primary" size="icon" title="New Post">
                                            <Plus size={24} strokeWidth={3} />
                                        </Button>
                                    </Link>

                                    {/* Admin Link */}
                                    {user.role === 'admin' && (
                                        <Link to="/admin">
                                            <Button variant="secondary" size="sm">
                                                ADMIN
                                            </Button>
                                        </Link>
                                    )}

                                    <div className="font-bold text-text-secondary text-sm tracking-widest ml-4">
                                        {user.username}
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="outline" size="sm">Login</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="primary" size="sm">Register</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden px-0 gap-2">
                            <Button variant="ghost" onClick={toggleTheme} className="text-xl px-2">
                                {theme === 'light' ? <Moon size={20} strokeWidth={3} /> : <Sun size={20} strokeWidth={3} />}
                            </Button>
                            <Button variant="outline" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t-3 border-text-primary bg-surface overflow-hidden"
                    >
                        <div className="p-4 flex flex-col space-y-4 shadow-brutal-card">
                            {user ? (
                                <>
                                    <Link to="/create-post" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="primary" className="w-full">New Post</Button>
                                    </Link>

                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="secondary" className="w-full">Admin Dashboard</Button>
                                        </Link>
                                    )}

                                    <div className="font-extrabold text-text-secondary text-sm tracking-widest text-center">
                                        {user.username}
                                    </div>
                                    <Button variant="outline" onClick={handleLogout} className="w-full">
                                        LOGOUT
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">LOGIN</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="primary" className="w-full">REGISTER</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
