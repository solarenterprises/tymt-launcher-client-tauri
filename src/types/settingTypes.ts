export interface ILanguage {
  language: string;
}

export interface IWalletSetting {
  pageRefreshed: boolean;
  hideZeroBalance: boolean;
  currentCurrency: string;
  feeLevel: string;
}

export interface INotificationSetting {
  status: string; // active, idle, do-not-disturb
  sound: boolean;
  inAppNotification: boolean;
  nativeNotification: boolean;
}

export interface ILanguageSetting {
  lang: string;
}

export interface IAddress {
  name: string;
  address: string;
}
