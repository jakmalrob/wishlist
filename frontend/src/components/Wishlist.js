import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Wishlist() {
    const [items, setItems] = useState([]);
    const [currentEditingItem, setCurrentEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        websiteUrl: '',
        price: '',
        quantity: '1',
        priority: '',
        category: '',
        notes: ''
    });
    const { user } = useAuth();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error loading wishlist:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearForm = () => {
        setFormData({
            name: '',
            websiteUrl: '',
            price: '',
            quantity: '1',
            priority: '',
            category: '',
            notes: ''
        });
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert('Please enter a name for the item.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to add item');

            const newItem = await response.json();
            setItems(prev => [...prev, newItem]);
            clearForm();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await fetch(`http://localhost:5000/api/products/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setItems(prev => prev.filter(item => item._id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEdit = async (itemId) => {
        const itemToEdit = items.find(item => item._id === itemId);
        setCurrentEditingItem(itemToEdit);
        setFormData({
            name: itemToEdit.name,
            websiteUrl: itemToEdit.websiteUrl || '',
            price: itemToEdit.price || '',
            quantity: itemToEdit.quantity || '1',
            priority: itemToEdit.priority || '',
            category: itemToEdit.category || '',
            notes: itemToEdit.notes || ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!currentEditingItem) return;

        try {
            const response = await fetch(`http://localhost:5000/api/products/${currentEditingItem._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update item');

            const updatedItem = await response.json();
            setItems(prev => prev.map(item => 
                item._id === currentEditingItem._id ? updatedItem : item
            ));
            setCurrentEditingItem(null);
            clearForm();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <div className="wishlist-container">
            <form onSubmit={currentEditingItem ? handleUpdate : handleAddItem}>
                <input
                    type="text"
                    name="name"
                    placeholder="Item name (required)"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="websiteUrl"
                    placeholder="Website URL"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                />
                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                >
                    <option value="">Select priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                >
                    <option value="">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home</option>
                    <option value="other">Other</option>
                </select>
                <textarea
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                />
                <button type="submit">
                    {currentEditingItem ? 'Update Item' : 'Add Item'}
                </button>
                {currentEditingItem && (
                    <button type="button" onClick={() => {
                        setCurrentEditingItem(null);
                        clearForm();
                    }}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <ul className="wishlist">
                {items.map(item => (
                    <li key={item._id}>
                        <div className="item-details">
                            <h3>{item.name}</h3>
                            {item.websiteUrl && (
                                <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                                    View Item
                                </a>
                            )}
                            {item.price && <p>Price: {item.price}</p>}
                            <p>Quantity: {item.quantity}</p>
                            {item.priority && <p>Priority: {item.priority}</p>}
                            {item.category && <p>Category: {item.category}</p>}
                            {item.notes && <p>Notes: {item.notes}</p>}
                        </div>
                        <div className="button-container">
                            {user.role === 'list_maker' && (
                                <>
                                    <button onClick={() => handleEdit(item._id)}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(item._id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Wishlist; 