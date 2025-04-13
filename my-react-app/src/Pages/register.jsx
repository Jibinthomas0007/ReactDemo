import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post('https://dummyjson.com/users/add', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.userName,
                email: formData.email,
                password: formData.password
            });
            
            console.log('User registered', res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card slide-in-animation">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2 className="auth-heading">Create Account</h2>
                    
                    {error && <div className="auth-error">{error}</div>}
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                type="text" 
                                id="firstName"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input 
                                type="text" 
                                id="lastName"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="userName">Username</label>
                        <input 
                            type="text" 
                            id="userName"
                            name="userName"
                            placeholder="Choose a username"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>
                    
                    <p className="auth-link">
                        Already have an account? 
                        <span onClick={() => navigate('/')}> Sign in</span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;