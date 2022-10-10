export const setItem = (key, value) => {
  if (typeof value === 'string') {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getItem = (key) => localStorage.getItem(key);
