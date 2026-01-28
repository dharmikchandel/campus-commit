import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <Card className="w-full max-w-md border-3 border-text-primary p-8">
                <h2 className="text-4xl font-black mb-8 text-center uppercase tracking-tighter">LOGIN</h2>
                {error && <div className="bg-accent-1 text-white border-2 border-text-primary p-3 mb-6 font-bold uppercase shadow-brutal-active">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        name="email"
                        type="email"
                        placeholder="EMAIL"
                        label="EMAIL"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="PASSWORD"
                        label="PASSWORD"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" className="w-full" size="lg">
                        ENTER
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
