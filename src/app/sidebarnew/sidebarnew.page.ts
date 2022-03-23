import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiserviceService } from "../services/apiservice.service";
import { config } from "../services/config";
import { GlobalFooService } from "../services/globalFooService.service";

@Component({
  selector: "app-sidebarnew",
  templateUrl: "./sidebarnew.page.html",
  styleUrls: ["./sidebarnew.page.scss"],
})
export class SidebarnewPage implements OnInit {
  isLogin: any = false;
  errors = config.errors;
  selectedIndex: any;
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
  constructor(
    private router: Router,
    private globalFooService: GlobalFooService,
    public apiService: ApiserviceService
  ) {
    this.globalFooService.getObservable().subscribe((res) => {
      if (res == "Logout") {
        this.isLogin = false;
        window.location.reload();
      } else {
        this.isLogin = !localStorage.getItem("IsLoggedIn");
      }
    });
  }

  ngOnInit() {}

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
    if (url == "tabs/add-recommend") {
      var isloggin = localStorage.getItem("IsLoggedIn");
      if (isloggin) {
        this.router.navigateByUrl("/tabs/add-recommend");
      } else {
        this.router.navigateByUrl("/add-all-recommendation");
      }
    } else {
      if (url == "/category") {
        this.router.navigateByUrl("/category");
      } else {
        this.apiService.navCtrl.navigateRoot(url);
      }
    }
  }
}
