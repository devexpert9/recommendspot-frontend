import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ApiserviceService } from "../services/apiservice.service";
import { GlobalFooService } from "../services/globalFooService.service";
import { config } from "../services/config";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import {
  Platform,
  IonContent,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-category",
  templateUrl: "./category.page.html",
  styleUrls: ["./category.page.scss"],
})
export class CategoryPage implements OnInit {
  cat_id: any = "All";
  categorytab: string = "category";
  isAndroid: boolean = false;
  categories: any;
  users: any;
  user_name: any;
  selectedItemm = -1;
  selectedItemmShare = -1;
  filter_cat_array_global: any = [];
  user_image: any;
  user_email: any;
  user_id: any;
  player: any;
  cat: any = "All";
  IMAGES_URL: any = config.IMAGES_URL;
  errors = config.errors;
  counter = 0;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild("widgetsContent", { read: ElementRef })
  public widgetsContent: ElementRef<any>;
  noti_count = localStorage.getItem("notiCount");
  allposts: any[];
  posts: any[];
  userId: string;
  page_number = 1;
  local_posts: any = [];
  profiletab = "Global";
  private win: any = window;

  index: any = -1;
  page_limit = 10;
  profiletab1: any;
  play_video = false;
  loading: any;
  IsLoggedIn: string;
  constructor(
    private ref: ChangeDetectorRef,
    public apiService: ApiserviceService,
    public router: Router,
    public location: Location,
    private iab: InAppBrowser,
    public alertController: AlertController,
    public sanitizer: DomSanitizer,
    private globalFooService: GlobalFooService,
    private loadingController: LoadingController
  ) {
    this.user_name = localStorage.getItem("user_name");
    this.user_image = localStorage.getItem("user_image");
    this.user_email = localStorage.getItem("user_email");
    this.user_id = localStorage.getItem("userId");
    var self = this;
    this.globalFooService.getObservable().subscribe((data) => {
      this.user_name = localStorage.getItem("user_name");
      this.user_image = localStorage.getItem("user_image");
      this.user_email = localStorage.getItem("user_email");
      this.user_id = localStorage.getItem("userId");
    });
    //this.ref.detectChanges();
  }

  ngOnInit() {
    this.ref.detectChanges();
    this.IsLoggedIn = localStorage.getItem("IsLoggedIn");
  }
  gotohome() {
    this.router.navigate(["/tabs/home"]);
  }

  ngOnDestroy() {
    // alert('leaveccc');
    this.apiService.stopLoading();
  }

  gotofollowing() {
    var user_id = localStorage.getItem("userId");
    localStorage.setItem("clickUserId", user_id);
  }

  gotToTop() {
    this.content.scrollToTop(1000);
  }

