import EventInfo from './components/EventInfo';
import RSVPForm from './components/RSVPForm';
import EmailSignup from './components/EmailSignup';
import './styles/main.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Community Faith Walk 2026</h1>
        <p>Join us for a day of fellowship, worship, and community</p>
      </header>

      <main>
        <EventInfo />
        <RSVPForm />
        <EmailSignup />
      </main>

      <footer>
        <p>&copy; 2026 Cocalico Community Church. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
