export const CONFIG_PRODUCTION_VERSION = import.meta.env.VITE_APP_PRODUCTION_VERSION;
export const CONFIG_NETWORK_NAME = import.meta.env.VITE_APP_NETWORK_NAME;
export const CONFIG_LOCAL_SERVER_PORT = import.meta.env.VITE_APP_LOCAL_SERVER_PORT;

export const CONFIG_TYMT_BACKEND_URL =
  import.meta.env.VITE_APP_PRODUCTION_VERSION === "prod" ? import.meta.env.VITE_APP_TYMT_BACKEND_URL : import.meta.env.VITE_APP_TYMT_BACKEND_DEV_URL;
export const CONFIG_TYMT_SOCKET_BACKEND_URL =
  import.meta.env.VITE_APP_PRODUCTION_VERSION === "prod" ? import.meta.env.VITE_APP_SOCKET_BACKEND_URL : import.meta.env.VITE_APP_SOCKET_BACKEND_DEV_URL;
export const CONFIG_TYMT_AVATAR_URL =
  import.meta.env.VITE_APP_PRODUCTION_VERSION === "prod" ? import.meta.env.VITE_APP_TYMT_AVATAR_URL : import.meta.env.VITE_APP_TYMT_AVATAR_DEV_URL;

export const CONFIG_NOWNODES_URL = import.meta.env.VITE_APP_NOWNODES_URL;

export const CONFIG_TYMT_RELEASE_DATE = import.meta.env.VITE_APP_TYMT_RELEASE_DATE;
export const CONFIG_TYMT_VERSION = import.meta.env.VITE_APP_TYMT_VERSION;

export const CONFIG_SOLAR_API_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_SOLAR_API_URL : import.meta.env.VITE_APP_TESTNET_SOLAR_API_URL;
export const CONFIG_SOLAR_WSS_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_SOLAR_WSS_URL : import.meta.env.VITE_APP_TESTNET_SOLAR_WSS_URL;

export const CONFIG_SOLAR_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_SOLAR_SCAN : import.meta.env.VITE_APP_TESTNET_SOLAR_SCAN;
export const CONFIG_ETH_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_ETH_SCAN : import.meta.env.VITE_APP_TESTNET_ETH_SCAN;
export const CONFIG_ARB_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_ARB_SCAN : import.meta.env.VITE_APP_TESTNET_ARB_SCAN;
export const CONFIG_AVAX_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_AVAX_SCAN : import.meta.env.VITE_APP_TESTNET_AVAX_SCAN;
export const CONFIG_BSC_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_BSC_SCAN : import.meta.env.VITE_APP_TESTNET_BSC_SCAN;
export const CONFIG_OPT_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_OPT_SCAN : import.meta.env.VITE_APP_TESTNET_OPT_SCAN;
export const CONFIG_POL_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_POL_SCAN : import.meta.env.VITE_APP_TESTNET_POL_SCAN;
export const CONFIG_BTC_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_BTC_SCAN : import.meta.env.VITE_APP_TESTNET_BTC_SCAN;
export const CONFIG_SOL_SCAN =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_SOL_SCAN : import.meta.env.VITE_APP_TESTNET_SOL_SCAN;

export const CONFIG_BSC_API_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_BSC_API_URL : import.meta.env.VITE_APP_TESTNET_BSC_API_URL;
export const CONFIG_ETH_API_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_ETH_API_URL : import.meta.env.VITE_APP_TESTNET_ETH_API_URL;
export const CONFIG_POL_API_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_POL_API_URL : import.meta.env.VITE_APP_TESTNET_POL_API_URL;
export const CONFIG_OP_API_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_OP_API_URL : import.meta.env.VITE_APP_TESTNET_OP_API_URL;
export const CONFIG_ARB_API_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_ARB_API_URL : import.meta.env.VITE_APP_TESTNET_ARB_API_URL;
export const CONFIG_AVAX_API_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_AVAX_API_URL : import.meta.env.VITE_APP_TESTNET_AVAX_API_URL;
export const CONFIG_BTC_API_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_BTC_API_URL : import.meta.env.VITE_APP_TESTNET_BTC_API_URL;

export const CONFIG_ALCHEMY_KEY = import.meta.env.VITE_APP_ALCHEMY_KEY;

export const CONFIG_BSC_API_KEY = import.meta.env.VITE_APP_BSC_API_KEY;
export const CONFIG_ETH_API_KEY = import.meta.env.VITE_APP_ETH_API_KEY;
export const CONFIG_POL_API_KEY = import.meta.env.VITE_APP_POL_API_KEY;
export const CONFIG_OP_API_KEY = import.meta.env.VITE_APP_OP_API_KEY;
export const CONFIG_ARB_API_KEY = import.meta.env.VITE_APP_ARB_API_KEY;

export const CONFIG_BSC_RPC_URL =
  import.meta.env.VITE_APP_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_BSC_RPC_URL : import.meta.env.VITE_APP_TESTNET_BSC_RPC_URL;
export const CONFIG_ETH_RPC_URL =
  CONFIG_NETWORK_NAME === "mainnet"
    ? import.meta.env.VITE_APP_MAINNET_ETH_RPC_URL + CONFIG_ALCHEMY_KEY
    : import.meta.env.VITE_APP_TESTNET_ETH_RPC_URL + CONFIG_ALCHEMY_KEY;
export const CONFIG_POL_RPC_URL =
  CONFIG_NETWORK_NAME === "mainnet"
    ? import.meta.env.VITE_APP_MAINNET_POL_RPC_URL + CONFIG_ALCHEMY_KEY
    : import.meta.env.VITE_APP_TESTNET_POL_RPC_URL + CONFIG_ALCHEMY_KEY;
export const CONFIG_OP_RPC_URL =
  CONFIG_NETWORK_NAME === "mainnet"
    ? import.meta.env.VITE_APP_MAINNET_OP_RPC_URL + CONFIG_ALCHEMY_KEY
    : import.meta.env.VITE_APP_TESTNET_OP_RPC_URL + CONFIG_ALCHEMY_KEY;
export const CONFIG_ARB_RPC_URL =
  CONFIG_NETWORK_NAME === "mainnet"
    ? import.meta.env.VITE_APP_MAINNET_ARB_RPC_URL + CONFIG_ALCHEMY_KEY
    : import.meta.env.VITE_APP_TESTNET_ARB_RPC_URL + CONFIG_ALCHEMY_KEY;
export const CONFIG_AVAX_RPC_URL =
  CONFIG_NETWORK_NAME === "mainnet" ? import.meta.env.VITE_APP_MAINNET_AVAX_PROVIDER : import.meta.env.VITE_APP_TESTNET_AVAX_PROVIDER;
