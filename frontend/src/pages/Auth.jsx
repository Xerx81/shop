import { useState } from 'react';
import { Link } from 'react-router-dom';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (error) setError(null);
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (error) setError(null);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Login failed: ${error.detail}`);
            }

            const data = await response.json();
            setSuccess('Login successful! Redirecting...');

            // Store the token in localStorage
            localStorage.setItem('access_token', data.access_token);

            // You might also want to store the token type
            localStorage.setItem('token_type', data.token_type);

            // Redirect after a short delay to show the success message
            setTimeout(() => {
                window.location.href = '/'; // or your protected route
            }, 500);

            console.log('Login successful:', data);

        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // Validate passwords match
        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerData.username,
                    password: registerData.password
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Registration failed: ${error.detail}`);
            }

            const data = await response.json();
            setSuccess('Registration successful! Redirecting...');

            // Store the token in localStorage
            localStorage.setItem('access_token', data.access_token);

            // You might also want to store the token type
            localStorage.setItem('token_type', data.token_type);


            // Redirect after a short delay to show the success message
            setTimeout(() => {
                window.location.href = '/';
            }, 500);

            console.log('Login successful:', data);

        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setSuccess(null);
        // Reset forms when switching
        setLoginData({ username: '', password: '' });
        setRegisterData({ username: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-50">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={switchMode}
                            className="font-medium text-yellow-300 cursor-pointer hover:text-yellow-400 transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-500 p-6">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-md">
                            <p className="text-sm">{success}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    {isLogin ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-gray-400 mb-2">
                                    Username
                                </label>
                                <input
                                    id="login-username"
                                    name="username"
                                    type="text"
                                    required
                                    value={loginData.username}
                                    onChange={handleLoginChange}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-gray-400 mb-2">
                                    Password
                                </label>
                                <input
                                    id="login-password"
                                    name="password"
                                    type="password"
                                    required
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className="w-full px-3 py-2 bg-gray-700 text-gray-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-yellow-300 focus:ring-yellow-300 border-gray-500 rounded bg-gray-700"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-yellow-300 hover:text-yellow-400 transition-colors">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-yellow-300 text-black py-2 px-4 rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                            >
                                {submitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                        'Sign in'
                                    )}
                            </button>
                        </form>
                    ) : (
                            /* Register Form */
                            <form onSubmit={handleRegisterSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="register-name" className="block text-sm font-medium text-gray-400 mb-2">
                                        Username
                                    </label>
                                    <input
                                        id="register-username"
                                        name="username"
                                        type="text"
                                        required
                                        value={registerData.username}
                                        onChange={handleRegisterChange}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-400 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="register-password"
                                        name="password"
                                        type="password"
                                        required
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
                                        placeholder="Create a password"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-400 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="register-confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
                                        placeholder="Confirm your password"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-yellow-300 focus:ring-yellow-300 border-gray-500 rounded bg-gray-700"
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                                        I agree to the{' '}
                                        <a href="#" className="text-yellow-300 hover:text-yellow-400 transition-colors">
                                            Terms and Conditions
                                        </a>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-yellow-300 text-black py-2 px-4 rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                >
                                    {submitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                            Creating account...
                                        </div>
                                    ) : (
                                            'Create account'
                                        )}
                                </button>
                            </form>
                        )}
                </div>

                {/* Footer */}
                <div className="text-center">
                    <Link 
                        to="/" 
                        className="text-gray-400 hover:text-yellow-300 transition-colors text-sm"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Auth;
