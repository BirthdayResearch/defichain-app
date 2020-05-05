import isElectron from "is-electron";
import icon from "../assets/svg/logo-defi.svg";

interface Window {
  webkitNotifications: any;
  Notification: any;
}
declare var window: Window;

const showNotification = (content: String, description: string) => {
  var options = {
    body: description,
    icon: icon,
  };

  if (isElectron()) {
    new window.Notification(content, options);
  } else {
    if (window.Notification) {
      if (window.Notification.permission !== "granted") {
        window.Notification.requestPermission(function() {});
      }

      new window.Notification(content, options);
    } else {
      console.log("Your browser doesn't support Notifications");
    }
  }
};

export default showNotification;
