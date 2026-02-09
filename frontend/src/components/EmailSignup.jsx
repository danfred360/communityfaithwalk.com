import { useState } from 'react';
import { submitEmailSignup } from '../utils/api';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    setLoading(true);

    try {
      await submitEmailSignup(email);
      setMessage({
        type: 'success',
        text: 'Thank you! You\'ll receive updates about the Faith Walk event.',
      });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to sign up. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Stay Updated</h2>
      <p className="form-description">
        Sign up to receive email updates about the Faith Walk event.
      </p>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="signup-email">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="signup-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your.email@example.com"
          />
        </div>

        <button type="submit" disabled={loading} className={loading ? 'button-loading' : ''}>
          {loading ? 'Signing Up...' : 'Sign Up for Updates'}
        </button>
      </form>
    </section>
  );
}
