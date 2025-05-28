const tymtStorage = {
  set(key: string, value: any) {
    if (value === undefined) return;
    const stringify = JSON.stringify(value);
    localStorage.setItem(key, stringify);
  },
  get(key: string, defaultValue = "") {
    const stringify = localStorage.getItem(key);
    if (!stringify) return defaultValue;
    try {
      return JSON.parse(stringify);
    } catch (err) {
      console.error("Failed to parse value from localStorage for key:", key, err);
      return defaultValue;
    }
  },
  clear() {
    localStorage.clear();
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
};

export const SPOT_ACTIVE_PAIR_KEYS = "spotDashboard";
export const MARGIN_ACITVE_PAIR_KEYS = "marginDashboard";
export const WALLET_ADDRESS = "metamask_address";
export const METAMASK_CONNECTED = "metamask_connected";
export const INITIAL_GUNBOT_SETUP_MODE = "initial_gunbot_setup_mode";

export default tymtStorage;
