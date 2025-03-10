import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { Lock, User, Mail } from 'lucide-react';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const { authService, notificationService } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await authService.login({
                    email: formData.email,
                    password: formData.password
                });
                notificationService.add({
                    type: 'success',
                    message: 'Login Successful'
                });
            } else {
                // Implement registration logic
                notificationService.add({
                    type: 'success',
                    message: 'Registration Successful'
                });
            }
        } catch (error) {
            notificationService.add({
                type: 'error',
                message: 'Authentication Failed'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl mb-4 text-center">
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="flex items-center border rounded">
                            <User className="ml-2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full p-2 focus:outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    name: e.target.value
                                })}
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center border rounded">
                        <Mail className="ml-2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 focus:outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({
                                ...formData, 
                                email: e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="flex items-center border rounded">
                        <Lock className="ml-2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 focus:outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({
                                ...formData, 
                                password: e.target.value
                            })}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                    <p 
                        className="text-center text-blue-600 cursor-pointer"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin 
                            ? 'Need an account? Register' 
                            : 'Already have an account? Login'}
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Auth;