import { Component, ChangeDetectorRef } from "@angular/core";

import { Platform, MenuController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { GlobalFooService } from "./services/globalFooService.service";
import { ApiserviceService } from "./services/apiservice.service";
import { config } from "./services/config";
import { Router } from "@angular/router";
import { FCM } from "@ionic-native/fcm/ngx";
import { ConnectionService } from "ng-connection-service";
declare var Branch;
declare var google;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  public appPages = [
    {
      title: "Home",
      url: "/tabs/home",
      icon: "home-outline",
    },
    {
      title: "Categories",
      url: "/category",
      icon: "layers-outline",
    },
    {
      title: "Notifications",
      url: "/tabs/notification",
      icon: "notifications-outline",
    },
    {
      title: "Profile",
      url: "/tabs/profile",
      icon: "person-outline",
    },
    {
      title: "Feedback",
      url: "feedback",
      icon: "chatbox-ellipses-outline",
    },
    {
      title: "Saved",
      url: "saved-posts",
      icon: "bookmark-outline",
    },
    {
      title: "Add Recomendation",
      url: "tabs/add-recommend",
      icon: "add-outline",
    },
    {
      title: "See Friends Recommendations",
      url: "see-friends-recomendations",
      icon: "people-outline",
    },
    {
      title: "Logout",
      url: "/",
      icon: "log-out-outline",
    },
  ];
  user_name = localStorage.getItem("user_name");
  user_image = localStorage.getItem("user_image");
  user_email = localStorage.getItem("user_email");
  user_medium = localStorage.getItem("user_medium");
  IMAGES_URL: any = config.IMAGES_URL;
  errors = config.errors;
  selectedIndex: any;
  showBtn: boolean = false;
  noti_count = "0";
  isConnected: any;
  status: any;
  alert: any;
  isLogin: any = false;
  setState: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalFooService: GlobalFooService,
    private router: Router,
    private menuCtrl: MenuController,
    private fcm: FCM,
    public apiService: ApiserviceService,
    private ref: ChangeDetectorRef,
    private ConnectionService: ConnectionService
  ) {
    this.initializeApp();
    this.globalFooService.getObservable().subscribe((res) => {
      if (res == "Logout") {
        this.isLogin = false;
        window.location.reload();
      } else {
        this.isLogin = localStorage.getItem("IsLoggedIn");
      }
    });
    this.isLogin = localStorage.getItem("IsLoggedIn");
    var self = this;
    this.ConnectionService.monitor().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        this.alert.dismiss();
        setTimeout(function () {
          self.globalFooService.publishSomeData({
            foo: { data: "", page: "profile" },
          });
        }, 5000);
      } else {
        this.status = "OFFLINE";
        this.presentAlertConfirm();
      }
      //alert(this.status);
    });

    this.globalFooService.getObservable().subscribe((data) => {
      this.user_name = localStorage.getItem("user_name");
      this.user_image = localStorage.getItem("user_image");
      this.user_email = localStorage.getItem("user_email");
      this.user_medium = localStorage.getItem("user_medium");
    });

    // navigator.geolocation.getCurrentPosition(
    //   function (value) {
    //     // alert('Location accessed')
    //     localStorage.setItem("lat", value.coords.latitude.toString());
    //     localStorage.setItem("long", value.coords.longitude.toString());
    //   },
    //   function () {
    //     //alert('User not allowed')
    //   },
    //   { timeout: 10000 }
    // );
  }

  async presentAlertConfirm() {
    this.alert = await this.apiService.alertController.create({
      message: "No internet connection",
      backdropDismiss: false,
    });

    await this.alert.present();
  }

  onLogin() {
    this.router.navigateByUrl("/login");
  }

  getimage(img) {
    if (this.errors.indexOf(img) == -1) {
      if (img.includes("https") == true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  gotoRoute(url) {
    if (url == "/category") {
      this.router.navigate([url]);
    } else {
      this.apiService.navCtrl.navigateRoot(url);
    }
    // this.apiService.navCtrl.navigateRoot(url);
  }

  initializeApp() {
    let deferredPrompt;
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#f16334");
      this.splashScreen.hide();
      localStorage.setItem("categoriesCheck", JSON.stringify([]));
      this.noti_count = localStorage.getItem("notiCount");
      if (!this.apiService.gettoken()) {
        //this.router.navigate([""]);
        this.router.navigate(["landing-page"]);
      } else {
        this.router.navigate(["/tabs/home"]);
      }

      this.notificationCount();
      // this.branchInit();
      this.fcmNotification();
    });

    this.platform.resume.subscribe(() => {
      // this.branchInit();
      this.fcmNotification();
    });

    // const isIos = () => {
    //   const userAgent = window.navigator.userAgent.toLowerCase();
    //   return /iphone|ipad|ipod/.test(userAgent);
    // };

    // // Detects if device is in standalone mode
    // const isInStandaloneMode = () =>
    //   "standalone" in window.navigator && window.navigator["standalone"];

    // // Checks if should display install popup notification:
    // if (isIos() && !isInStandaloneMode()) {
    //   this.setState({ showInstallMessage: true });
    // }
  }

  notificationCount() {
    let dict = {
      userId: localStorage.getItem("userId"),
    };

    this.apiService.postData(dict, "notificationCount").subscribe((result) => {
      if (result.status == 1) {
        localStorage.setItem("notiCount", result.data.toString());
      } else {
        this.apiService.presentToast(result.msg, "danger");
        this.ref.detectChanges();
      }
    });
  }

  logout() {
    var categoryCheck = JSON.parse(localStorage.getItem("categoriesCheck"));
    var lat = localStorage.getItem("lat");
    var lng = localStorage.getItem("long");
    localStorage.clear();
    this.globalFooService.publishSomeData("Logout");
    localStorage.setItem("lat", lat);
    localStorage.setItem("long", lng);
    localStorage.setItem("categoriesCheck", JSON.stringify(categoryCheck));
    this.router.navigate(["/landing-page"]);
  }

  fcmNotification() {
    var self = this;
    this.fcm.onNotification().subscribe((data) => {
      if (data.wasTapped) {
        setTimeout(function () {
          if (
            JSON.parse(data.type) == "add post" ||
            JSON.parse(data.type) == "add like" ||
            JSON.parse(data.type) == "add comment"
          ) {
            if (self.errors.indexOf(localStorage.getItem("userId")) >= 0) {
              self.router.navigate(["/login"]);
            } else {
              localStorage.setItem("item", data.item);
              localStorage.setItem("postId", data.itemId);
              self.router.navigate(["/post-details"]);
            }
          } else if (JSON.parse(data.type) == "follow user") {
            localStorage.setItem("item", data.item);
            localStorage.setItem("clicked_user_id", data.itemId);
            self.router.navigate(["/user-profile"]);
          }
        }, 2000);
      } else {
        // this.presentAlertConfirm();
      }
    });
  }

  // branchInit = () => {
  //   var ptr = this;
  //   // only on devices
  //   // const Branch = window['Branch'];

  //   // for development and debugging only
  //   Branch.setDebug(true);

  //   // Branch initialization within your deviceready and resume
  //   Branch.initSession()
  //     .then(function success(data) {
  //       // alert("Open app with a Branch deep link: " + JSON.stringify(res));
  //       if (data["+clicked_branch_link"]) {
  //         //save the link clicked data into localstorage of the app.
  //         localStorage.setItem("clickedData", JSON.stringify(data));

  //         console.log(data);

  //         setTimeout(function () {
  //           localStorage.setItem("item", data.post);
  //           localStorage.setItem("postId", data.postId);
  //           ptr.router.navigate(["/post-details"]);
  //         }, 2000);
  //       } else if (data["+non_branch_link"]) {
  //         //alert("Open app with a non Branch deep link: " + JSON.stringify(data));
  //       } else {
  //         // alert("Open app organically");
  //         // Clicking on app icon or push notification
  //       }
  //     })
  //     .catch(function error(err) {});
  // };
}
