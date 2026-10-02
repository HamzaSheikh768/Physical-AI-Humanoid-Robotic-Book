import React from 'react';
import Layout from '@theme/Layout';
import AnimatedLoginForm from '../components/auth/AnimatedLoginForm';
import styles from '../components/auth/auth.module.css';

const LoginPage = () => {
  return (
    <Layout title="Login" description="Login to your account">
      <div className={styles.authContainer}>
        <div className={styles.authForm}>
          <h1 className={styles.authHeading}>Login</h1>
          <p className={styles.authSubtitle}>Access your account to continue your robotics journey</p>
          <AnimatedLoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;