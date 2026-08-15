// A per-tab/visit identifier, distinct from getAnonymousId()'s persistent
// (30-day, cross-visit) anon_id. sessionStorage is cleared when the tab
// closes, so this naturally scopes to "one browsing session" — used to
// group events for co-view/session-journey analytics (e.g. "customers who
// viewed X also viewed Y in the same session") without conflating a buyer's
// entire multi-day history into a single "session".
const SESSION_ID_KEY = 'session_id';

export const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

const generateSessionId = () => {
  return 'sess_' + Date.now().toString(36) + '_' +
         Math.random().toString(36).substring(2, 12);
};
