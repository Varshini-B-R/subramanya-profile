import React, { useState } from 'react';
import data from './profileData.json';
import myPhoto from './profile-pic.jpg'; 

function App() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // New state for the success card
  const [submittedName, setSubmittedName] = useState(''); // Remembers their name for the thank you message
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    const phoneDigits = formData.phone.replace(/[- ]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      newErrors.phone = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please share what you are experiencing.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide a bit more detail (at least 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "3a10d2aa-db2e-4837-9e6a-04dca8415ca4", // <-- PASTE YOUR KEY HERE
            subject: "New Therapy Consultation Request",
            from_name: formData.name,
            Phone: formData.phone,
            Message: formData.message,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSubmittedName(formData.name); // Save their name before clearing the form
          setFormData({ name: '', phone: '', message: '' }); // Clear the form
          setShowForm(false); // Hide the form
          setShowSuccess(true); // Show the beautiful success card
        } else {
          alert("Something went wrong. Please try again later.");
        }
      } catch (error) {
        alert("Network error. Please check your connection and try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#333', backgroundColor: '#fdfbf7', minHeight: '100vh', margin: 0, padding: 0, boxSizing: 'border-box' }}>
      
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '5vw', boxSizing: 'border-box' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '8vw' }}>
          <img 
            src={myPhoto} 
            alt={data.name} 
            style={{ width: '150px', height: '150px', maxWidth: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #eae1d8', marginBottom: '20px' }}
          />
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', margin: '0 0 10px 0', color: '#2c3e50' }}>{data.name}</h1>
          <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 'normal', color: '#7f8c8d', margin: 0, letterSpacing: '1px' }}>{data.title}</h2>
        </header>

        <hr style={{ border: 'none', borderTop: '1px solid #eae1d8', marginBottom: '40px' }} />

        <section style={{ marginBottom: '40px', lineHeight: '1.8' }}>
          <h3 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.5rem)', color: '#2c3e50', marginBottom: '15px' }}>About My Practice</h3>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.1rem)', color: '#555' }}>{data.about}</p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.5rem)', color: '#2c3e50', marginBottom: '15px' }}>How I Can Help</h3>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {data.specialties.map((specialty, index) => (
              <li key={index} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.03)', borderLeft: '4px solid #d4c4b7', fontSize: 'clamp(0.95rem, 2.5vw, 1rem)' }}>
                {specialty}
              </li>
            ))}
          </ul>
        </section>

        {/* Dynamic Contact Section */}
        <section style={{ backgroundColor: '#fff', padding: 'clamp(20px, 5vw, 30px)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          {showSuccess ? (
            // 1. The Success Card View
            <div style={{ animation: 'fadeIn 0.6s ease-in-out', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#d4c4b7' }}>✨</div>
              <h3 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.5rem)', color: '#2c3e50', marginBottom: '15px' }}>Thank You, {submittedName}</h3>
              <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px auto' }}>
                Your details have been securely received. Taking the first step is often the hardest, and I appreciate you reaching out. I will review your message and contact you shortly.
              </p>
              <button 
                onClick={() => setShowSuccess(false)}
                style={{ padding: '10px 24px', backgroundColor: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e6e8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ecf0f1'}
              >
                Return to Profile
              </button>
            </div>

          ) : !showForm ? (
            // 2. The Default Button View
            <>
              <h3 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.5rem)', color: '#2c3e50', marginBottom: '20px' }}>Get in Touch</h3>
              <div style={{ fontSize: 'clamp(1rem, 3vw, 1.1rem)', color: '#555', lineHeight: '1.8', marginBottom: '25px' }}>
                <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {data.contact.phone}</p>
                <p style={{ margin: '5px 0' }}><strong>Location:</strong> {data.contact.address}</p>
              </div>
              
              <button 
                onClick={() => setShowForm(true)}
                style={{ display: 'inline-block', border: 'none', cursor: 'pointer', padding: '12px 28px', backgroundColor: '#2c3e50', color: '#fff', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a252f'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}
              >
                Share Your Problem With Me
              </button>
            </>
          ) : (
            // 3. The Form View
            <div style={{ textAlign: 'left', animation: 'fadeIn 0.5s ease-in-out' }}>
              <h3 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.5rem)', color: '#2c3e50', marginBottom: '15px', textAlign: 'center' }}>Initial Intake Form</h3>
              <p style={{ color: '#7f8c8d', marginBottom: '20px', textAlign: 'center', fontSize: '0.95rem' }}>Please share a few details so I can better understand how to assist you. All information is kept strictly confidential.</p>
              
              <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleSubmit}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: 'bold' }}>Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.name ? '1px solid #e74c3c' : '1px solid #ccc', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  {errors.name && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: 'bold' }}>Your Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9876543210" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.phone ? '1px solid #e74c3c' : '1px solid #ccc', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  {errors.phone && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: 'bold' }}>What are you currently experiencing?</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Briefly describe what brings you here today..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.message ? '1px solid #e74c3c' : '1px solid #ccc', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}></textarea>
                  {errors.message && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.message}</span>}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '12px', backgroundColor: isSubmitting ? '#7f8c8d' : '#2c3e50', color: '#fff', border: 'none', borderRadius: '6px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <button type="button" disabled={isSubmitting} onClick={() => { setShowForm(false); setErrors({}); }} style={{ padding: '12px', backgroundColor: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: '6px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}

export default App;