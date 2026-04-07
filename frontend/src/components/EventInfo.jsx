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
          <p>Join us for our annual Faith Walk event! This special day brings our church community together for fellowship, worship, and a scenic walk through our beautiful neighborhood.</p>
          <br />
          <p>The event includes:</p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Community prayer walk</li>
            <li>Lunch fellowship (optional)</li>
            <li>Welcoming for all ages</li>
            <li>Local vendors offering additional food</li>
          </ul>
          <br />
          <p>All are welcome! Please RSVP below so we can plan accordingly, especially for lunch.</p>
        </div>
      </div>
    </section>
  );
}
