import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const { font, language } = useLanguage();
  const isTe = language === 'te';

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={20} color="#666" strokeWidth={1.8} />
          </button>
          <h1 style={{ ...styles.title, fontFamily: font }}>
            {isTe ? 'గోప్యతా విధానం' : 'Privacy Policy'}
          </h1>
        </div>

        <div style={styles.lastUpdated}>
          {isTe ? 'చివరిగా నవీకరించబడింది' : 'Last updated'}: March 2026
        </div>

        <Section title={isTe ? 'పరిచయం' : 'Introduction'}>
          <P>
            {isTe
              ? 'మనCalendar (మనCalendar) అనేది తెలుగు పంచాంగం యాప్. ఈ యాప్ మీ ప్రైవసీని గౌరవిస్తుంది మరియు మీ వ్యక్తిగత డేటాను రక్షిస్తుంది.'
              : 'ManaCalendar (మనCalendar) is a Telugu Panchangam (Hindu calendar) app. This app respects your privacy and protects your personal data.'}
          </P>
        </Section>

        <Section title={isTe ? 'మేము సేకరించే డేటా' : 'Data We Collect'}>
          <P>
            {isTe
              ? 'ఈ యాప్ కింది డేటాను మీ పరికరంలో మాత్రమే నిల్వ చేస్తుంది (సర్వర్‌కు ఏమీ పంపబడదు):'
              : 'This app stores the following data only on your device (nothing is sent to any server):'}
          </P>
          <Bullet>{isTe ? 'మీ ఎంచుకున్న ప్రదేశం (నగరం/లొకేషన్) — పంచాంగ గణనల కోసం' : 'Your selected location (city) — for panchangam calculations'}</Bullet>
          <Bullet>{isTe ? 'భాష ప్రాధాన్యత (తెలుగు/ఇంగ్లీష్)' : 'Language preference (Telugu/English)'}</Bullet>
          <Bullet>{isTe ? 'నోటిఫికేషన్ సెట్టింగ్‌లు (రిమైండర్ సమయాలు, టోగుల్‌లు)' : 'Notification settings (reminder times, toggles)'}</Bullet>
          <Bullet>{isTe ? 'పంచాంగ ప్రదర్శన ప్రాధాన్యతలు' : 'Panchangam display preferences'}</Bullet>
        </Section>

        <Section title={isTe ? 'డేటా నిల్వ' : 'Data Storage'}>
          <P>
            {isTe
              ? 'అన్ని డేటా మీ పరికరంలో (localStorage) మాత్రమే నిల్వ చేయబడుతుంది. ఏ డేటాను బాహ్య సర్వర్‌లకు పంపబడదు, సేకరించబడదు లేదా విక్రయించబడదు.'
              : 'All data is stored locally on your device (localStorage) only. No data is transmitted to external servers, collected, or sold.'}
          </P>
        </Section>

        <Section title={isTe ? 'థర్డ్-పార్టీ సేవలు' : 'Third-Party Services'}>
          <P>
            {isTe
              ? 'Android యాప్ ఎటువంటి అనలిటిక్స్, ట్రాకింగ్ లేదా ప్రకటన SDKలను ఉపయోగించదు. మీ ఉపయోగ డేటా ఏదీ సేకరించబడదు.'
              : 'The Android app does not use any analytics, tracking, or advertising SDKs. No usage data is collected.'}
          </P>
          <P>
            {isTe
              ? 'వెబ్ వెర్షన్ (manacalendar.com) అనామక పేజీ వీక్షణ అనలిటిక్స్ కోసం Vercel Analyticsను ఉపయోగిస్తుంది.'
              : 'The web version (manacalendar.com) uses Vercel Analytics for anonymous page view analytics only.'}
          </P>
        </Section>

        <Section title={isTe ? 'అనుమతులు' : 'Permissions'}>
          <Bullet>{isTe ? 'ఇంటర్నెట్ — యాప్ అనుమతుల కోసం (PWA)' : 'Internet — required for app loading (PWA)'}</Bullet>
          <Bullet>{isTe ? 'నోటిఫికేషన్లు — పండుగ/వ్రతం/సంధ్య రిమైండర్లు (ఐచ్ఛికం, మీరు ఎనేబుల్ చేసినప్పుడు మాత్రమే)' : 'Notifications — festival/vrat/sandhya reminders (optional, only when you enable)'}</Bullet>
          <Bullet>{isTe ? 'వైబ్రేషన్ — నోటిఫికేషన్ అలర్ట్‌ల కోసం' : 'Vibration — for notification alerts'}</Bullet>
        </Section>

        <Section title={isTe ? 'డేటా తొలగింపు' : 'Data Deletion'}>
          <P>
            {isTe
              ? 'మీరు ఎప్పుడైనా "సెట్టింగ్‌లు → యాప్‌లు → మనCalendar → డేటా క్లియర్" ద్వారా అన్ని డేటాను తొలగించవచ్చు. యాప్‌ను అన్‌ఇన్‌స్టాల్ చేస్తే అన్ని డేటా తొలగించబడుతుంది.'
              : 'You can delete all data at any time via "Settings → Apps → ManaCalendar → Clear Data". Uninstalling the app removes all data.'}
          </P>
        </Section>

        <Section title={isTe ? 'పిల్లల గోప్యత' : "Children's Privacy"}>
          <P>
            {isTe
              ? 'ఈ యాప్ 13 సంవత్సరాల కంటే తక్కువ వయస్సు ఉన్న పిల్లల నుండి తెలిసి వ్యక్తిగత సమాచారాన్ని సేకరించదు.'
              : 'This app does not knowingly collect personal information from children under 13.'}
          </P>
        </Section>

        <Section title={isTe ? 'సంప్రదించండి' : 'Contact'}>
          <P>
            {isTe
              ? 'ఈ గోప్యతా విధానం గురించి ప్రశ్నలు ఉంటే, దయచేసి pankaj@exargen.com కు ఇమెయిల్ చేయండి.'
              : 'If you have questions about this privacy policy, please email pankaj@exargen.com.'}
          </P>
        </Section>

        <div style={styles.footer}>
          © 2026 మనCalendar. {isTe ? 'అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.' : 'All rights reserved.'}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={styles.para}>{children}</p>;
}

function Bullet({ children }) {
  return (
    <div style={styles.bulletRow}>
      <span style={styles.bulletDot}>•</span>
      <span style={styles.bulletText}>{children}</span>
    </div>
  );
}

const styles = {
  page: { width: '100%', maxWidth: '480px', margin: '0 auto' },
  content: { padding: '8px 20px 100px' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px', display: 'flex', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 700, color: '#1A1A1A', fontFamily: "'Playfair Display', serif", margin: 0 },
  lastUpdated: { fontSize: 12, color: '#999', marginBottom: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  para: { fontSize: 14, lineHeight: 1.7, color: '#444', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  bulletRow: { display: 'flex', gap: 8, marginBottom: 6, paddingLeft: 4 },
  bulletDot: { color: '#E63B2E', fontWeight: 700, fontSize: 16, lineHeight: 1.5, flexShrink: 0 },
  bulletText: { fontSize: 14, lineHeight: 1.6, color: '#444', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  footer: { marginTop: 32, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: 12, color: '#BBB', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" },
};
