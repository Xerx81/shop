import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function Item() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try to fetch from your backend first
            let response;
            response = await fetch(`http://localhost:8000/api/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                if (response.status === 401) {
                    // Redirect to auth page
                    window.location.href = '/auth';
                }
                throw new Error(`HTTP error! status: ${response.status} - ${error.detail}`);
            }

            const item = await response.json();
            setItem(item);

            // Set form item for editing
            setFormData({
                name: item.name || '',
                description: item.description || '',
                price: item.price ? item.price.toString() : ''
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price ? parseFloat(formData.price) : null
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update item: ${response.status}`);
            }

            const updatedItem = await response.json();
            setItem(updatedItem);
            setEditing(false);

        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete item: ${response.status}`);
            }

            // Navigate back to list after deletion
            navigate('/');

        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading item details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-gray-800 border border-red-200 rounded-lg p-6 max-w-md">
                    <h2 className="text-red-800 font-semibold mb-2">Error Loading Item</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={fetchItem}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <Link 
                            to="/"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors inline-block text-center"
                        >
                            Go Back
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Item Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested item could not be found.</p>
                    <Link 
                        to="/"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <Link 
                        to="/"
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Items
                    </Link>
                </div>

                {/* Item Details Card */}
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-500">
                    <div className="px-6 py-4 border-b border-gray-500 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-50 capitalize">
                                {item.name}
                            </h1>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="bg-blue-400 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                                    ID: {item.id}
                                </span>
                                {item.price && (
                                    <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                                        ${parseFloat(item.price).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditing(!editing)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                {editing ? 'Cancel Edit' : 'Edit'}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {editing ? (
                        /* Edit Form */
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-2">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                            /* View Mode */
                            <div className="p-6">
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-50 mb-3">Description</h2>
                                    <p className="text-gray-300 leading-relaxed text-lg">
                                        {item.description || 'No description available.'}
                                    </p>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}


export default Item;
