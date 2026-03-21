import CalendarPad from '../components/CalendarPad';

export default function CalendarPage() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.calendarArea}>
        <CalendarPad />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '432px',
    margin: '0 auto',
    boxSizing: 'border-box',
    overflow: 'visible',
  },
  calendarArea: {
    width: '100%',
    padding: '0 10px',
    boxSizing: 'border-box',
  },
};
