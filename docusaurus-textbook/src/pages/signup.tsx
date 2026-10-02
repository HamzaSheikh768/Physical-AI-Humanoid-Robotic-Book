import React from 'react';
import Layout from '@theme/Layout';
import AnimatedSignupForm from '../components/auth/AnimatedSignupForm';
import styles from '../components/auth/auth.module.css';

const SignupPage = () => {
  return (
    <Layout title="Sign Up" description="Create a new account">
      <div className={styles.authContainer}>
        <div className={styles.authForm}>
          <h1 className={styles.authHeading}>Create Account</h1>
          <p className={styles.authSubtitle}>Join our robotics community to start your learning journey</p>
          <AnimatedSignupForm />
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;