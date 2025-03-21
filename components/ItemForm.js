'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth/authContext';
import { API_ENDPOINTS } from '../lib/config';

export default function ItemForm({ type }) {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    date: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    images: [],
    building: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const locationRoomMap = {
    'Bowman-Oddy- Biology': 'Room 1235',
    'Bowman-Oddy- Chemistry': 'Room 2022',
    'Bowman-Oddy- Storeroom': 'Room 1073',
    'Carlson Library': 'Circulation Desk',
    'CPA': 'Room 1030',
    'Field House': 'Room 1500',
    'Gillham': 'Room 3100',
    'Health and Human Services': 'Room 3302',
    'Honors Academic Village': 'Front Desk',
    'Law Center': 'Room 2000K',
    'McMaster': 'Room 2017',
    'Nitschke': 'Room 1040',
    'Ottawa East': 'Front Desk',
    'Ottawa West': 'Front Desk',
    'Parks Tower': 'Front Desk',
    'President\'s Hall': 'Front Desk',
    'Rocket Hall': 'RSC 1200',
    'Rocket Hall cmpt lab': 'Computer Lab',
    'Savage Arena/Glass Bowl': 'Executive Assistant',
    'Snyder': 'Room 3000',
    'Stranahan North/Savage Business': 'Room 3130',
    'Stranahan South': 'Room 5017',
    'Student REC- Front': 'Front Center',
    'Student Union / Rocket Copy': 'Room 2525',
    'Tucker/Eberly Center': 'Room 168',
    'University Hall': 'Room 4260',
    'Wolfe': 'Room 1227',
    'Health Science Campus': 'Mulford Library 007'
  };
  
  const dropOffInstructions = formData.building ? 
    `Please drop off the found item at ${formData.building}: ${locationRoomMap[formData.building]}` : 
    'Please select a "Location" first.';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleImageChange = (e) => {
    // In a real implementation, this would handle file uploads
    // For now, we'll just store the file names
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to report an item');
      }
      
      // Create item data to send to the API
      const itemData = {
        type,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location || formData.building,
        building: formData.building,
        date: formData.date,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        imageUrl: null // We're not handling image uploads in this version
      };
      
      // Submit to the API
      const response = await fetch(API_ENDPOINTS.ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit item');
      }
      
      setSuccess(`Your ${type} item has been reported successfully. You can track its status using the reference number: ${data.reference_number}`);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        category: '',
        description: '',
        location: '',
        date: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        images: [],
        building: ''
      });
      
      // Redirect to track page after a delay
      setTimeout(() => {
        router.push(`/${type}`);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the form. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
        Report {type === 'lost' ? 'a Lost' : 'a Found'} Item
      </h2>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '1rem', 
          borderRadius: '0.25rem',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          color: '#2e7d32', 
          padding: '1rem', 
          borderRadius: '0.25rem',
          marginBottom: '1.5rem'
        }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Item Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Item Name*</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="e.g., Blue Backpack, iPhone 13, Student ID"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="books">Books</option>
              <option value="keys">Keys</option>
              <option value="id-cards">ID Cards</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              placeholder="Provide detailed description of the item (color, brand, distinguishing features, etc.)"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="building">Location*</label>
            <select
              id="building"
              name="building"
              className="form-control"
              value={formData.building}
              onChange={handleChange}
              required
            >
              <option value="">Select a location</option>
              <option value="Bowman-Oddy- Biology">Bowman-Oddy- Biology</option>
              <option value="Bowman-Oddy- Chemistry">Bowman-Oddy- Chemistry</option>
              <option value="Bowman-Oddy- Storeroom">Bowman-Oddy- Storeroom</option>
              <option value="Carlson Library">Carlson Library Circulation Desk</option>
              <option value="CPA">CPA</option>
              <option value="Field House">Field House</option>
              <option value="Gillham">Gillham</option>
              <option value="Health and Human Services">Health and Human Services</option>
              <option value="Honors Academic Village">Honors Academic Village Front Desk</option>
              <option value="Law Center">Law Center</option>
              <option value="McMaster">McMaster</option>
              <option value="Nitschke">Nitschke</option>
              <option value="Ottawa East">Ottawa East Front Desk</option>
              <option value="Ottawa West">Ottawa West Front Desk</option>
              <option value="Parks Tower">Parks Tower Front Desk</option>
              <option value="President\'s Hall">President\'s Hall Front Desk</option>
              <option value="Rocket Hall">Rocket Hall</option>
              <option value="Rocket Hall cmpt lab">Rocket Hall cmpt lab Computer Lab</option>
              <option value="Savage Arena/Glass Bowl">Savage Arena/Glass Bowl Executive Assistant</option>
              <option value="Snyder">Snyder</option>
              <option value="Stranahan North/Savage Business">Stranahan North/Savage Business</option>
              <option value="Stranahan South">Stranahan South</option>
              <option value="Student REC- Front">Student REC- Front Front Center</option>
              <option value="Student Union / Rocket Copy">Student Union / Rocket Copy</option>
              <option value="Tucker/Eberly Center">Tucker/Eberly Center</option>
              <option value="University Hall">University Hall</option>
              <option value="Wolfe">Wolfe</option>
              <option value="Health Science Campus">Health Science Campus Mulford Library</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="images">Images (Optional)</label>
            <input
              type="file"
              id="images"
              name="images"
              className="form-control"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--dark-gray)' }}>
              Upload images of the item to help with identification.
            </small>
          </div>
        </div>
        
        {type === 'found' && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--light-gray)', borderRadius: '0.25rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>Drop-off Instructions</h4>
            <p>{dropOffInstructions}</p>
          </div>
        )}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="contactName">Your Name*</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              className="form-control"
              value={formData.contactName || (user ? user.username : '')}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactEmail">Email*</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              className="form-control"
              value={formData.contactEmail || (user ? user.email : '')}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactPhone">Phone Number</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              className="form-control"
              placeholder="(419) XXX-XXXX"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : `Submit ${type === 'lost' ? 'Lost' : 'Found'} Item Report`}
        </button>
      </form>
    </div>
  );
} 