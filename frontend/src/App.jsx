import EventInfo from './components/EventInfo';
import RSVPForm from './components/RSVPForm';
import EmailSignup from './components/EmailSignup';
import './styles/main.css';

function App() {
  return (
    <div className="app">
      <header>
        <img src="/logo.png" alt="Community Faith Walk" className="header-logo" />
        <p>A community walk and free lunch — everyone's invited!</p>
      </header>

      <main>
        <EventInfo />
        <RSVPForm />
        <EmailSignup />
      </main>

      <footer>
        <p>&copy; 2026 Community Faith Walk. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
