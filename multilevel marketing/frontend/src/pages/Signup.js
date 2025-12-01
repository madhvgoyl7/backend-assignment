import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import './Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    member_code: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    sponsor_code: '',
    position: ''
  });
  
  const [sponsorInfo, setSponsorInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingSponsor, setValidatingSponsor] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear sponsor info if sponsor code is changed
    if (name === 'sponsor_code' && sponsorInfo) {
      setSponsorInfo(null);
      setFormData(prev => ({ ...prev, position: '' }));
    }
  };

  const validateSponsor = async () => {
    if (!formData.sponsor_code) {
      setError('Please enter a sponsor code');
      return;
    }
    
    setError('');
    setValidatingSponsor(true);
    
    try {
      const response = await axios.post('/validate-sponsor', {
        sponsor_code: formData.sponsor_code
      });
      
      if (response.data.valid) {
        setSponsorInfo(response.data);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid sponsor code');
      setSponsorInfo(null);
    } finally {
      setValidatingSponsor(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.member_code || !formData.name || !formData.email || 
        !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // If sponsor is provided, validate it first
    if (formData.sponsor_code && !sponsorInfo) {
      setError('Please validate the sponsor code first');
      return;
    }
    
    // If sponsor has no direct positions available and no position selected, show warning
    if (sponsorInfo && !sponsorInfo.left_available && !sponsorInfo.right_available && !formData.position) {
      // Auto-spill will handle this, just inform the user
      console.log('Auto-spill will be applied');
    }
    
    setLoading(true);
    
    const result = await signup({
      member_code: formData.member_code,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      sponsor_code: formData.sponsor_code || null,
      position: formData.position || null
    });
    
    setLoading(false);
    
    if (result.success) {
      alert(`Registration successful!\nMember Code: ${result.data.member_code}\n${
        result.data.placement 
          ? `Placed under: ${result.data.placement.parent} (${result.data.placement.position})${
              result.data.placement.spilled ? ' - Auto-spilled' : ''
            }`
          : 'You are the root member'
      }`);
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  const isRootMember = !formData.sponsor_code;

  return (
    <div className="auth-container">
      <div className="auth-box signup-box">
        <div className="auth-header">
          <h1 className="auth-title">Join Our Network</h1>
          <p className="auth-subtitle">Create your MLM account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="member_code">Member Code *</label>
              <input
                type="text"
                id="member_code"
                name="member_code"
                value={formData.member_code}
                onChange={handleChange}
                placeholder="Your unique code"
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <div className="sponsor-section">
            <div className="form-group">
              <label htmlFor="sponsor_code">
                Sponsor Code {!isRootMember && '*'}
                <span className="label-hint">(Leave empty if you're the first member)</span>
              </label>
              <div className="sponsor-input-group">
                <input
                  type="text"
                  id="sponsor_code"
                  name="sponsor_code"
                  value={formData.sponsor_code}
                  onChange={handleChange}
                  placeholder="Enter sponsor code"
                  disabled={loading}
                />
                {formData.sponsor_code && (
                  <button
                    type="button"
                    onClick={validateSponsor}
                    disabled={validatingSponsor || loading}
                    className="validate-button"
                  >
                    {validatingSponsor ? 'Checking...' : 'Validate'}
                  </button>
                )}
              </div>
            </div>
            
            {sponsorInfo && (
              <div className="sponsor-info">
                <div className="sponsor-valid">
                  ✓ Sponsor: <strong>{sponsorInfo.sponsor_name}</strong>
                </div>
                <div className="sponsor-positions">
                  <p className="position-status">
                    Left Position: {sponsorInfo.left_available ? '✓ Available' : '✗ Filled'}
                  </p>
                  <p className="position-status">
                    Right Position: {sponsorInfo.right_available ? '✓ Available' : '✗ Filled'}
                  </p>
                  {!sponsorInfo.left_available && !sponsorInfo.right_available && (
                    <p className="auto-spill-notice">
                      ⚠ Both positions filled. Auto-spill will place you in the first available position in downline.
                    </p>
                  )}
                </div>
                
                {(sponsorInfo.left_available || sponsorInfo.right_available) && (
                  <div className="form-group">
                    <label>Preferred Position</label>
                    <div className="position-select">
                      {sponsorInfo.left_available && (
                        <label className="position-option">
                          <input
                            type="radio"
                            name="position"
                            value="left"
                            checked={formData.position === 'left'}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          <span>Left</span>
                        </label>
                      )}
                      {sponsorInfo.right_available && (
                        <label className="position-option">
                          <input
                            type="radio"
                            name="position"
                            value="right"
                            checked={formData.position === 'right'}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          <span>Right</span>
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