  onSegmentChange(e) {
    this.ref.detectChanges();
    this.apiService.stopLoading();
    this.categorytab = e.detail.value;
    this.getUsers();

    //this.ref.detectChanges();
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

  ionViewDidEnter() {
    this.noti_count = localStorage.getItem("notiCount");
    this.getCategories();
    this.selectCatForGlobalFeed("", "Today");
  }

  getCategories() {
    this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
    };
    this.apiService.postData(dict, "onlycategories").subscribe(
      (result) => {
        this.ref.detectChanges();
        if (result.status == 1) {
          this.categories = result.data;
          this.ref.detectChanges();
          this.getUsers();
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "success"
          );
        }
        this.apiService.stopLoading();
        this.ref.detectChanges();
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "danger"
        );
        this.apiService.stopLoading();
      }
    );
  }

  selectCatForGlobalFeed(cat, i) {
    this.cat_id = cat._id;
    if (i == "Today" || i == "Basic") {
      this.profiletab1 = i;
      this.filter_cat_array_global = [];
    } else {
      this.profiletab1 = "";
      this.filter_cat_array_global = cat._id;
    }

    this.allposts = [];
    this.posts = [];
    this.apiService.stopLoading();
    this.stopLoading();
    this.getAllReccomdations(false, "");
  }

  async presentLoading() {
    // this.loading = await this.loadingController.create();
    if (this.errors.indexOf(this.loading) >= 0) {
      this.loading = await this.loadingController.create({
        spinner: "bubbles",
        cssClass: "my-loading-class",
        duration: 30000,
      });
    }
    await this.loading.present();
  }

  onMouseWheel(event: any) {
    if (event.deltaY < 0) {
      this.scrollLeft();
    } else {
      this.scrollRight();
    }
  }

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft + 150,
      behavior: "smooth",
    });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft - 150,
      behavior: "smooth",
    });
  }

  async stopLoading() {
    if (this.errors.indexOf(this.loading) == -1) {
      await this.loading.dismiss();
      this.loading = null;
    } else {
      var self = this;
      setTimeout(function () {
        self.stopLoading();
      }, 1000);
    }
  }

  viewPostSocial(post, link) {
    localStorage.setItem("item", JSON.stringify(post));
    localStorage.setItem("postId", post._id);
    this.iab.create(link, "_system", {
      location: "yes",
      closebuttoncaption: "done",
    });
  }

  viewPost(post) {
    this.selectedItemm = -1;
    localStorage.setItem("item", JSON.stringify(post));
    localStorage.setItem("postId", post._id);
    this.router.navigate(["/post-details"], { replaceUrl: true });
  }

  viewComments(post) {
    this.selectedItemm = -1;
    localStorage.setItem("item", JSON.stringify(post));
    localStorage.setItem("postId", post._id);
    this.router.navigate(["/comments"], { replaceUrl: true });
  }

  getAllReccomdations(isFirstLoad, event) {
    this.userId = localStorage.getItem("userId");
    // this.posts = [];
    // this.allposts = [];
    if (this.cat_id == undefined) {
      this.cat_id = "All";
    }

    let dict = {
      cat: this.cat_id,
      keyword: "",
      lat: 0,
      lng: 0,
      recc_type_for_all: "All",
    };
    if (this.counter == 0) {
      this.presentLoading();
    }
    // if(this.counter == 0){
    // this.apiService.presentLoading();
    // }
    // localStorage.setItem("categorydict", JSON.stringify(dict));
    // this.router.navigateByUrl("/posts");
    // this.stopLoading();
    this.apiService.postData(dict, "getAllLocalfilterRecc").subscribe(
      (result) => {
        this.allposts = result.data;
        this.apiService.stopLoading();
        this.ref.detectChanges();
      },
      (err) => {
        this.apiService.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time.",
          "danger"
        );
        this.apiService.stopLoading();
      }
    );
    this.apiService.stopLoading();
  }

  follow_unfollow_cat(cat, status, index) {
    this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
      cat_id: cat._id,
      follow_status: status,
    };

    this.apiService.postData(dict, "followUnfollowCategory").subscribe(
      (result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          this.categories[index].cat_follow = parseInt(status);
          this.apiService.presentToast(result.error, "success");
          localStorage.setItem("first_login", "true");
          this.globalFooService.publishSomeData({
            foo: { data: "", page: "updateprofile" },
          });
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "danger"
          );
          this.apiService.stopLoading();
        }
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "success"
        );
        this.apiService.stopLoading();
      }
    );
  }

  isLikedPost(likesArray) {
    //assets/imgs/like.png
    let IsLiked = false;
    if (likesArray?.length == 0) {
    } else {
      for (var i = 0; i < likesArray?.length; i++) {
        if (likesArray[i].userId == this.userId) {
          IsLiked = true;
        }
      }
    }

    if (IsLiked) {
      return "thumbs-up";
    } else {
      return "thumbs-up-outline";
    }
  }

  onPlayerStateChange(event) {
    // let ptr = this;
    let self = JSON.parse(localStorage.getItem("this"));
    if (event.data === 0) {
    }
  }

  onPlayerReady(event) {
    event.target.playVideo();
  }

  getIframeYouTubeUrl(weblink: string): SafeResourceUrl {
    var zz1 = weblink.lastIndexOf("/");
    var zz2 = weblink.substring(zz1 + 1, weblink.length);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      "https://www.youtube.com/embed/" + zz2 + "?enablejsapi=1"
    );
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

  playYoutube(web_link, index) {
    if (this.player === undefined || !this.player || null) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
    }
    this.index = index;
    this.play_video = true;

    if (index == 0) {
      this.player = new YT.Player("iframeone", {
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

      var myImg = document.getElementById("iframeone");
      myImg.setAttribute(
        "src",
        "https://www.youtube.com/embed/" +
          web_link.split("embed/")[1] +
          "?autoplay=1"
      );
      document.getElementById("iframeone").style.display = "block";
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
    //   this.player = new YT.Player('iframe' + index, {
    //     height: '315',
    //     width: '100%',
    //     videoId: web_link.split('embed/')[1],
    //     playerVars: {
    //       controls: 0,
    //       disablekb: 1
    //     },
    //     events: {
    //       'onStateChange': this.onPlayerStateChange,
    //       'onReady': this.onPlayerReady
    //     }
    //   });
    //   // document.getElementById('setContent').style.display = "block";
    //  if (document.getElementById('iframe' + index) != undefined) {
    //   var myImg = document.getElementById('iframe' + index);
    //   myImg.setAttribute('src', 'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1');

    //   // document.getElementById('iframe' + index).src =  'https://www.youtube.com/embed/'  + web_link.split('embed/')[1] + '?autoplay=1';
    //       document.getElementById('iframe' + index).style.display = "block";
    //       this.iframeid = 'iframe' + index;
    // }
  }

  follow_unfollow_sub_cat(sub_cat, status, index, sub_index) {
    this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
      sub_cat_id: sub_cat._id,
      follow_status: status,
    };

    this.apiService.postData(dict, "followUnfollowSubCategory").subscribe(
      (result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          this.categories[index].sub_cat[sub_index].sub_cat_follow =
            parseInt(status);
          localStorage.setItem("first_login", "true");
          this.globalFooService.publishSomeData({
            foo: { data: "", page: "updateprofile" },
          });
          this.apiService.presentToast(result.error, "success");
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "danger"
          );
          this.apiService.stopLoading();
        }
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "success"
        );
        this.apiService.stopLoading();
      }
    );
  }

  viewUser(item) {
    //localStorage.setItem('item', JSON.stringify(item));
    localStorage.setItem("clicked_user_id", item._id);
    localStorage.setItem("add_user_type", "user");
    this.router.navigate(["/user-profile"]);
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

  openUpdateShare(i) {
    if (this.selectedItemmShare == i) {
      this.selectedItemmShare = -1;
    } else {
      this.selectedItemmShare = i;
    }
  }

  openUpdate(i) {
    if (this.selectedItemm == i) {
      this.selectedItemm = -1;
    } else {
      this.selectedItemm = i;
    }
  }
  //delete post
  deletePost(item, i) {
    this.selectedItemm = -1;
    let dict = {
      _id: item._id,
    };

    this.presentLoading();
    this.apiService.postData(dict, "deleteRecc").subscribe(
      (result) => {
        this.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          this.allposts.splice(i, 1);
          this.apiService.presentToast(result.msg, "success");
        } else {
          this.apiService.presentToast(
            "Technical error,Please try after some time.",
            "danger"
          );
          this.apiService.stopLoading();
        }
      },
      (err) => {
        this.apiService.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time.",
          "danger"
        );
        this.apiService.stopLoading();
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

  //edit post
  editPost(item, i) {
    this.selectedItemm = -1;
    localStorage.setItem("postId", item._id);
    localStorage.setItem("category_id", item.category_id);
    localStorage.setItem("route", "/tabs/home");
    this.router.navigate(["/edit-reccomendation"], { replaceUrl: true });
  }

  addRemoveReccomdation(str, item, type, index) {
    let dict = {
      user_id: localStorage.getItem("userId"),
      recc_id: item._id,
      type: type,
    };
    this.presentLoading();
    this.apiService.postData(dict, "addRemoveRecc").subscribe((result) => {
      this.stopLoading();
      this.ref.detectChanges();
      if (str == "local") {
        this.local_posts[index].fav = type;
      } else {
        this.allposts[index].fav = type;
      }

      if (this.profiletab == "Saved") {
        if (str == "local") {
          this.local_posts.splice(index, 1);
        } else {
          this.allposts.splice(index, 1);
        }
      }
      this.apiService.presentToast(result.msg, "success");
    });
  }

  share(item) {
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
      message: "Share post", // not supported on some apps (Facebook, Instagram)
      subject: "Favreet-Share post", // fi. for email
      files: "", // an array of filenames either locally or remotely
      url: this.errors.indexOf(item.web_link) >= 0 ? "" : item.web_link,
      chooserTitle: "Pick an app", // Android only, you can override the default share sheet title
      appPackageName: [
        "com.android.bluetooth",
        "com.android.mms",
        "com.google.android.gm",
        "com.google.android.gms",
        "com.google.android.keep",
        "cn.wps.moffice_eng",
        "cn.wps.moffice_eng",
        "com.facebook.katana",
        "com.facebook.orca",
        "com.google.android.apps.docs",
        "com.google.android.apps.docs",
        "com.google.android.talk",
        "com.instagram.android",
        "com.lenovo.anyshare.gps",
        "com.lenovo.anyshare.gps",
        "com.skype.raider",
        "com.truecaller",
        "com.whatsapp",
        "org.videolan.vlc",
        "sharefiles.sharemusic.shareapps.filetransfer",
      ], // Android only, you can provide id of the App you want to share with
    };

    var onSuccess = function (result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    };

    var onError = function (msg) {
      console.log("Sharing failed with message: " + msg);
    };

    this.win.plugins.socialsharing.shareWithOptions(
      options,
      onSuccess,
      onError
    );
  }

  like(str, likesArray, dislikesArray, index, post) {
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
      // postId: this.posts[index]._id
      postId: post._id,
    };

    let ApiEndPoint = IsLiked == true ? "deleteLike" : "addLike";
    this.presentLoading();
    this.apiService.postData(dict, ApiEndPoint).subscribe(
      (result) => {
        this.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          if (!IsLiked) {
            if (str == "local") {
              this.local_posts[index].likes.push(result.data);
            } else {
              this.allposts[index].likes.push(result.data);
            }
            for (var i = 0; i < dislikesArray.length; i++) {
              if (dislikesArray[i].userId == this.userId) {
                if (str == "local") {
                  this.local_posts[index].dislikes.splice(i, 1);
                } else {
                  this.allposts[index].dislikes.splice(i, 1);
                }
              }
            }
          } else {
            for (var i = 0; i < likesArray.length; i++) {
              if (likesArray[i].userId == this.userId) {
                if (str == "local") {
                  this.local_posts[index].likes.splice(i, 1);
                } else {
                  this.allposts[index].likes.splice(i, 1);
                }
              }
            }
          }
        } else {
          this.apiService.presentToast(
            "Technical error,Please try after some time.",
            "danger"
          );
          this.stopLoading();
        }
      },
      (err) => {
        this.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time.",
          "danger"
        );
        this.stopLoading();
      }
    );
  }

  dislike(likesArray, dislikesArray, index) {
    let IsLiked = false;
    let likeId = null;
    for (var i = 0; i < dislikesArray.length; i++) {
      if (dislikesArray[i].userId == localStorage.getItem("userId")) {
        IsLiked = true;
        likeId = dislikesArray[i]._id;
      }
    }

    let dict = {
      userId: this.userId,
      _id: likeId,
      postId: this.posts[index]._id,
    };

    let ApiEndPoint = IsLiked == true ? "deleteDisLike" : "addDisLike";

    this.presentLoading();
    this.apiService.postData(dict, ApiEndPoint).subscribe(
      (result) => {
        this.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          if (!IsLiked) {
            this.posts[index].dislikes.push(result.data);
            for (var i = 0; i < likesArray.length; i++) {
              if (likesArray[i].userId == this.userId) {
                this.posts[index].likes.splice(i, 1);
              }
            }
          } else {
            for (var i = 0; i < dislikesArray.length; i++) {
              if (dislikesArray[i].userId == this.userId) {
                this.posts[index].dislikes.splice(i, 1);
              }
            }
          }
        } else {
          this.apiService.presentToast(
            "Technical error,Please try after some time.",
            "danger"
          );
          this.stopLoading();
        }
      },
      (err) => {
        this.apiService.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time.",
          "danger"
        );
        this.apiService.stopLoading();
      }
    );
  }

  isDisLikedPost(dislikesArray) {
    //assets/imgs/like.png
    let IsLiked = false;
    if (dislikesArray.length == 0) {
    } else {
      for (var i = 0; i < dislikesArray.length; i++) {
        if (dislikesArray[i].userId == this.userId) {
          IsLiked = true;
        }
      }
    }

    if (IsLiked) {
      return "thumbs-down";
    } else {
      return "thumbs-down-outline";
    }
  }

  getUsers() {
    this.apiService.presentLoading();
    var dict = {
      _id: localStorage.getItem("userId"),
    };

    this.apiService.postData(dict, "usersListWeb").subscribe(
      (result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          this.users = result.data;
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "success"
          );
          this.apiService.stopLoading();
        }
        this.ref.detectChanges();
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "success"
        );
        this.apiService.stopLoading();
      }
    );
  }

  follow_unfollow_user(user, status, index) {
    var str;
    if (status == "0") {
      str = "removeFriend";
    } else {
      str = "addFriend";
    }

    let dict = {
      userId: localStorage.getItem("userId"),
      friendId: user._id,
    };
    this.apiService.presentLoading();
    this.apiService.postData(dict, str).subscribe(
      (result) => {
        this.apiService.stopLoading();
        if (result.status == 1) {
          this.users[index].isFriend = parseInt(status);

          this.globalFooService.publishSomeData({
            foo: { data: status, page: "add-post" },
          });
          this.apiService.presentToast(result.error, "success");
        } else {
          this.apiService.presentToast(
            "Technical error,Please try after some time.",
            "danger"
          );
          this.apiService.stopLoading();
        }
        this.ref.detectChanges();
      },
      (err) => {
        this.apiService.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time.",
          "danger"
        );
        this.apiService.stopLoading();
      }
    );
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
    this.router.navigate(["/landing-page"]);
  }
}
