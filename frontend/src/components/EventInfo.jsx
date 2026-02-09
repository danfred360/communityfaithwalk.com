export default function EventInfo() {
  return (
    <section className="event-info">
      <h2>Event Details</h2>

      <div className="info-item">
        <strong>Date:</strong>
        <span>Saturday, June 14, 2026</span>
      </div>

      <div className="info-item">
        <strong>Time:</strong>
        <span>9:00 AM - 2:00 PM</span>
      </div>

      <div className="info-item">
        <strong>Location:</strong>
        <span>Cocalico Community Church<br />1200 West Swartzville Road<br />Reinholds, PA 17569</span>
      </div>

      <div className="info-item">
        <strong>Description:</strong>
        <div>
          <p>Join us for our annual Faith Walk event! This special day brings our church community together for fellowship, worship, and a scenic walk through our beautiful neighborhood.</p>
          <br />
          <p>The event includes:</p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Morning worship service</li>
            <li>Guided community walk (2-3 miles)</li>
            <li>Lunch fellowship (optional)</li>
            <li>Activities for all ages</li>
          </ul>
          <br />
          <p>All are welcome! Please RSVP below so we can plan accordingly, especially for lunch.</p>
        </div>
      </div>
    </section>
  );
}
