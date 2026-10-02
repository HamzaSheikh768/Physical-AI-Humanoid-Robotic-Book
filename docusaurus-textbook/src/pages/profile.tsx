import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

const ProfilePage = () => {
  // Check if user is authenticated using localStorage
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('authToken') !== null;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return (
      <Layout title="Redirecting..." description="Redirecting to login">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <div className="card">
                <div className="card__header">
                  <h2>Redirecting...</h2>
                </div>
                <div className="card__body">
                  <p>Redirecting to login page...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Load user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save updated profile data to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userName', name);
      if (email) localStorage.setItem('userEmail', email);
    }

    // Show success message
    alert('Profile updated successfully!');

    // Optionally redirect back to dashboard
    // window.location.href = '/dashboard';
  };

  return (
    <Layout title="Edit Profile" description="Edit your profile information">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="card">
              <div className="card__header text--center">
                <h2>Edit Profile</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="card__body">
                  <div className="form-group margin-bottom--md">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group margin-bottom--md">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="card__footer text--center">
                  <button type="submit" className="button button--primary button--lg margin-right--md">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="button button--outline button--secondary button--lg margin-right--md"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="button button--secondary button--lg"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    Back to Dashboard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;