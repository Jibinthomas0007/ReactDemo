import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import './styles.css';

function Dashboard() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const profileImage = localStorage.getItem('image');

    const navigate = useNavigate();

    // Data states
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter and search states
    const [searchTerm, setSearchTerm] = useState("");
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    
    // Sorting states
    const [sortField, setSortField] = useState("fullName");
    const [sortDirection, setSortDirection] = useState("asc");
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    
    // Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);
    
    // Fetch users data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://dummyjson.com/users');
                
                const data = response.data;
                
                const formattedUsers = data.users.map(user => ({
                    id: user.id,
                    fullName: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    phone: user.phone,
                    companyName: user.company?.name || 'N/A',
                    address: `${user.address?.city || 'N/A'}, ${user.address?.address || 'N/A'}`,
                    city: user.address?.city || 'N/A'
                }));
                
                // Extract unique cities for filter dropdown
                const uniqueCities = [...new Set(formattedUsers.map(user => user.city))].sort();
                setCities(uniqueCities);
                
                setUsers(formattedUsers);
                setFilteredUsers(formattedUsers);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle search, filter, and sort
    useEffect(() => {
        let result = [...users];
        
        // Apply search
        if (searchTerm.trim() !== "") {
            const lowercaseSearch = searchTerm.toLowerCase();
            result = result.filter(user => 
                user.fullName.toLowerCase().includes(lowercaseSearch) ||
                user.email.toLowerCase().includes(lowercaseSearch) ||
                user.companyName.toLowerCase().includes(lowercaseSearch)
            );
        }
        
        // Apply city filter
        if (selectedCity) {
            result = result.filter(user => user.city === selectedCity);
        }
        
        // Apply sorting
        result = result.sort((a, b) => {
            let valueA = a[sortField].toLowerCase();
            let valueB = b[sortField].toLowerCase();
        
            if (valueA < valueB) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });
    
        setFilteredUsers(result);
        setCurrentPage(1); // Reset to first page on filter/sort/search change
    }, [searchTerm, selectedCity, sortField, sortDirection, users]);
    
    // Pagination logic
    const lastUserIndex = currentPage * usersPerPage;
    const firstUserIndex = lastUserIndex - usersPerPage;
    const currentUsers = filteredUsers.slice(firstUserIndex, lastUserIndex);
    
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Event handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };
    
    const handleSort = (field) => {
        // If clicking the same field, toggle direction, otherwise set new field with ascending direction
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };
    
    // Helper to render sort indicator
    const renderSortIndicator = (field) => {
        if (field !== sortField) return null;
        return <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>;
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <div className="profile-section">
                    {profileImage && (
                        <img src={profileImage} alt={username} className="profile-image" />
                    )}
                    <div className="user-info">
                        <h2>Welcome, {username}</h2>
                        <p>{email}</p>
                    </div>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    Log Out
                </button>
            </header>

            <main className="dashboard-content">
                <h1>User Directory</h1>
                
                <div className="filter-toolbar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name, email or company..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="city-filter">
                        <select 
                            value={selectedCity} 
                            onChange={handleCityChange}
                            className="city-select"
                        >
                            <option value="">All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading user data...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                ) : (
                    <>
                        <div className="user-table-container">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort("fullName")} className="sortable-header">
                                            Name {renderSortIndicator("fullName")}
                                        </th>
                                        <th onClick={() => handleSort("email")} className="sortable-header">
                                            Email {renderSortIndicator("email")}
                                        </th>
                                        <th>Phone</th>
                                        <th onClick={() => handleSort("companyName")} className="sortable-header">
                                            Company {renderSortIndicator("companyName")}
                                        </th>
                                        <th>Address</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {currentUsers.length > 0 ? (
                                        currentUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.fullName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.companyName}</td>
                                                <td>{user.address}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="no-results">
                                                No users found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="mobile-cards">
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
                                    <div key={user.id} className="user-card">
                                        <h3>{user.fullName}</h3>
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <p><strong>Phone:</strong> {user.phone}</p>
                                        <p><strong>Company:</strong> {user.companyName}</p>
                                        <p><strong>Address:</strong> {user.address}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    No users found matching your criteria.
                                </div>
                            )}
                        </div>
                        
                        {filteredUsers.length > 0 && (
                            <div className="pagination-controls">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="pagination-button"
                                >
                                    Previous
                                </button>
                                
                                <div className="page-numbers">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`page-number ${currentPage === page ? 'active' : ''}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="pagination-button"
                                >
                                    Next
                                </button>
                                
                                <span className="page-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;