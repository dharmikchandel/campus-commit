import { useEffect, useState } from 'react';
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

    const handleRoleUpdate = async (userId: string, newRole: User['role']) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

        try {
            await api.updateUserRole(userId, newRole);
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Failed to update role');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="text-2xl font-black uppercase animate-pulse">Loading...</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl md:text-5xl font-black uppercase text-text-primary tracking-tighter">
                    Admin <span className="text-accent-1 relative inline-block">
                        Dashboard
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-accent-2/30 -z-10 skew-x-12"></span>
                    </span>
                </h1>
                <div className="bg-surface border-2 border-text-primary px-4 py-2 shadow-brutal-xs font-mono text-sm font-bold">
                    TOTAL USERS: {users.length}
                </div>
            </div>

            <Card className="overflow-hidden border-3 border-text-primary shadow-brutal-card bg-surface p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-text-primary text-white uppercase text-sm tracking-wider">
                                <th className="p-5 font-bold border-b-2 border-text-primary">User Info</th>
                                <th className="p-5 font-bold border-b-2 border-text-primary">Role</th>
                                <th className="p-5 font-bold border-b-2 border-text-primary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg text-text-primary group-hover:text-accent-1 transition-colors">{user.username}</span>
                                            <span className="text-sm text-gray-500 font-mono">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 align-middle">
                                        <span className={`inline-flex items-center px-3 py-1 border-2 border-text-primary text-xs font-bold shadow-brutal-xs uppercase tracking-wide
                                            ${user.role === 'admin' ? 'bg-accent-1 text-white' :
                                                user.role === 'editor' ? 'bg-accent-2 text-white' :
                                                    'bg-gray-100 text-text-primary'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        {user.role !== 'admin' && (
                                            <div className="flex justify-end gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.role !== 'editor' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs bg-white hover:bg-accent-2 hover:text-white"
                                                        onClick={() => handleRoleUpdate(user._id, 'editor')}
                                                    >
                                                        Make Editor
                                                    </Button>
                                                )}
                                                {user.role === 'editor' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs bg-white hover:bg-gray-200"
                                                        onClick={() => handleRoleUpdate(user._id, 'reader')}
                                                    >
                                                        Make Reader
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="text-xs bg-accent-1 text-white hover:bg-accent-1/90"
                                                    onClick={() => handleRoleUpdate(user._id, 'admin')}
                                                >
                                                    Make Admin
                                                </Button>
                                            </div>
                                        )}
                                        {user.role === 'admin' && (
                                            <span className="text-xs font-mono text-gray-400 font-bold px-2">READ ONLY</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
