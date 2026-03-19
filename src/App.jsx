import CalendarContainer from './components/CalendarContainer';
import { Analytics } from '@vercel/analytics/react';
import './styles/paper.css';
import './styles/flip.css';

export default function App() {
  return (
    <>
      <CalendarContainer />
      <Analytics />
    </>
  );
}
