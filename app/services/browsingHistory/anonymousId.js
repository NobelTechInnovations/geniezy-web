const ANONYMOUS_ID_KEY = 'browsing_history_anon_id';

export const getAnonymousId = () => {
  let anonId = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!anonId) {
    anonId = generateAnonymousId();
    localStorage.setItem(ANONYMOUS_ID_KEY, anonId);
  }
  return anonId;
};

const generateAnonymousId = () => {
  return 'anon_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const clearAnonymousId = () => {
  localStorage.removeItem(ANONYMOUS_ID_KEY);
}; 