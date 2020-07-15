import { isElectron } from './isElectron';
import * as log from './electronLogger';
import icon from '../assets/svg/logo-defi.svg';

interface Window {
  webkitNotifications: any;
  Notification: any;
}
declare var window: Window;

const showNotification = (content: string, description: string) => {
  const options = {
    body: description,
    icon,
  };

  if (isElectron()) {
    new window.Notification(content, options);
  } else {
    if (window.Notification) {
      if (window.Notification.permission !== 'granted') {
        window.Notification.requestPermission(function() {});
      }

      new window.Notification(content, options);
    } else {
      log.error("Your browser doesn't support Notifications");
    }
  }
};

export default showNotification;
