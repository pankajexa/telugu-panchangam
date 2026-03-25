import React, { useState } from 'react';
import ShlokaList from '../components/shlokas/ShlokaList';
import ShlokaDetail from '../components/shlokas/ShlokaDetail';

export default function ShlokasPage() {
  const [selectedShloka, setSelectedShloka] = useState(null);

  return (
    <div style={styles.page}>
      <ShlokaList onSelectShloka={setSelectedShloka} />

      {selectedShloka && (
        <ShlokaDetail
          shloka={selectedShloka}
          onClose={() => setSelectedShloka(null)}
          onNavigate={setSelectedShloka}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
};
