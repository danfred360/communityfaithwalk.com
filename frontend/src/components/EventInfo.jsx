export default function EventInfo() {
  return (
    <section className="event-info">
      <h2>Event Details</h2>

      <div className="info-item">
        <strong>Date:</strong>
        <span>Saturday, May 2, 2026</span>
      </div>

      <div className="info-item">
        <strong>Time:</strong>
        <span>10:00 AM</span>
      </div>

      <div className="info-item">
        <strong>Location:</strong>
        <span>Adamstown Park<br /> 272 W Main St<br />Adamstown, PA, 19501</span>
      </div>

      <div className="info-item">
        <strong>Description:</strong>
        <div>
          <p>Come join your neighbors for a fun community walk followed by a free lunch! It's a great chance to get outside, meet people in the area, and enjoy some good food together.</p>
          <br />
          <p>The event includes:</p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Community walk through the neighborhood</li>
            <li>Free lunch for all registered attendees</li>
            <li>Fun for all ages</li>
          </ul>
          <br />
          <p>All are welcome! RSVP below so we can have enough food ready for everyone.</p>
        </div>
      </div>
    </section>
  );
}
