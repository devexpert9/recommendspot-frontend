import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { ApiserviceService } from "../services/apiservice.service";
import { GlobalFooService } from "../services/globalFooService.service";
import { config } from "../services/config";
import { Router } from "@angular/router";
declare var Branch;
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import {
  ModalController,
  MenuController,
  AlertController,
  Platform,
  IonContent,
} from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { ImagepopupPage } from "../imagepopup/imagepopup.page";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  profile: any;
  IMAGES_URL: any = config.IMAGES_URL;
  errors = config.errors;
  bgImage: any;
  userId: any;
  data: any;
  loggedUserId: any = localStorage.getItem("userId");
  is_response = false;
  counter = 0;
  selectedItemm = -1;
  user_name: any;
  user_image: any;
  user_email: any;
  user_id: any;
  platform1: any;
  selectedItemmShare = -1;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  noti_count = localStorage.getItem("notiCount");
  index: any = -1;
  play_video = false;
  player: any;
  profiletab = "Local";

  constructor(
    public sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private globalFooService: GlobalFooService,
    public apiService: ApiserviceService,
    public router: Router,
    private socialSharing: SocialSharing,
    private iab: InAppBrowser,
    public alertController: AlertController,
    private platform: Platform,
    public modalController: ModalController
  ) {
    this.user_name = localStorage.getItem("user_name");
    this.user_image = localStorage.getItem("user_image");
    this.user_email = localStorage.getItem("user_email");
    this.user_id = localStorage.getItem("userId");
    this.globalFooService.getObservable().subscribe((data) => {
      this.counter = 1;
      this.get_profile();
      this.user_name = localStorage.getItem("user_name");
      this.user_image = localStorage.getItem("user_image");
      this.user_email = localStorage.getItem("user_email");
      this.user_id = localStorage.getItem("userId");
      this.noti_count = localStorage.getItem("notiCount");
    });
  }

  ngOnInit() {
    this.platform1 = this.platform.is("cordova");
    this.noti_count = localStorage.getItem("notiCount");
    localStorage.setItem("clicked_user_id", this.userId);
    this.play_video = false;
  }

  stopPlayer() {
    if (this.player === undefined || !this.player || null) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
    }
  }

  ngOnDestroy() {
    // alert('leaveccc');
    this.apiService.stopLoading();
    if (this.player === undefined || !this.player || null) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
    }
    this.play_video = false;
    // document.getElementById('iframetwo').style.display = "none";
  }

  viewUser(item) {
    this.selectedItemm = -1;
    localStorage.setItem("item", JSON.stringify(item));
    localStorage.setItem("clicked_user_id", item.user_id);
    localStorage.setItem("add_user_type", item.add_user_type);
    // this.router.navigateByUrl('/user-profile', { replaceUrl: true })
    this.router.navigate(["user-profile"]);
  }

  gotToTop() {
    this.content.scrollToTop(1000);
  }

  logout() {
    this.globalFooService.publishSomeData("Logout");
    var categoryCheck = JSON.parse(localStorage.getItem("categoriesCheck"));
    var lat = localStorage.getItem("lat");
    var lng = localStorage.getItem("long");
    localStorage.clear();

    localStorage.setItem("lat", lat);
    localStorage.setItem("long", lng);
    localStorage.setItem("categoriesCheck", JSON.stringify(categoryCheck));
    this.router.navigate(["/landing-page"], { replaceUrl: true });
  }

  openUpdate(i) {
    if (this.selectedItemm == i) {
      this.selectedItemm = -1;
    } else {
      this.selectedItemm = i;
    }
  }

  openUpdateShare(i) {
    if (this.selectedItemmShare == i) {
      this.selectedItemmShare = -1;
    } else {
      this.selectedItemmShare = i;
    }
  }

  openLinkPreview(web_link) {
    if (
      web_link.includes("http") == false ||
      web_link.includes("https") == false
    ) {
      web_link = "http://" + web_link;
    }
    this.iab.create(web_link, "_system", {
      location: "yes",
      closebuttoncaption: "done",
    });
  }

  viewPostSocial(post, link) {
    localStorage.setItem("item", JSON.stringify(post));
    localStorage.setItem("postId", post._id);
    this.iab.create(link, "_system", {
      location: "yes",
      closebuttoncaption: "done",
    });
  }

  // playYoutube(web_link, index){

  //   this.index = index;
  //   this.play_video = true;
  // }

  playYoutube(web_link, index) {
    if (this.errors.indexOf(this.player) >= 0) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
    }

    this.play_video = true;
    this.index = index;

    if (index == 0) {
      this.player = new YT.Player("iframetwo", {
        height: "315",
        width: "100%",
        videoId: web_link.split("embed/")[1],
        playerVars: {
          controls: 0,
          disablekb: 1,
        },
        events: {
          onStateChange: this.onPlayerStateChange,
          onReady: this.onPlayerReady,
        },
      });

      var myImg = document.getElementById("iframetwo");
      myImg.setAttribute(
        "src",
        "https://www.youtube.com/embed/" +
          web_link.split("embed/")[1] +
          "?autoplay=1"
      );
      document.getElementById("iframetwo").style.display = "block";
    } else {
      this.player = new YT.Player("iframe" + index, {
        height: "315",
        width: "100%",
        videoId: web_link.split("embed/")[1],
        playerVars: {
          controls: 0,
          disablekb: 1,
        },
        events: {
          onStateChange: this.onPlayerStateChange,
          onReady: this.onPlayerReady,
        },
      });
      var myImg = document.getElementById("iframe" + index);
      myImg.setAttribute(
        "src",
        "https://www.youtube.com/embed/" +
          web_link.split("embed/")[1] +
          "?autoplay=1"
      );
      document.getElementById("iframe" + index).style.display = "block";
    }

    // create youtube player
    // var player, iframe;

    // document.getElementById('setContent').style.display = "block";
    // if (document.getElementById('iframe' + index) != undefined) {

    // }
  }

  // when video ends
  onPlayerStateChange(event) {
    // let ptr = this;
    let self = JSON.parse(localStorage.getItem("this"));
    // // ptr.timestamp = event.target.getDuration();
    // console.log(event, event.target.getDuration());
    // if (event.data == YT.PlayerState.PLAYING) {
    //       self.timestamp_callback(event);
    //   }
    // event.target.playVideo();
    if (event.data === 0) {
    }
  }

  onPlayerReady(event) {
    event.target.playVideo();
  }

  youtube_parser(url) {
    var regExp =
      /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
    var match = url.match(regExp);
    return match && match[1].length == 11 ? match[1] : false;
  }

  getId(url) {
    var regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return "https://www.youtube.com/embed/" + match[2];
    } else {
      return "error";
    }
  }

  ionViewWillLeave() {
    if (this.player === undefined || !this.player || null) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
    }
    this.play_video = false;
    // document.getElementById('iframetwo').style.display = "none";
  }

  ionViewDidEnter() {
    this.noti_count = localStorage.getItem("notiCount");
    this.counter = 0;
    this.play_video = false;
    this.userId = localStorage.getItem("userId");
    localStorage.setItem("clicked_user_id", this.userId);

    this.get_profile();
  }

  openLink(web_link) {
    //window.open(web_link, '_system');
    if (
      web_link.includes("http") == false ||
      web_link.includes("https") == false
    ) {
      web_link = "http://" + web_link;
    }
    this.iab.create(web_link, "_system", {
      location: "yes",
      closebuttoncaption: "done",
    });
  }

  gotofollowing() {
    var user_id = localStorage.getItem("userId");
    localStorage.setItem("clickUserId", user_id);
  }

  gotoFollowersFollowings(str) {
    localStorage.setItem("friend", str);
    localStorage.setItem("clickUserId", this.userId);

    this.globalFooService.publishSomeData({
      foo: { data: "", page: "updateprofile" },
    });
    this.router.navigate(["/followingfollowers"], { replaceUrl: true });
    //this.apiService.navCtrl.navigateRoot('tabs/following');
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

  get_profile() {
    let dict = {
      _id: this.userId,
      add_user_type: "user",
    };

    if (this.counter == 0) {
      this.apiService.presentLoading();
    }

    this.apiService.postData(dict, "getProfile").subscribe((result) => {
      this.ref.detectChanges();
      if (result.status == 1) {
        this.profile = result.data;
        this.bgImage =
          this.errors.indexOf(result.data.cover_image) >= 0
            ? "../../assets/img/no-image.png"
            : this.IMAGES_URL + "/images/" + result.data.cover_image;
        this.getData();
      } else {
        this.apiService.presentToast(result.msg, "danger");
      }
    });
  }

  getData() {
    this.apiService
      .postData(
        {
          userId: localStorage.getItem("userId"),
          loggedUserId: localStorage.getItem("userId"),
          add_user_type: "user",
          recc_type: this.profiletab == "Local" ? "global" : "global",
        },
        "influencerProfile"
      )
      .subscribe(
        (result) => {
          this.ref.detectChanges();
          if (result.status == 1) {
            this.data = result.data;
            this.is_response = true;
          } else {
            this.apiService.presentToast(
              "Technical error,Please try after some time.",
              "danger"
            );
          }
          this.apiService.stopLoading();
        },
        (err) => {
          this.apiService.stopLoading();
          this.apiService.presentToast(
            "Technical error,Please try after some time.",
            "danger"
          );
        }
      );
  }

  goto_profile_setting() {
    this.router.navigate(["/profile-setting/", this.profile._id], {
      replaceUrl: true,
    });
  }

  like(likesArray, index) {
    let IsLiked = false;
    let likeId = null;
    for (var i = 0; i < likesArray.length; i++) {
      if (likesArray[i].userId == localStorage.getItem("userId")) {
        IsLiked = true;
        likeId = likesArray[i]._id;
      }
    }

    let dict = {
      userId: this.userId,
      _id: likeId,
      postId: this.data.post[index]._id,
    };

    let ApiEndPoint = IsLiked == true ? "deleteLike" : "addLike";

    this.apiService.presentLoading();
    this.apiService.postData(dict, ApiEndPoint).subscribe(
      (result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          if (!IsLiked) {
            this.data.post[index].likes.push(result.data);
          } else {
            for (var i = 0; i < likesArray.length; i++) {
              if (likesArray[i].userId == this.userId) {
                this.data.post[index].likes.splice(i, 1);
              }
            }
          }
        } else {
          this.apiService.presentToast(
            "Technical error,Please try after some time.",
            "danger"
          );
        }
      },
      (err) => {
        this.apiService.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time.",
          "danger"
        );
      }
    );
  }

  isLikedPost(likesArray) {
    //assets/imgs/like.png
    if (this.errors.indexOf(this.loggedUserId) == -1) {
      let IsLiked = false;
      if (likesArray.length == 0) {
      } else {
        for (var i = 0; i < likesArray.length; i++) {
          if (likesArray[i].userId == this.loggedUserId) {
            IsLiked = true;
          }
        }
      }

      //console.log(likesArray)
      if (IsLiked) {
        return "thumbs-up";
      } else {
        return "thumbs-up-outline";
      }
    } else {
      return "thumbs-up-outline";
    }
  }

  viewPost(post) {
    this.selectedItemm = -1;
    localStorage.setItem("item", JSON.stringify(post));
    localStorage.setItem("postId", post._id);
    //this.router.navigate(['/post-details'], { replaceUrl: true });
    this.router.navigate(["/post-details"]);
  }

  viewComments(post) {
    this.selectedItemm = -1;
    localStorage.setItem("item", JSON.stringify(post));
    localStorage.setItem("postId", post._id);
    //this.router.navigate(['/comments'], { replaceUrl: true });
    this.router.navigate(["/comments"]);
  }

  //scoial share
  socialsharebranch(post) {
    const Branch = window["Branch"];
    const self = this;

    var properties = {
      canonicalIdentifier: "content/123",
      contentMetadata: {
        userId: post.user_id,
        postId: post._id,
        post: JSON.stringify(post),
      },
    };

    // create a branchUniversalObj variable to reference with other Branch methods
    var branchUniversalObj = null;

    Branch.createBranchUniversalObject(properties)
      .then(function (res) {
        branchUniversalObj = res;

        // optional fields
        var analytics = {
          channel: "facebook",
          feature: "onboarding",
        };

        var properties1 = {
          $og_title: "Recommendspot",
          $deeplink_path: "content/123",
          $match_duration: 2000,
          custom_string: "data",
          custom_integer: Date.now(),
          custom_boolean: true,
        };

        branchUniversalObj
          .generateShortUrl(analytics, properties1)
          .then(function (res) {
            var sendlink = res.url;
            var imgUrl =
              self.errors.indexOf(post.image) >= 0
                ? null
                : self.IMAGES_URL + "/images/" + post.image;
            self.socialSharing.share(
              "Check out the link: ",
              "Recommendspot",
              imgUrl,
              sendlink
            );
          })
          .catch(function (err) {});
      })
      .catch(function (err) {
        alert("Error: " + JSON.stringify(err));
      });
  }

  addRemoveReccomdation(item, type, index) {
    let dict = {
      user_id: localStorage.getItem("userId"),
      recc_id: item._id,
      type: type,
    };

    this.apiService.presentLoading();
    this.apiService.postData(dict, "addRemoveRecc").subscribe((result) => {
      this.apiService.stopLoading();
      this.ref.detectChanges();
      this.data.post[index].fav = type;

      this.apiService.presentToast(result.msg, "success");
    });
  }

  //edit post
  editPost(item, i) {
    this.selectedItemm = -1;
    localStorage.setItem("postId", item._id);
    localStorage.setItem("category_id", item.category_id);
    localStorage.setItem("route", "/tabs/profile");
    this.router.navigate(["/edit-reccomendation"], { replaceUrl: true });
  }

  //delete post
  deletePost(item, i) {
    this.selectedItemm = -1;
    let dict = {
      _id: item._id,
    };

    this.apiService.presentLoading();
    this.apiService.postData(dict, "deleteRecc").subscribe(
      (result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          this.data.post.splice(i, 1);
          this.apiService.presentToast(result.msg, "success");
        } else {
          this.apiService.presentToast(
            "Technical error,Please try after some time.",
            "danger"
          );
        }
      },
      (err) => {
        this.apiService.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time.",
          "danger"
        );
      }
    );
  }

  async presentAlertConfirm(item, i) {
    const alert = await this.alertController.create({
      header: "Confirm Delete",
      message: "Are you sure to delete?",
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.deletePost(item, i);
          },
        },
        {
          text: "Cancel",
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  onSegmentChange(event) {
    this.profiletab = event.detail.value;
    this.getData();
  }

  async openImagePopup(image) {
    //this.photoViewer.show(image);
    const modal = await this.modalController.create({
      component: ImagepopupPage,
      componentProps: { value: image },
      cssClass: "imgMod",
    });
    return await modal.present();
  }
}
