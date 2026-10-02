import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerChild, buttonVariants, fieldVariants, spinnerVariants } from '../../animations/variants';
import styles from './auth.module.css';

const AnimatedSignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    softwareBackground: '',
    hardwareExperience: '',
    learningTrack: 'SOFTWARE_ONLY',
    skillLevel: 'BEGINNER'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // Simple authentication logic using localStorage (similar to login form)
    // In a real app, you would register the user with a backend
    // For this example, we'll just set a mock token
    localStorage.setItem('authToken', 'mock-auth-token');
    localStorage.setItem('userName', formData.email.split('@')[0]); // Use email prefix as username
    localStorage.setItem('userEmail', formData.email);

    // Store additional profile information
    if (formData.softwareBackground) localStorage.setItem('softwareBackground', formData.softwareBackground);
    if (formData.hardwareExperience) localStorage.setItem('hardwareExperience', formData.hardwareExperience);
    if (formData.learningTrack) localStorage.setItem('learningTrack', formData.learningTrack);
    if (formData.skillLevel) localStorage.setItem('skillLevel', formData.skillLevel);

    // Redirect to dashboard after successful signup
    window.location.href = '/dashboard';
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
          Create Account
        </motion.h2>

        {error && (
          <motion.div
            id="signup-error-message"
            className={styles.error}
            variants={fieldVariants}
            initial="error"
            animate="animate"
            role="alert"
            aria-live="polite"
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          role="form"
          aria-label="Sign up form"
        >
          {/* Account Credentials Section */}
          <motion.div
            className={styles.sectionGroup}
            variants={staggerChild}
          >
            <h3 className={styles.sectionTitle}>Account Credentials</h3>
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
                name="email"
                value={formData.email}
                onChange={(e) => {
                  handleChange(e);
                  if (error) setError(null);
                }}
                required
                className={styles.inputField}
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                disabled={loading}
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "signup-error-message" : undefined}
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
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  if (error) setError(null);
                }}
                required
                className={styles.inputField}
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                disabled={loading}
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "signup-error-message" : undefined}
                placeholder="Enter your password"
              />
            </motion.div>
          </motion.div>

          {/* Learning Background Section */}
          <motion.div
            className={styles.sectionGroup}
            variants={staggerChild}
          >
            <h3 className={styles.sectionTitle}>Learning Background</h3>
            <motion.div
              className={styles.inputGroup}
              variants={staggerChild}
            >
              <label htmlFor="softwareBackground" className={styles.label}>
                Software Background
              </label>
              <motion.textarea
                id="softwareBackground"
                name="softwareBackground"
                value={formData.softwareBackground}
                onChange={(e) => {
                  handleChange(e);
                  if (error) setError(null);
                }}
                placeholder="e.g., ROS2, Python, JavaScript, C++, etc."
                className={styles.inputField}
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                disabled={loading}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "signup-error-message" : undefined}
              />
            </motion.div>

            <motion.div
              className={styles.inputGroup}
              variants={staggerChild}
            >
              <label htmlFor="hardwareExperience" className={styles.label}>
                Hardware/Robotics Experience
              </label>
              <motion.textarea
                id="hardwareExperience"
                name="hardwareExperience"
                value={formData.hardwareExperience}
                onChange={(e) => {
                  handleChange(e);
                  if (error) setError(null);
                }}
                placeholder="e.g., Arduino, ESP32, Raspberry Pi, electronics experience, etc."
                className={styles.inputField}
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                disabled={loading}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "signup-error-message" : undefined}
              />
            </motion.div>

            <motion.div
              className={styles.inputGroup}
              variants={staggerChild}
            >
              <label htmlFor="learningTrack" className={styles.label}>
                Learning Track
              </label>
              <motion.select
                id="learningTrack"
                name="learningTrack"
                value={formData.learningTrack}
                onChange={(e) => {
                  handleChange(e);
                  if (error) setError(null);
                }}
                className={styles.inputField}
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                disabled={loading}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "signup-error-message" : undefined}
              >
                <option value="SOFTWARE_ONLY">Software Only</option>
                <option value="HARDWARE_ONLY">Hardware Only</option>
                <option value="FULL_ROBOTICS">Full Robotics</option>
              </motion.select>
            </motion.div>

            <motion.div
              className={styles.inputGroup}
              variants={staggerChild}
            >
              <label htmlFor="skillLevel" className={styles.label}>
                Skill Level
              </label>
              <motion.select
                id="skillLevel"
                name="skillLevel"
                value={formData.skillLevel}
                onChange={(e) => {
                  handleChange(e);
                  if (error) setError(null);
                }}
                className={styles.inputField}
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                disabled={loading}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "signup-error-message" : undefined}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </motion.select>
            </motion.div>
          </motion.div>

          <motion.button
            type="submit"
            className={styles.submitButton}
            variants={buttonVariants}
            disabled={loading}
            aria-label={loading ? "Creating account in progress" : "Sign up for new account"}
          >
            {loading ? (
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </motion.form>

        <motion.div
          className="card__footer margin-top--md"
          variants={staggerChild}
        >
          <p>
            Already have an account?{' '}
            <motion.a
              href="/login"
              className={styles.toggleButton}
              variants={buttonVariants}
            >
              Login
            </motion.a>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedSignupForm;