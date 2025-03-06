export interface INotificationContent {
  title: string;
  text: string;
  status: string; // failed, success, warning, alert
  duration: number;
  link: string;
}

export interface INotificationEventParams {
  content: INotificationContent;
  text?: string;
  link?: string;
}
