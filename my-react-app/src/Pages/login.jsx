import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrors(null);
        setIsLoading(true);

        try {
            const res = await axios.post('https://dummyjson.com/auth/login', {
                username: formData.username,
                password: formData.password,
            });

            const userData  = {
                token: res.data.accessToken,
                id: res.data.id,
                username: res.data.username,
                email: res.data.email,
                image: res.data.image
            }
            localStorage.setItem('user',JSON.stringify(userData));

            navigate('/dashboard');
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setErrors({...errors, form: 'Invalid username or password'});
                } else if (err.response.status === 404) {
                    setErrors({...errors, form: 'Login service unavailable. Please try again later.'});
                } else {
                    setErrors({...errors, form: err.response.data?.message || 'Login failed. Please try again.'});
                }
            } else if (err.request) {
                setErrors({...errors, form: 'No response from server. Please check your internet connection.'});
            } else {
                setErrors({...errors, form: err.message || 'An unexpected error occurred'});
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card slide-in-animation">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2 className="auth-heading">Welcome Back</h2>
                    <p className="auth-subheading">Please login to your account</p>
                    
                    {errors && <div className="auth-error">{errors}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            name="username"
                            value={formData.username}
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
                            placeholder="Enter your password"
                            name="password"
                            value={formData.password}
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
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                    
                    <p className="auth-link">
                        Don't have an account? 
                        <span onClick={() => navigate('/register')}> Create account</span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;