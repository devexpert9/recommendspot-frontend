import { Router } from "@angular/router";
import { ApiserviceService } from "./../services/apiservice.service";
import { config } from "./../services/config";
import { Component, Input, OnInit } from "@angular/core";
import { LoadingController, ModalController, NavParams } from "@ionic/angular";
import { NumberFormatStyle } from "@angular/common";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  IMAGES_URL: any = config.IMAGES_URL;
  @Input() value: any = [];
  data: any;
  loading: any;
  errors = config.errors;
  selectedUsers: any = [];
  itemList = [];
  selectedItems = [];
  settings = {};
  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    private ApiService: ApiserviceService
  ) {
    this.data = this.navParams.get("value");
  }

  ngOnInit() {
    this.selectedUsers = [];
    this.getAllFriendSuggestions();
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

  handleChange(user) {
    if (this.selectedUsers.includes(user._id)) {
      const index = this.selectedUsers.indexOf(user._id);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      }
    } else {
      this.selectedUsers.push(user._id);
    }
  }

  dismiss() {
    this.selectedUsers = [];
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create();
    await this.loading.present();
  }

  async stopLoading() {
    if (this.loading != undefined) {
      await this.loading.dismiss();
    } else {
      var self = this;
      setTimeout(function () {
        self.stopLoading();
      }, 1000);
    }
  }

  onDone() {
    this.presentLoading();
    var userId = localStorage.getItem("userId");
    var postId = localStorage.getItem("postId");
    var dict = {
      fromId: userId,
      toId: this.selectedUsers,
      postId: postId,
    };
    this.ApiService.postData(dict, "friendsrecommendations").subscribe(
      (res: any) => {
        this.stopLoading();
        if (res.status == 1) {
          this.dismiss();
          // this.router.navigateByUrl("tabs/home");
          this.ApiService.presentToast(
            "Reccomendation Sent Successfully",
            "success"
          );
        } else {
          this.ApiService.presentToast("Something went wrong", "danger");
        }
      }
    );
  }

  getAllFriendSuggestions() {
    this.presentLoading();
    this.selectedUsers = [];
    var self = this;
    var userId = localStorage.getItem("userId");
    var postId = localStorage.getItem("postId");
    var dict = {
      fromId: userId,
      postId: postId,
    };
    this.ApiService.postData(dict, "getAllFriendSuggestions").subscribe(
      (res: any) => {
        if (res.status == 1) {
          var postId = localStorage.getItem("postId");
          var userId = localStorage.getItem("userId");

          res.data.forEach((data) => {
            // if (data.fromId == userId) {
            this.selectedUsers = data.receiverId;
            self.data.forEach((element) => {
              element.checked = false;
            });
            this.data.forEach((element) => {
              if (data.receiverId.indexOf(element._id) >= 0) {
                var index = self.data.findIndex((x) => x._id === element._id);
                self.data[index].checked = true;
              }
            });
            // }
            // }
          });
          this.stopLoading();
        } else {
          this.selectedUsers = [];
          this.stopLoading();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.selectedUsers = [];
  }
}
