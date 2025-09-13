import { useEffect, useState } from 'react';

const COOKIE_NOTICE_KEY = 'cookieNoticeDismissed';

export default function CookieNotice() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = window.localStorage.getItem(COOKIE_NOTICE_KEY);
      setVisible(!dismissed);
    }
  }, []);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(COOKIE_NOTICE_KEY, 'true');
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#222',
      color: '#fff',
      padding: '1rem',
      textAlign: 'center',
      zIndex: 1000,
      boxShadow: '0 -2px 8px rgba(0,0,0,0.2)'
    }}>
      This website uses cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.
      <button
        type="button"
        onClick={handleDismiss}
        style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#fff', color: '#222', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        OK
      </button>
    </div>
  );
}
