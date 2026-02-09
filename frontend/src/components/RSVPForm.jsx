import { useState } from 'react';
import { submitRSVP } from '../utils/api';

export default function RSVPForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendees: 1,
    lunch: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.name || !formData.email || !formData.attendees) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    if (formData.attendees < 1) {
      setMessage({ type: 'error', text: 'Number of attendees must be at least 1.' });
      return;
    }

    setLoading(true);

    try {
      await submitRSVP(formData);
      setMessage({
        type: 'success',
        text: 'Thank you for your RSVP! We look forward to seeing you at the event.',
      });
      setFormData({
        name: '',
        email: '',
        attendees: 1,
        lunch: false,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to submit RSVP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>RSVP for the Event</h2>
      <p className="form-description">
        Please let us know if you'll be joining us! This helps us plan for lunch and activities.
      </p>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="attendees">
            Number of Attendees <span className="required">*</span>
          </label>
          <input
            type="number"
            id="attendees"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
            min="1"
            max="20"
            required
          />
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="lunch"
              name="lunch"
              checked={formData.lunch}
              onChange={handleChange}
            />
            <label htmlFor="lunch">
              I would like a free lunch
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className={loading ? 'button-loading' : ''}>
          {loading ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </section>
  );
}
