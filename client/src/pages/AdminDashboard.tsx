import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface User {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'reader';
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string, currentRole: string) => {
        const newRole: User['role'] = currentRole === 'reader' ? 'editor' : currentRole === 'editor' ? 'admin' : 'reader';
        if (!window.confirm(`Are you sure you want to change role to ${newRole.toUpperCase()}?`)) return;

        try {
            await api.updateUserRole(userId, newRole);
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Failed to update role');
        }
    };

    if (loading) return <div className="p-8 text-center font-bold text-xl uppercase">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 text-text-primary tracking-tighter">
                Admin <span className="text-accent-1">Dashboard</span>
            </h1>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border-3 border-text-primary bg-surface shadow-brutal-card">
                    <thead>
                        <tr className="bg-text-primary text-white uppercase text-left">
                            <th className="p-4 border-r-3 border-white">Username</th>
                            <th className="p-4 border-r-3 border-white">Email</th>
                            <th className="p-4 border-r-3 border-white">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b-3 border-text-primary font-bold hover:bg-bg/50 transition-none">
                                <td className="p-4 border-r-3 border-text-primary">{user.username}</td>
                                <td className="p-4 border-r-3 border-text-primary font-mono text-sm">{user.email}</td>
                                <td className="p-4 border-r-3 border-text-primary uppercase">
                                    <span className={`px-2 py-1 border-2 border-text-primary shadow-brutal-btn text-xs ${user.role === 'admin' ? 'bg-accent-1 text-white' :
                                        user.role === 'editor' ? 'bg-accent-2 text-white' :
                                            'bg-surface text-text-primary'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {user.role !== 'admin' && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant={user.role === 'editor' ? 'outline' : 'secondary'}
                                                onClick={() => handleRoleUpdate(user._id, user.role === 'editor' ? 'user' : 'editor')}
                                            >
                                                {user.role === 'editor' ? 'MAKE READER' : 'MAKE EDITOR'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="bg-accent-1 text-white"
                                                onClick={() => handleRoleUpdate(user._id, 'admin')}
                                            >
                                                MAKE ADMIN
                                            </Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
