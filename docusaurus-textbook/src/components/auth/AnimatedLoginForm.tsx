import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerChild, buttonVariants, fieldVariants, spinnerVariants } from '../../animations/variants';
import { useAuth } from '../../contexts/AuthContext';
import styles from './auth.module.css';

const AnimatedLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, login, clearError } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!email || !password) {
      clearError(); // Use the existing clearError function from context
      // We'll set the error using the context's setError method
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      clearError(); // Use the existing clearError function from context
      // We'll set the error using the context's setError method
      return;
    }

    // Validate password length
    if (password.length < 8) {
      clearError(); // Use the existing clearError function from context
      // We'll set the error using the context's setError method
      return;
    }

    try {
      await login(email, password);
      // Reset form
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <motion.div
      className={styles.authContainer}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className={styles.authForm}
        variants={staggerChild}
      >
        <motion.h2
          variants={staggerChild}
          className="margin-bottom--md"
        >
          Login
        </motion.h2>

        {state.error && (
          <motion.div
            id="login-error-message"
            className={styles.error}
            variants={fieldVariants}
            initial="error"
            animate="animate"
            role="alert"
            aria-live="polite"
          >
            {state.error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          role="form"
          aria-label="Login form"
        >
          <motion.div
            className={styles.inputGroup}
            variants={staggerChild}
          >
            <label htmlFor="email" className={styles.label}>
              Email *
            </label>
            <motion.input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state.error) clearError();
              }}
              required
              className={styles.inputField}
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
              aria-required="true"
              aria-invalid={state.error ? "true" : "false"}
              aria-describedby={state.error ? "login-error-message" : undefined}
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div
            className={styles.inputGroup}
            variants={staggerChild}
          >
            <label htmlFor="password" className={styles.label}>
              Password *
            </label>
            <motion.input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (state.error) clearError();
              }}
              required
              minLength={8}
              className={styles.inputField}
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
              aria-required="true"
              aria-invalid={state.error ? "true" : "false"}
              aria-describedby={state.error ? "login-error-message" : undefined}
              placeholder="Enter your password"
            />
          </motion.div>

          <motion.button
            type="submit"
            className={`${styles.submitButton} button button--primary button--block margin-top--md`}
            variants={buttonVariants}
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <motion.span
                variants={spinnerVariants}
                animate="animate"
                className="margin-right--sm"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  <path
                    d="M12 2C17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4V2Z"
                    fill="currentColor"
                  />
                </svg>
              </motion.span>
            ) : null}
            {state.isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </motion.form>

        <motion.p
          className={`${styles.toggleText} margin-top--md`}
          variants={staggerChild}
        >
          Don't have an account?{' '}
          <motion.a
            href="/signup"
            className={styles.toggleButton}
            variants={buttonVariants}
          >
            Sign Up
          </motion.a>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLoginForm;