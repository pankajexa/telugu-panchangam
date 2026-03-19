import CalendarContainer from './components/CalendarContainer';
import { LocationProvider } from './context/LocationContext';
import { Analytics } from '@vercel/analytics/react';
import './styles/paper.css';
import './styles/flip.css';

export default function App() {
  return (
    <LocationProvider>
      <CalendarContainer />
      <Analytics />
    </LocationProvider>
  );
}
