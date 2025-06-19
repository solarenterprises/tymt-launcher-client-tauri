export const authStorage = {
  get() {
    const data = localStorage.getItem('auth_secure');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  set(auth: any) {
    localStorage.setItem('auth_secure', JSON.stringify(auth));
  },

  remove() {
    localStorage.removeItem('auth_secure');
  }
};
