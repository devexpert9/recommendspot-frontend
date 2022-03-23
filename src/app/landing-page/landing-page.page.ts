import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { ApiserviceService } from "../services/apiservice.service";
import { GlobalFooService } from "../services/globalFooService.service";
import { config } from "../services/config";
import { Router } from "@angular/router";
import {
  Platform,
  MenuController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Options } from "ngx-google-places-autocomplete/objects/options/options";
declare var google: any;
@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.page.html",
  styleUrls: ["./landing-page.page.scss"],
})
export class LandingPagePage implements OnInit {
  cat_id: any = "All";
  hideMe = false;
  userId: any;
  page_number = 1;
  index: any = -1;
  page_limit = "";
  local_posts: any = [];
  authForm: FormGroup;
  play_video = false;
  authSearchForm: FormGroup;
  errors = config.errors;
  items: any[] = [
    { title: "Orangies", link: "https://www.github.com/isahohieku" },
    { title: "Apple", link: "https://www.github.com/isahohieku" },
    { title: "Mango", link: "https://www.github.com/isahohieku" },
    { title: "Carrot", link: "https://www.github.com/isahohieku" },
  ];
  selectedItemm = -1;
  cat: any = "All";
  counter = 0;
  is_response = false;
  filter_cat_array_local: any = [];
  filter_cat_array_global: any = [];
  filter_cat_array = JSON.parse(localStorage.getItem("categoriesCheck"));
  categoriesChecked = JSON.parse(localStorage.getItem("categoriesCheck"));
  hideMe1 = false;
  hideMe2 = false;
  count = 10;
  local_count = 10;
  start_count = 0;
  loading: any;
  latitude: any;
  longitude: any;
  userSettings = {
    inputPlaceholderText: "Location",
    geoTypes: ["(regions)", "(cities)"],
  };
  latest_categories: any;
  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 1000,
    loop: false,
    autoplay: false,
    onlyExternal: false,
    noSwipingClass: "swiper-no-swiping",
  };
  selectedItemmShare: any;
  category_type: any;
  player: any;
  componentData1: any;
  filterSearchData: any;
  keyword1 = "name";
  openUpdateShare(i) {
    if (this.selectedItemmShare == i) {
      this.selectedItemmShare = -1;
    } else {
      this.selectedItemmShare = i;
    }
  }
  slideOpts1 = {
    slidesPerView: 3,
    spaceBetween: 0,
    loop: false,
    speed: 1000,
    autoplay: false,
    breakpoints: {
      1024: {
        slidesPerView: 3, // these don't work
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };

  fcm_token: any;
  allposts: any[];
  posts: any[];
  profiletab1: any;

  public userSettings3: any = {
    showCurrentLocation: true,
    resOnSearchButtonClickOnly: true,
    inputPlaceholderText: "Type anything and you will get a location",
    recentStorageName: "componentData3",
  };
  showInput: boolean = false;

  clickEvent() {
    this.showInput = !this.showInput;
  }

  hide() {
    this.hideMe = !this.hideMe;
  }
  hide1() {
    this.hideMe1 = !this.hideMe1;
  }
  hide2() {
    this.hideMe2 = !this.hideMe2;
  }
  categories: any;
  users: any;
  IMAGES_URL: any = config.IMAGES_URL;
  categoriesCheck = [];

  slideOpts2 = {
    autoWidth: true,
    slidesPerView: 2.25,
    scrollbar: true,
    mousewheel: true,
    initialSlide: 0,
    adddirection: "veritical",
    speed: 500,
    spaceBetween: 10,
    breakpoints: {
      767: { autoWidth: true, slidesPerView: 4, spaceBetween: 15 },
      1024: { autoWidth: true, slidesPerView: 4, spaceBetween: 15 },
    },
  };
  @ViewChild("widgetsContent", { read: ElementRef })
  public widgetsContent: ElementRef<any>;
  constructor(
    private ref: ChangeDetectorRef,
    public apiService: ApiserviceService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public alertController: AlertController,
    private platform: Platform,
    public fireAuth: AngularFireAuth,
    private iab: InAppBrowser,
    private fb: Facebook,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private googlePlus: GooglePlus,
    private loadingController: LoadingController
  ) {
    this.createForm();
    localStorage.removeItem("dict");
    // this.currentLocationUser();
  }

  // addressOptions = {
  //   location: new google.maps.LatLng(
  //     localStorage.getItem("lattitude"),
  //     localStorage.getItem("longitude")
  //   ),
  // };

  ngOnInit() {
    this.getCategoriesLatest();
    this.selectCatForGlobalFeed("", "Today");
    // this.searchLocalRecc(true, "");
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
    this.getCategories();
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

  doInfinite(event) {
    this.counter = 1;
    if (this.allposts.length - this.allposts.length < 10) {
      this.count = this.count + (this.allposts.length - this.allposts.length);
    } else {
      this.count = this.count + 10;
    }

    this.getAllReccomdations(true, event);
  }

  addRemoveReccomdation(item, type, index) {
    this.apiService.presentToast("Please login", "danger");
    return;
  }

  like(likesArray, dislikesArray, index, post) {
    this.apiService.presentToast("Please login", "danger");
    return;
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
            this.posts[index].likes.push(result.data);
            for (var i = 0; i < dislikesArray.length; i++) {
              if (dislikesArray[i].userId == this.userId) {
                this.posts[index].dislikes.splice(i, 1);
              }
            }
          } else {
            for (var i = 0; i < likesArray.length; i++) {
              if (likesArray[i].userId == this.userId) {
                this.posts[index].likes.splice(i, 1);
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

  viewPostSocial(post, link) {
    localStorage.setItem("item", JSON.stringify(post));
    localStorage.setItem("postId", post._id);
    this.iab.create(link, "_system", {
      location: "yes",
      closebuttoncaption: "done",
    });
  }

  viewComments(post) {
    this.apiService.presentToast("Please login", "danger");
    return;

    // this.selectedItemm = -1;
    // localStorage.setItem("item", JSON.stringify(post));
    // localStorage.setItem("postId", post._id);
    // this.router.navigate(["/comments"]);
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
      postId: this.allposts[index]._id,
    };

    let ApiEndPoint = IsLiked == true ? "deleteDisLike" : "addDisLike";

    this.presentLoading();
    this.apiService.postData(dict, ApiEndPoint).subscribe(
      (result) => {
        this.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          if (!IsLiked) {
            this.allposts[index].dislikes.push(result.data);
            for (var i = 0; i < likesArray.length; i++) {
              if (likesArray[i].userId == this.userId) {
                this.allposts[index].likes.splice(i, 1);
              }
            }
          } else {
            for (var i = 0; i < dislikesArray.length; i++) {
              if (dislikesArray[i].userId == this.userId) {
                this.allposts[index].dislikes.splice(i, 1);
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
    this.getAllReccomdations(false, "");
  }

  viewPost() {
    this.apiService.presentToast("Please login", "danger");
    return;
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

  getAllReccomdations(isFirstLoad, event) {
    this.userId = localStorage.getItem("userId");
    // this.posts = [];
    // this.allposts = [];
    let dict = {
      user_id: localStorage.getItem("userId"),
      skip: this.page_number,
      limit: this.page_limit,
      // type: this.profiletab,
      type: this.profiletab1,
      cat: this.cat,
      keyword: this.authForm?.value?.keyword,
      location: this.authSearchForm?.value?.location,
      lat: parseFloat(localStorage.getItem("lat")),
      lng: parseFloat(localStorage.getItem("long")),
      filter_cat_array: this.filter_cat_array,
      filter_cat_array_global: this.filter_cat_array_global,
    };
    if (this.counter == 0) {
      this.presentLoading();
    }
    // if(this.counter == 0){
    // this.apiService.presentLoading();
    // }

    this.apiService.postData(dict, "getAllRecc").subscribe(
      (result) => {
        this.allposts = result.data;
        this.ref.detectChanges();
        if (this.authSearchForm?.value?.keyword == "") {
          if (result.data.length > 10) {
            // this.posts = [];
            if (this.count == result.data.length) {
              this.is_response = false;
              event.target.complete();
            } else {
              if (this.local_posts.length == 0) {
                this.local_posts = result.data.slice(0, 9);
                this.start_count = 9;
              } else {
                for (let i = this.start_count; i < this.count; i++) {
                  this.local_posts.push(result.data[i]);
                  this.start_count = i + 1;
                }
              }
              if (isFirstLoad) event.target.complete();

              this.page_number++;
            }
          } else {
            this.local_posts = this.allposts;
            this.ref.detectChanges();
            // this.is_response = false;
            //event.target.complete();
          }
        } else {
          var searchText = this.authSearchForm?.value?.keyword;
          this.local_posts = this.allposts.filter((it) => {
            return (
              it.user_name.toLowerCase().includes(searchText) ||
              it.user_name.toUpperCase().includes(searchText) ||
              it.user_name.includes(searchText) ||
              it.category.toLowerCase().includes(searchText) ||
              it.category.toUpperCase().includes(searchText) ||
              it.category.includes(searchText) ||
              it.title.toLowerCase().includes(searchText) ||
              it.title.toUpperCase().includes(searchText) ||
              it.title.includes(searchText) ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.toLowerCase().includes(searchText)
                : "") ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.toUpperCase().includes(searchText)
                : "") ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.includes(searchText)
                : "")
            );
          });
          this.searchLocalRecc(false, "");
        }
        this.allposts = result.data;
        this.ref.detectChanges();
        this.is_response = true;
        if (this.authForm?.value?.keyword == "") {
          if (result.data.length > 10) {
            // this.posts = [];
            if (this.count == result.data.length) {
              this.is_response = false;
              event.target.complete();
            } else {
              if (this.allposts.length == 0) {
                this.allposts = result.data.slice(0, 9);
                this.start_count = 9;
              } else {
                for (let i = this.start_count; i < this.count; i++) {
                  this.allposts.push(result.data[i]);
                  this.start_count = i + 1;
                }
              }

              if (isFirstLoad) event.target.complete();

              this.page_number++;
            }
          } else {
            this.allposts = this.allposts;
            this.ref.detectChanges();
            // this.is_response = false;
            //event.target.complete();
          }
        } else {
          var searchText = this.authForm?.value?.keyword;
          this.allposts = this.allposts.filter((it) => {
            return (
              it.user_name.toLowerCase().includes(searchText) ||
              it.user_name.toUpperCase().includes(searchText) ||
              it.user_name.includes(searchText) ||
              it.category.toLowerCase().includes(searchText) ||
              it.category.toUpperCase().includes(searchText) ||
              it.category.includes(searchText) ||
              it.sub_category.toLowerCase().includes(searchText) ||
              it.sub_category.toUpperCase().includes(searchText) ||
              it.sub_category.includes(searchText) ||
              it.title.toLowerCase().includes(searchText) ||
              it.title.toUpperCase().includes(searchText) ||
              it.title.includes(searchText) ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.toLowerCase().includes(searchText)
                : "") ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.toUpperCase().includes(searchText)
                : "") ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.includes(searchText)
                : "")
            );
          });
        }

        this.ref.detectChanges();

        // if(this.counter == 0){
        //      this.apiService.stopLoading();
        //   }

        this.stopLoading();
      },
      (err) => {
        this.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time.",
          "danger"
        );
        this.apiService.stopLoading();
      }
    );
  }

  editPost(item, i) {
    this.selectedItemm = -1;
    localStorage.setItem("postId", item._id);
    localStorage.setItem("category_id", item.category_id);
    localStorage.setItem("route", "/tabs/home");
    this.router.navigate(["/edit-reccomendation"], { replaceUrl: true });
  }

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

  onNewSearch(data: any) {
    this.cd.detectChanges();
    if (data == "") {
      this.apiService.stopLoading();
      this.stopLoading();
      this.onclear();
    } else {
      var dict = {
        keyword: data,
      };
      this.cd.detectChanges();
      this.apiService.postData(dict, "filterSearch").subscribe((res: any) => {
        this.cd.detectChanges();
        this.filterSearchData = res;
        this.cd.detectChanges();
      });
    }
  }

  searchLocalRecc11(daata: any) {
    localStorage.removeItem("dict");
    if (this.cat_id == undefined) {
      this.cat_id = "All";
    }

    if (this.authSearchForm.controls["location"].value == "") {
      var dict = {
        lat: 0,
        lng: 0,
        recc_type_for_all: "All",
        cat: this.cat_id,
        keyword: daata,
      };
    } else {
      var dict = {
        lat: parseFloat(localStorage.getItem("lat")),
        lng: parseFloat(localStorage.getItem("long")),
        recc_type_for_all: "All",
        cat: this.cat_id,
        keyword: daata,
      };
    }
    // localStorage.setItem("dict", JSON.stringify(dict));
    // this.router.navigateByUrl("/posts");
    this.apiService
      .postData(dict, "getAllLocalfilterRecc")
      .subscribe((result) => {
        this.allposts = result.data;
        this.ref.detectChanges();
        this.is_response = true;
        if (this.authSearchForm?.value?.keyword == "") {
          if (result.data.length > 10) {
            // this.posts = [];
            if (this.count == result.data.length) {
              this.is_response = false;
              // event.target.complete();
            } else {
              if (this.local_posts.length == 0) {
                this.local_posts = result.data.slice(0, 9);
                this.start_count = 9;
              } else {
                for (let i = this.start_count; i < this.count; i++) {
                  this.local_posts.push(result.data[i]);
                  this.start_count = i + 1;
                }
              }
              // if (isFirstLoad) event.target.complete();
              // this.page_number++;
            }
          } else {
            this.local_posts = this.allposts;
            this.ref.detectChanges();
            // this.is_response = false;
            //event.target.complete();
          }
        } else {
          var searchText = this.authSearchForm.value.keyword;
          this.local_posts = this.allposts.filter((it) => {
            return (
              it.user_name.toLowerCase().includes(searchText) ||
              it.user_name.toUpperCase().includes(searchText) ||
              it.user_name.includes(searchText) ||
              it.category.toLowerCase().includes(searchText) ||
              it.category.toUpperCase().includes(searchText) ||
              it.category.includes(searchText) ||
              it.title.toLowerCase().includes(searchText) ||
              it.title.toUpperCase().includes(searchText) ||
              it.title.includes(searchText) ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.toLowerCase().includes(searchText)
                : "") ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.toUpperCase().includes(searchText)
                : "") ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.includes(searchText)
                : "")
            );
          });
        }

        this.ref.detectChanges();
      });
  }

  searchLocalRecc(isFirstLoad, event) {
    localStorage.removeItem("dict");
    if (this.cat_id == undefined) {
      this.cat_id = "All";
    }

    if (this.authSearchForm.controls["location"].value == "") {
      var dict = {
        lat: 0,
        lng: 0,
        recc_type_for_all: "All",
        cat: this.cat_id,
        keyword: this.authSearchForm?.value?.keyword,
      };
    } else {
      var dict = {
        lat: parseFloat(localStorage.getItem("lat")),
        lng: parseFloat(localStorage.getItem("long")),
        recc_type_for_all: "All",
        cat: this.cat_id,
        keyword: this.authSearchForm?.value?.keyword,
      };
    }
    // localStorage.setItem("dict", JSON.stringify(dict));
    // this.router.navigateByUrl("/posts");
    this.apiService
      .postData(dict, "getAllLocalfilterRecc")
      .subscribe((result) => {
        this.allposts = result.data;
        this.ref.detectChanges();
        this.is_response = true;
        if (this.authSearchForm?.value?.keyword == "") {
          if (result.data.length > 10) {
            // this.posts = [];
            if (this.count == result.data.length) {
              this.is_response = false;
              event.target.complete();
            } else {
              if (this.local_posts.length == 0) {
                this.local_posts = result.data.slice(0, 9);
                this.start_count = 9;
              } else {
                for (let i = this.start_count; i < this.count; i++) {
                  this.local_posts.push(result.data[i]);
                  this.start_count = i + 1;
                }
              }
              if (isFirstLoad) event.target.complete();
              this.page_number++;
            }
          } else {
            this.local_posts = this.allposts;
            this.ref.detectChanges();
            // this.is_response = false;
            //event.target.complete();
          }
        } else {
          var searchText = this.authSearchForm.value.keyword;
          this.local_posts = this.allposts.filter((it) => {
            return (
              it.user_name.toLowerCase().includes(searchText) ||
              it.user_name.toUpperCase().includes(searchText) ||
              it.user_name.includes(searchText) ||
              it.category.toLowerCase().includes(searchText) ||
              it.category.toUpperCase().includes(searchText) ||
              it.category.includes(searchText) ||
              it.title.toLowerCase().includes(searchText) ||
              it.title.toUpperCase().includes(searchText) ||
              it.title.includes(searchText) ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.toLowerCase().includes(searchText)
                : "") ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.toUpperCase().includes(searchText)
                : "") ||
              (this.errors.indexOf(it.description) == -1
                ? it.description.includes(searchText)
                : "")
            );
          });
        }

        this.ref.detectChanges();
      });
  }

  setFilteredLocalLocations(searchText) {
    this.local_posts = this.allposts.filter((it) => {
      return (
        it.user_name.toLowerCase().includes(searchText) ||
        it.user_name.toUpperCase().includes(searchText) ||
        it.user_name.includes(searchText) ||
        it.category.toLowerCase().includes(searchText) ||
        it.category.toUpperCase().includes(searchText) ||
        it.category.includes(searchText) ||
        it.title.toLowerCase().includes(searchText) ||
        it.title.toUpperCase().includes(searchText) ||
        it.title.includes(searchText) ||
        (this.errors.indexOf(it.description) == -1
          ? it.description.toLowerCase().includes(searchText)
          : "") ||
        (this.errors.indexOf(it.description) == -1
          ? it.description.toUpperCase().includes(searchText)
          : "") ||
        (this.errors.indexOf(it.description) == -1
          ? it.description.includes(searchText)
          : "")
      );
    });
    // this.is_response = false;
  }

  codeLatLng(lat, lng) {
    var self = this;
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng: latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          //formatted address
          self.authSearchForm.controls["location"].setValue(
            results[0].formatted_address
          );
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

  currentLocationUser() {
    navigator.geolocation.getCurrentPosition(
      function (value) {
        // alert('Location accessed')
        localStorage.setItem("lattitude", value.coords.latitude.toString());
        localStorage.setItem("longitude", value.coords.longitude.toString());
      },
      function () {
        //alert('User not allowed')
      },
      { timeout: 10000 }
    );
  }

  useCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      function (value) {
        // alert('Location accessed')
        localStorage.setItem("lat", value.coords.latitude.toString());
        localStorage.setItem("long", value.coords.longitude.toString());
      },
      function () {
        //alert('User not allowed')
      },
      { timeout: 10000 }
    );
    this.codeLatLng(localStorage.getItem("lat"), localStorage.getItem("long"));
    var dict = {
      lat: parseFloat(localStorage.getItem("lat")),
      lng: parseFloat(localStorage.getItem("long")),
      recc_type_for_all: "All",
      cat: this.cat_id,
      keyword: this.authSearchForm?.value?.keyword,
    };

    localStorage.setItem("dict", JSON.stringify(dict));
    this.router.navigateByUrl("/posts");
  }

  catChange(cat, str) {
    if (str == "web") {
      this.counter = 4;
    }
    if (str == "app") {
      this.counter = 0;
    }

    this.is_response = false;
    this.posts = [];
    this.page_number = 1;
    // this.getAllReccomdations(false, "");
    this.searchLocalRecc(false, "");
  }

  onWheel(event: WheelEvent): void {
    if (event.deltaY > 0)
      document.getElementById("container")!.scrollLeft += 40;
    else document.getElementById("container")!.scrollLeft -= 40;
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
  viewUser(item) {
    this.selectedItemm = -1;
    localStorage.setItem("item", JSON.stringify(item));
    localStorage.setItem("clicked_user_id", item.user_id);
    localStorage.setItem("add_user_type", item.add_user_type);
    // this.router.navigateByUrl('/user-profile', { replaceUrl: true })
    this.router.navigate(["user-profile"]);
  }

  getCategories() {
    // var dict = {};
    // this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
    };

    this.apiService.postData(dict, "categories").subscribe(
      (result) => {
        // this.apiService.stopLoading();
        this.ref.detectChanges();
        this.categories = result.data;
        for (var i = 0; i < result.data.length; i++) {
          var dict = {
            name: result.data[i].name,
            type: "checkbox",
            label: result.data[i].name,
            value: result.data[i]._id,
            checked: false,
          };
          this.categoriesCheck.push(dict);
        }
        if (result.status == 1) {
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "success"
          );
        }
        this.getUsers();
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "success"
        );
      }
    );
  }

  createForm() {
    this.authForm = this.formBuilder.group({
      keyword: ["", Validators.compose([Validators.required])],
    });

    this.authSearchForm = this.formBuilder.group({
      keyword: [""],
      location: [""],
    });
  }

  public handleAddressChange(address) {
    if (address.response) {
      this.authSearchForm.patchValue({
        location: address.data.formatted_address,
      });
      this.geoCode(address.data.formatted_address);
    } else {
      this.apiService.stopLoading();
      this.stopLoading();
      this.getAllReccomdations(true, "");
    }
  }

  // autoCompleteCallback1(data: any): any {
  //   localStorage.removeItem("lat");
  //   localStorage.removeItem("long");
  //   this.componentData1 = JSON.stringify(data);
  //   console.log(JSON.parse(this.componentData1));
  //   this.authSearchForm.patchValue({
  //     location: this.componentData1.data.formatted_address,
  //   });

  //   this.geoCode(this.componentData1.data.formatted_address);
  // }

  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      localStorage.setItem("lat", this.latitude.toString());
      localStorage.setItem("long", this.longitude.toString());
      this.searchLocalRecc(false, "");
    });
  }

  ngOnDestroy() {
    // alert('leaveccc');
    this.stopLoading();
    if (this.player === undefined || !this.player || null) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
      // document.getElementById('iframeone').style.display = "none";
    }

    this.play_video = false;
    // document.getElementById('iframeone').style.display = "none";
  }

  getUsers() {
    // this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
    };

    this.apiService.postData(dict, "recentUsersListWeb").subscribe(
      (result) => {
        this.ref.detectChanges();
        this.apiService.stopLoading();
        this.users = result.data;
        if (result.status == 1) {
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "success"
          );
        }
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "success"
        );
      }
    );
  }

  async presentAlert() {
    const alert = await this.apiService.alertController.create({
      cssClass: "my-custom-class",
      header: "Categories",
      inputs: this.categoriesCheck,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: "Ok",
          handler: (data) => {
            this.categoriesChecked = data;
            for (var i = 0; i < this.categoriesCheck.length; i++) {
              if (data.indexOf(this.categoriesCheck[i].value) >= 0) {
                this.categoriesCheck[i].checked = true;
              } else {
                this.categoriesCheck[i].checked = false;
              }
            }
            localStorage.setItem(
              "categoriesCheck",
              JSON.stringify(this.categoriesChecked)
            );
          },
        },
      ],
    });
    await alert.present();
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

  goto() {
    if (this.errors.indexOf(localStorage.getItem("userId")) >= 0) {
      this.router.navigate(["/login"]);
    } else {
      this.router.navigate(["/tabs/home"]);
    }
  }
  getCategoriesLatest() {
    //this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
      type: this.category_type,
    };

    this.apiService.postData(dict, "onlycategories").subscribe(
      (result) => {
        //this.apiService.stopLoading();
        this.ref.detectChanges();
        this.latest_categories = result.data.filter(
          (data) => data.isAll == false
        );
        // this.latest_categories = result.data;
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

  //Facebook login
  facebookLogin() {
    if (this.platform.is("cordova")) {
      this.fb
        .login(["public_profile", "email"])
        .then((res: FacebookLoginResponse) =>
          this.fb
            .api(
              "me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)",
              []
            )
            .then((profile) => {
              if (this.errors.indexOf(profile) == -1) {
                let dict = {
                  name: profile["name"],
                  email: profile["email"],
                  password: "",
                  medium: "facebook",
                  social_id: profile["id"],
                  image: profile["picture_large"]["data"]["url"],
                  fcm_token: this.fcm_token,
                  contact: "",
                  location: "",
                  bio: "",
                };
                this.finalSignup(dict);
              } else {
                this.apiService.presentToast(
                  "Error,Please try after some time",
                  "danger"
                );
              }
            })
        )
        .catch((e) => {
          this.apiService.presentToast(
            "Error,Please try after some time",
            "danger"
          );
        });
    } else {
      this.fbLogin();
    }
  }

  fbLogin() {
    //this.loginType = 'Login with Facebook'
    // return this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

    const provider = new firebase.auth.FacebookAuthProvider();
    this.fireAuth.auth
      .signInWithPopup(provider)
      .then((result) => {
        // if(this.errors.indexOf(result) == -1){
        let dict = {
          name: result.additionalUserInfo.profile["name"],
          email: result.additionalUserInfo.profile["email"],
          password: "",
          medium: "facebook",
          social_id: result.additionalUserInfo.profile["id"],
          image: result.additionalUserInfo.profile["picture"]["data"]["url"],
          fcm_token: this.fcm_token,
          contact: "",
          location: "",
          bio: "",
        };
        this.finalSignup(dict);

        // }else{
        //     this.apiService.presentToast('Error,Please try after some time', 'danger')
        // }
      })
      .catch((error) => console.error("Sigin error", error));
  }

  //Google social login
  googleLogin() {
    if (this.platform.is("cordova")) {
      this.googlePlus
        .login({ scopes: "profile" })
        .then((profile) => {
          if (this.errors.indexOf(profile) == -1) {
            let dict = {
              name: profile["displayName"],
              email: profile["email"],
              password: "",
              medium: "google",
              social_id: profile["userId"],
              image: !profile["imageUrl"] ? "" : profile["imageUrl"],
              fcm_token: this.fcm_token,
              contact: "",
              location: "",
              bio: "",
            };

            // var check_user = {
            //   medium: 'google',
            //   social_id: profile['id']
            // }
            // this.apiService.postData(check_user,'check_user_existance').subscribe((result) => {
            //   console.log(result);
            //   if(result.status == 0){

            //   }else{

            //   }
            // });

            this.finalSignup(dict);
          }
        })
        .catch((err) => {
          console.error(err);
          this.apiService.presentToast(
            "Error,Please try after some time",
            "danger"
          );
        });
    } else {
      this.gglLogin();
    }
  }

  openUpdate(i) {
    if (this.selectedItemm == i) {
      this.selectedItemm = -1;
    } else {
      this.selectedItemm = i;
    }
  }

  onSearchChange(value: any) {
    console.log(value);
    if (value == "") {
      this.getAllReccomdations(true, "");
    } else {
      if (value.type == "user") {
        this.selectedItemm = -1;
        localStorage.setItem("item", JSON.stringify(value.data));
        localStorage.setItem("clicked_user_id", value.id);
        localStorage.setItem("add_user_type", value.type);
        this.router.navigate(["user-profile"]);
      } else {
        var searchText = value.name;
        this.allposts = this.allposts.filter((it) => {
          return (
            it.user_name.toLowerCase().includes(searchText) ||
            it.user_name.toUpperCase().includes(searchText) ||
            it.user_name.includes(searchText) ||
            it.category.toLowerCase().includes(searchText) ||
            it.category.toUpperCase().includes(searchText) ||
            it.category.includes(searchText) ||
            it.title.toLowerCase().includes(searchText) ||
            it.title.toUpperCase().includes(searchText) ||
            it.title.includes(searchText) ||
            (this.errors.indexOf(it.description) == -1
              ? it.description.toLowerCase().includes(searchText)
              : "") ||
            (this.errors.indexOf(it.description) == -1
              ? it.description.toUpperCase().includes(searchText)
              : "") ||
            (this.errors.indexOf(it.description) == -1
              ? it.description.includes(searchText)
              : "")
          );
        });
      }
    }
  }

  onclear() {
    this.getAllReccomdations(false, "");
  }

  gglLogin() {
    //this.loginType = 'Login with Facebook'
    // return this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

    const provider = new firebase.auth.GoogleAuthProvider();
    this.fireAuth.auth
      .signInWithPopup(provider)
      .then((result) => {
        // if(this.errors.indexOf(result) == -1){
        let dict = {
          name: result.additionalUserInfo.profile["name"],
          email: result.additionalUserInfo.profile["email"],
          password: "",
          medium: "google",
          social_id: result.additionalUserInfo.profile["id"],
          image: !result.additionalUserInfo.profile["picture"]
            ? ""
            : result.additionalUserInfo.profile["picture"],
          fcm_token: this.fcm_token,
          contact: "",
          location: "",
          bio: "",
        };
        this.finalSignup(dict);

        // }else{
        //     this.apiService.presentToast('Error,Please try after some time', 'danger')
        // }
      })
      .catch((error) => console.error("Sigin error", error));
  }

  finalSignup(dict) {
    this.apiService.presentLoading();
    // this.fcm.getToken().then(token => {
    this.apiService.postData(dict, "social_login").subscribe(
      (result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          localStorage.setItem("userId", result.data._id);
          localStorage.setItem("IsLoggedIn", "true");
          localStorage.setItem("profile", JSON.stringify(result.data));
          localStorage.setItem("user_name", result.data.name);
          localStorage.setItem("user_image", result.data.image);
          if (this.errors.indexOf(result.data.email) >= 0) {
            localStorage.setItem("user_email", "");
          } else {
            localStorage.setItem("user_email", result.data.email);
          }
          localStorage.setItem("user_medium", dict.medium);
          localStorage.setItem("first_login", result.data.first_login);
          this.globalFooService.publishSomeData({
            foo: { data: result.data, page: "profile" },
          });
          this.apiService.presentToast("Login successfully!", "success");
          //this.apiService.navCtrl.navigateRoot('tabs/home');

          if (result.data.first_login == true) {
            this.apiService.navCtrl.navigateRoot("tabs/home");
          } else {
            this.apiService.navCtrl.navigateRoot("/category");
          }
        } else {
          this.apiService.presentToast(
            "Error while signing up! Please try later",
            "danger"
          );
        }
      },
      (err) => {
        this.apiService.stopLoading();
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "danger"
        );
      }
    );
    // });
  }
}
