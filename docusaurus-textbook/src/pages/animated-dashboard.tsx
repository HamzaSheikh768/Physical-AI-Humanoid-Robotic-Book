import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import { staggerContainer, staggerChild } from '../animations/variants';
import AnimatedDashboardLayout from '../components/auth/AnimatedDashboardLayout';
import DashboardCard from '../components/auth/DashboardCard';

const AnimatedDashboardPage = () => {
  // Check if user is authenticated using localStorage
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('authToken') !== null;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return (
      <Layout title="Redirecting..." description="Redirecting to login">
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', color: '#94a3b8' }}>Redirecting to login...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') || 'User' : 'User';

  // Mock sidebar content for dashboard
  const sidebarContent = (
    <div className="card">
      <div className="card__header">
        <h3>Navigation</h3>
      </div>
      <div className="card__body">
        <ul className="clean-list">
          <li className="margin-bottom--sm"><a href="/dashboard" className="button button--block button--link">Dashboard</a></li>
          <li className="margin-bottom--sm"><a href="/profile" className="button button--block button--link">Profile</a></li>
          <li className="margin-bottom--sm"><a href="/settings" className="button button--block button--link">Settings</a></li>
          <li className="margin-bottom--sm"><a href="/courses" className="button button--block button--link">Courses</a></li>
          <li className="margin-bottom--sm"><a href="/resources" className="button button--block button--link">Resources</a></li>
        </ul>
      </div>
    </div>
  );

  return (
    <Layout title="Dashboard" description="User dashboard">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatedDashboardLayout
          sidebar={sidebarContent}
          header={
            <motion.div variants={staggerChild} className="text--center padding--md">
              <motion.h1 variants={staggerChild} className="text--bold">
                Welcome, {userName}!
              </motion.h1>
              <motion.p variants={staggerChild} className="text--normal">
                Your personalized dashboard
              </motion.p>
            </motion.div>
          }
        >
          <motion.div variants={staggerContainer} className="row margin-bottom--lg">
            <motion.div variants={staggerChild} className="col col--6">
              <DashboardCard
                title="Profile"
                subtitle="View your account information"
              >
                <motion.button
                  className="button button--primary button--block"
                  onClick={() => {
                    // Show profile details
                    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email') || 'Not provided';
                    const hardwareExperience = localStorage.getItem('hardwareExperience') || 'Not provided';
                    const learningTrack = localStorage.getItem('learningTrack') || 'Not provided';
                    const skillLevel = localStorage.getItem('skillLevel') || 'Not provided';

                    let trackText = 'Not provided';
                    switch(learningTrack) {
                      case 'software':
                        trackText = 'Software Only (AI, simulation, control, backend systems)';
                        break;
                      case 'hardware':
                        trackText = 'Hardware Only (electronics, embedded systems, physical robotics)';
                        break;
                      case 'full-robotics':
                        trackText = 'Full Robotics (end-to-end integration of software and hardware)';
                        break;
                      default:
                        trackText = learningTrack;
                    }

                    let levelText = 'Not provided';
                    switch(skillLevel) {
                      case 'beginner':
                        levelText = 'Beginner – limited or introductory experience';
                        break;
                      case 'intermediate':
                        levelText = 'Intermediate – practical project experience';
                        break;
                      case 'advanced':
                        levelText = 'Advanced – professional or research-level experience';
                        break;
                      default:
                        levelText = skillLevel;
                    }

                    alert(`Profile Information:\nName: ${userName}\nEmail: ${userEmail}\n\nHardware/Robotics Experience: ${hardwareExperience}\n\nLearning Track: ${trackText}\n\nSkill Level: ${levelText}`);
                  }}
                >
                  View Profile
                </motion.button>
              </DashboardCard>
            </motion.div>

            <motion.div variants={staggerChild} className="col col--6">
              <DashboardCard
                title="Settings"
                subtitle="Edit your profile information"
              >
                <motion.button
                  className="button button--primary button--block"
                  onClick={() => {
                    // Redirect to profile editing page (we'll create this)
                    window.location.href = '/profile';
                  }}
                >
                  Edit Profile
                </motion.button>
              </DashboardCard>
            </motion.div>
          </motion.div>

          <motion.div variants={staggerChild} className="card__footer text--center padding--md">
            <motion.button
              onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userName');
                window.location.href = '/';
              }}
              className="button button--outline button--secondary"
            >
              Sign Out
            </motion.button>
          </motion.div>
        </AnimatedDashboardLayout>
      </motion.div>
    </Layout>
  );
};

export default AnimatedDashboardPage;