import EventInfo from './components/EventInfo';
import RSVPForm from './components/RSVPForm';
import EmailSignup from './components/EmailSignup';
import './styles/main.css';

function App() {
  return (
    <div className="app">
      <header>
        <img src="/logo.png" alt="Community Faith Walk" className="header-logo" />
        <p>Come walk with purpose. All are welcome!</p>
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
