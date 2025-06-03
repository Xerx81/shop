import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function List() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);

            const response = await fetch('http://localhost:8000/api/');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Limit to first 10 items for better display
            setItems(data.slice(0, 10));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Replace with your actual backend endpoint
            const response = await fetch('http://localhost:8000/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price)
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create item: ${response.status}`);
            }

            const newItem = await response.json();

            // Add the new item to the beginning of the list
            setItems(prev => [newItem, ...prev]);

            // Reset form and close it
            setFormData({ name: '', description: '', price: '' });
            setShowForm(false);

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading items...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-red-900 border border-red-200 rounded-lg p-6 max-w-md">
                    <h2 className="text-red-800 font-semibold mb-2">Error Loading Items</h2>
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Add Item Form */}
                {showForm && (
                    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-500 mb-6">
                        <div className="px-6 py-4 border-b border-gray-500">
                            <h2 className="text-xl font-bold text-gray-50">Add New Item</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
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
                                        className="w-full px-3 py-2 text-gray-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                                        placeholder="Enter item name"
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
                                        rows="3"
                                        className="w-full px-3 py-2 text-gray-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                                        placeholder="Enter item description"
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
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 text-gray-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-yellow-300 text-black px-4 py-2 rounded-md hover:bg-yellow-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Adding...
                                        </>
                                    ) : (
                                            'Add Item'
                                        )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({ name: '', description: '', price: '' });
                                    }}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Items List */}
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-500">
                    <div className="px-6 py-4 border-b border-gray-500 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-50">Items List</h1>
                            <p className="text-gray-400 mt-1">Fetched {items.length} items from API</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-yellow-300 text-black px-4 py-2 rounded-md hover:bg-yellow-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {showForm ? 'Cancel' : 'Add Item'}
                        </button>
                    </div>

                    <div className="divide-y divide-gray-500">
                        {items.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-gray-700 transition-colors cursor-pointer">
                                <Link to={`/${item.id}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-50 mb-2 capitalize">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed">
                                                {item.description}
                                            </p>
                                            <div className="mt-3 flex items-center text-sm text-gray-500">
                                                <span className="bg-blue-400 text-blue-900 px-2 py-1 rounded-full text-xs font-medium">
                                                    ID: {item.id}
                                                </span>
                                                {item.price && (
                                                    <span className="ml-3 bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-medium">
                                                        ${parseFloat(item.price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List;
