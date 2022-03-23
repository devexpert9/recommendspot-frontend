import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  ChangeDetectorRef,
  ElementRef,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ApiserviceService } from "../services/apiservice.service";
import { GlobalFooService } from "../services/globalFooService.service";
import { config } from "../services/config";
import { Router } from "@angular/router";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import {
  MenuController,
  LoadingController,
  AlertController,
  Platform,
  IonContent,
  NavController,
  ModalController,
} from "@ionic/angular";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as $ from "jquery";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
declare var window: any;
declare var Branch;
declare var google: any;
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
// import { AddRecommendService } from '../services/addrecommend.service';
import { ImagepopupPage } from "../imagepopup/imagepopup.page";

@Component({
  selector: "app-post",
  templateUrl: "./post.page.html",
  styleUrls: ["./post.page.scss"],
})
export class PostPage implements OnInit {
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  @ViewChild("widgetsContent", { read: ElementRef })
  public widgetsContent: ElementRef<any>;
  authForm: FormGroup;
  authSearchForm: FormGroup;
  selectedItem: any = "item1";
  profiletab = "Global";
  profiletab1: string = "Today";
  isAndroid: boolean = false;
  posts: any = [];
  local_posts: any = [];
  allposts: any = [];
  is_response = false;
  IMAGES_URL: any = config.IMAGES_URL;
  errors = config.errors;
  page_number = 1;
  page_limit = 10;
  keyword = "";
  private win: any = window;
  userId: any;
  counter = 0;
  hideMe = false;
  selectedItemm = -1;
  selectedItemmShare = -1;
  open = false;
  type = "Random";
  user_name: any;
  user_image: any;
  user_email: any;
  user_id: any;
  platform1: any;

  categories: any;
  latest_categories: any;
  cat: any = "All";
  filter_cat_array_local: any = [];
  filter_cat_array_global: any = [];
  filter_cat_array = JSON.parse(localStorage.getItem("categoriesCheck"));
  categoriesChecked = JSON.parse(localStorage.getItem("categoriesCheck"));
  categoriesCheck = [];
  @ViewChild(IonContent, { static: true }) content: IonContent;
  noti_count = localStorage.getItem("notiCount");
  index: any = -1;
  play_video = false;
  iframeid: any;
  player: any;
  count = 10;
  keyword1 = "name";
  start_count = 0;
  loading: any;
  latitude: any;
  longitude: any;
  category_type: any = "1";

  hideMe2 = false;
  dict: any;
  isLogin: any;
  cat_id: any = "All";
  filterSearchData: any;
  hide2() {
    this.hideMe2 = !this.hideMe2;
  }
  slideOpts2 = {
    autoWidth: true,
    slidesPerView: 2.25,
    spaceBetween: 10,
    speed: 400,
    breakpoints: {
      767: { autoWidth: true, slidesPerView: 4, spaceBetween: 15 },
      1024: { autoWidth: true, slidesPerView: 4, spaceBetween: 15 },
    },
  };
  showInput: boolean = false;
  clickEvent() {
    this.showInput = !this.showInput;
  }
  constructor(
    public sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    public apiService: ApiserviceService,
    public router: Router,
    private socialSharing: SocialSharing,
    private menuCtrl: MenuController,
    private globalFooService: GlobalFooService,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private iab: InAppBrowser,
    private platform: Platform /*, private addrecommendService: AddRecommendService*/,
    public navController: NavController,
    private loadingController: LoadingController,
    public modalController: ModalController
  ) {
    this.createForm();

    this.user_name = localStorage.getItem("user_name");
    this.user_image = localStorage.getItem("user_image");
    this.user_email = localStorage.getItem("user_email");
    this.user_id = localStorage.getItem("userId");
    var self = this;
    var categorydict = JSON.parse(localStorage.getItem("categorydict"));
    if (categorydict == null) {
      var dict = JSON.parse(localStorage.getItem("dict"));
      this.dict = dict;
      this.authSearchForm.controls["keyword"].setValue(this.dict.keyword);
      this.searchLocalRecc("false", "");
    } else {
      this.apiService.postData(categorydict, "getAllRecc").subscribe(
        (result) => {
          this.is_response = true;
          this.posts = result.data;
          this.ref.detectChanges();
          this.apiService.stopLoading();
          this.stopLoading();
        },
        (err) => {
          // this.stopLoading();
          this.apiService.presentToast(
            "Technical error,Please try after some time.",
            "danger"
          );
          // this.apiService.stopLoading();
        }
      );
    }

    this.globalFooService.getObservable().subscribe((data) => {
      self.menuCtrl.enable(true);
      self.profiletab = "Basic";
      self.counter = 1;
      self.page_number = 1;
      self.is_response = false;
      self.posts = [];
      // self.getAllReccomdations(false, "");
      this.user_name = localStorage.getItem("user_name");
      this.user_image = localStorage.getItem("user_image");
      this.user_email = localStorage.getItem("user_email");
      this.user_id = localStorage.getItem("userId");

      // if(localStorage.getItem('first_login') == 'true'){
      //   // this.router.navigate(['tabs/home']);
      // }else{
      //   this.router.navigate(['/category']);
      // }

      // if(localStorage.getItem('first_login') === 'false'){

      //   // self.router.navigate(['/category']);
      // }else{

      //   self.counter = 1;
      //   self.page_number = 1;
      //   self.is_response = false;
      //   self.posts = [];
      //   self.getAllReccomdations(false, '');
      //   self.updateInfo(data);
      // }
    });
  }

  closeshare() {
    // this.selectedItemmShare = -1;
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

  gotToTop() {
    this.content.scrollToTop(1000);
  }

  gotocat() {
    this.router.navigate(["/category"], { replaceUrl: true });
  }

  gotofollowing() {
    var user_id = localStorage.getItem("userId");
    localStorage.setItem("clickUserId", user_id);
  }

  ngOnInit() {
    // alert('aaa')
    this.platform1 = this.platform.is("cordova");
    // var self = this;
    // self.profiletab = "Basic";
    // this.userId = '';
    // this.counter = 0;
    // this.is_response = false;
    // this.posts = [];
    // this.page_number = 1;
    // this.getAllReccomdations(false, '');

    this.count = 10;
    this.noti_count = localStorage.getItem("notiCount");
    // var self = this;
    // self.profiletab = "Basic";
    // // if(localStorage.getItem('first_login') === 'false'){
    // //   this.router.navigate(['/category']);
    // // }else{
    //   this.userId = '';

    this.counter = 0;
    this.is_response = false;
    this.posts = [];
    this.page_number = 1;
    // this.getCategories();
    this.getCategoriesLatest();
    //this.getAllLocalRecommendations(false, "");
    // this.getAllReccomdations(false, "");
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

  // when video ends
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
    this.getAllReccomdations(false, "");
  }

  //define the validators for form fields
  createForm() {
    this.authForm = this.formBuilder.group({
      keyword: ["", Validators.compose([Validators.required])],
    });

    this.authSearchForm = this.formBuilder.group({
      keyword: [""],
      location: [""],
    });
  }

  viewPostSocial(post, link) {
    this.apiService.presentToast("Please login", "danger");
    return;
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

  closeUpdate() {
    this.selectedItemm = -1;
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

  typeChange(type) {
    var isFirstLoad = false;
    this.start_count = 0;
    this.posts = [];
    if (type == "Saved") {
      for (let i = 0; i < this.allposts.length; i++) {
        // loop through the array, moving forwards:
        // note in loop below we set `j = i` so we move on after finding greatest value:
        for (let j = i; j < this.allposts.length; j++) {
          if (parseInt(this.allposts[i].fav) < parseInt(this.allposts[j].fav)) {
            let temp = this.allposts[i]; // store original value for swapping
            this.allposts[i] = this.allposts[j]; // set original value position to greater value
            this.allposts[j] = temp; // set greater value position to original value
          }
        }
      }

      if (this.authForm.value.keyword == "") {
        if (this.allposts.length > 10) {
          // this.posts = [];
          if (this.count == this.allposts.length) {
            this.is_response = false;
            // event.target.complete();
          } else {
            for (let i = this.start_count; i < this.count; i++) {
              this.posts.push(this.allposts[i]);
              this.start_count = i + 1;
            }

            if (isFirstLoad)
              // event.target.complete();

              this.page_number++;
          }
        } else {
          this.posts = this.allposts;
          // this.is_response = false;
          //event.target.complete();
        }
      } else {
        var searchText = this.authForm.value.keyword;
        this.posts = this.allposts.filter((it) => {
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
    } else if (type == "Comments") {
      for (let i = 0; i < this.allposts.length; i++) {
        // loop through the array, moving forwards:
        // note in loop below we set `j = i` so we move on after finding greatest value:
        for (let j = i; j < this.allposts.length; j++) {
          if (this.allposts[i].comment_count < this.allposts[j].comment_count) {
            let temp = this.allposts[i]; // store original value for swapping
            this.allposts[i] = this.allposts[j]; // set original value position to greater value
            this.allposts[j] = temp; // set greater value position to original value
          }
        }
      }

      if (this.authForm.value.keyword == "") {
        if (this.allposts.length > 10) {
          // this.posts = [];
          if (this.count == this.allposts.length) {
            this.is_response = false;
            // event.target.complete();
          } else {
            for (let i = this.start_count; i < this.count; i++) {
              this.posts.push(this.allposts[i]);
              this.start_count = i + 1;
            }

            if (isFirstLoad)
              // event.target.complete();

              this.page_number++;
          }
        } else {
          this.posts = this.allposts;
          // this.is_response = false;
          //event.target.complete();
        }
      } else {
        var searchText = this.authForm.value.keyword;
        this.posts = this.allposts.filter((it) => {
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
    } else if (type == "Likes") {
      for (let i = 0; i < this.allposts.length; i++) {
        // loop through the array, moving forwards:
        // note in loop below we set `j = i` so we move on after finding greatest value:
        for (let j = i; j < this.allposts.length; j++) {
          if (this.allposts[i].like_count < this.allposts[j].like_count) {
            let temp = this.allposts[i]; // store original value for swapping
            this.allposts[i] = this.allposts[j]; // set original value position to greater value
            this.allposts[j] = temp; // set greater value position to original value
          }
        }
      }

      if (this.authForm.value.keyword == "") {
        if (this.allposts.length > 10) {
          // this.posts = [];
          if (this.count == this.allposts.length) {
            this.is_response = false;
            // event.target.complete();
          } else {
            for (let i = this.start_count; i < this.count; i++) {
              this.posts.push(this.allposts[i]);
              this.start_count = i + 1;
            }

            if (isFirstLoad)
              // event.target.complete();

              this.page_number++;
          }
        } else {
          this.posts = this.allposts;
          // this.is_response = false;
          //event.target.complete();
        }
      } else {
        var searchText = this.authForm.value.keyword;
        this.posts = this.allposts.filter((it) => {
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
    } else {
      this.getAllReccomdations(false, "");
    }
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

  ngOnDestroy() {
    // alert('leaveccc');
    localStorage.removeItem("dict");
    localStorage.removeItem("categorydict");
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

  ionViewWillLeave() {
    if (this.player === undefined || !this.player || null) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
      // document.getElementById('iframeone').style.display = "none";
    }

    this.play_video = false;
    // document.getElementById('iframeone').style.display = "none";
  }

  stopPlayer() {
    if (this.player === undefined || !this.player || null) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
    }
  }

  ionViewDidEnter() {
    this.isLogin = localStorage.getItem("IsLoggedIn");
    // this.count = 10;
    // this.noti_count = localStorage.getItem('notiCount');
    // console.log('noti = ', this.noti_count)
    // // var self = this;
    // // self.profiletab = "Basic";
    // // // if(localStorage.getItem('first_login') === 'false'){
    // // //   this.router.navigate(['/category']);
    // // // }else{
    // //   this.userId = '';

    //   this.counter = 0;
    //   this.is_response = false;
    //   this.posts = [];
    //   this.page_number = 1;
    //   // this.getCategories();
    //   this.getAllReccomdations(false, '');
    // }

    // self.counter = 1;
    // self.page_number = 1;
    // self.is_response = false;
    // self.posts = [];
    // self.getAllReccomdations(false, '');

    this.menuCtrl.enable(false);
  }

  setFilteredLocations(searchText) {
    this.posts = this.allposts.filter((it) => {
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
    // this.is_response = false;
  }

  onSearchChange(value: any) {
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

  onSegmentChange(e) {
    this.profiletab = "";
    this.profiletab = e.detail.value;
    this.counter = 0;
    this.is_response = false;
    this.posts = [];
    this.allposts = [];
    this.page_number = 1;
    this.start_count = 0;
    this.count = 10;
    this.ref.detectChanges();
    if (e.detail.value == "Global") {
      this.category_type = "2";
    } else {
      this.category_type = "1";
    }
    this.getCategoriesLatest();
    this.getAllReccomdations(false, "");
  }

  search() {
    this.counter = 0;
    this.is_response = false;
    this.posts = [];
    this.page_number = 1;
    this.getAllReccomdations(false, "");
  }

  updateInfo(data) {
    this.user_name = localStorage.getItem("user_name");
    this.user_image = localStorage.getItem("user_image");
    this.user_email = localStorage.getItem("user_email");
    this.user_id = localStorage.getItem("userId");
  }

  getAllReccomdations(isFirstLoad, event) {
    this.userId = localStorage.getItem("userId");
    let dict = {
      user_id: localStorage.getItem("userId"),
      skip: this.page_number,
      limit: this.page_limit,
      // type: this.profiletab,
      type: this.profiletab1,
      cat: this.cat,
      keyword: this.authForm.value.keyword,
      //filter_cat_array: this.filter_cat_array,
      filter_cat_array: this.filter_cat_array_global,
      filter_cat_array_global: this.filter_cat_array_global,
    };

    if (this.counter == 0) {
      //this.presentLoading();
    }
    // if(this.counter == 0){
    // this.apiService.presentLoading();
    // }

    this.apiService.postData(dict, "getAllRecc").subscribe(
      (result) => {
        this.ref.detectChanges();
        // if(this.counter == 0){
        //    this.apiService.stopLoading();
        // }
        if (this.counter == 4) {
          //this.apiService.stopLoading();
        }

        // this.posts = result.data;

        //  for (let i = 0; i < result.data.length; i++) {
        //   // loop through the array, moving forwards:
        //   // note in loop below we set `j = i` so we move on after finding greatest value:

        //   for (let j = i; j < result.data.length; j++) {

        //   if (parseInt(result.data[i].fav) < parseInt(result.data[j].fav)) {
        //       let temp = result.data[i]; // store original value for swapping
        //       result.data[i] = result.data[j]; // set original value position to greater value
        //       result.data[j] = temp; // set greater value position to original value
        //     };
        //     if (result.data[i].comment_count < result.data[j].comment_count) {
        //       if (result.data[i].comment_count < result.data[j].like_count) {

        //         let temp = result.data[i]; // store original value for swapping
        //         result.data[i] = result.data[j]; // set original value position to greater value
        //         result.data[j] = temp; // set greater value position to original value
        //     }else{
        //       if (result.data[i].like_count < result.data[j].comment_count) {
        //           let temp = result.data[i]; // store original value for swapping
        //           result.data[i] = result.data[j]; // set original value position to greater value
        //           result.data[j] = temp; // set greater value position to original value
        //       };
        //     }
        //     }else if (result.data[i].like_count < result.data[j].like_count) {
        //        if (result.data[i].like_count < result.data[j].comment_count) {
        //         let temp = result.data[i]; // store original value for swapping
        //         result.data[i] = result.data[j]; // set original value position to greater value
        //         result.data[j] = temp; // set greater value position to original value
        //     }else{
        //       if (result.data[i].comment_count < result.data[j].like_count) {

        //           let temp = result.data[i]; // store original value for swapping
        //           result.data[i] = result.data[j]; // set original value position to greater value
        //           result.data[j] = temp; // set greater value position to original value
        //       }
        //     };
        //     };
        //     // if (result.data[i].comment_count < result.data[j].like_count) {
        //     //   let temp = result.data[i]; // store original value for swapping
        //     //   result.data[i] = result.data[j]; // set original value position to greater value
        //     //   result.data[j] = temp; // set greater value position to original value
        //     // }
        //     // if (result.data[i].like_count < result.data[j].comment_count) {
        //     //  let temp = result.data[i]; // store original value for swapping
        //     //   result.data[i] = result.data[j]; // set original value position to greater value
        //     //   result.data[j] = temp; // set greater value position to original value
        //     // };

        //   };

        // };
        // var count = 10;
        this.allposts = result.data;
        this.ref.detectChanges();
        this.is_response = true;
        if (this.authForm.value.keyword == "") {
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
          var searchText = this.authForm.value.keyword;
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

  doInfinite(event) {
    this.counter = 1;
    if (this.allposts.length - this.posts.length < 10) {
      this.count = this.count + (this.allposts.length - this.posts.length);
    } else {
      this.count = this.count + 10;
    }

    this.getAllReccomdations(true, event);
  }

  doInfiniteLocal(event) {
    this.counter = 1;
    if (this.allposts.length - this.posts.length < 10) {
      this.count = this.count + (this.allposts.length - this.posts.length);
    } else {
      this.count = this.count + 10;
    }

    this.getAllLocalRecommendations(true, event);
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

  addRemoveReccomdation(item, type, index) {
    this.apiService.presentToast("Please login", "danger");
    return;

    let dict = {
      user_id: localStorage.getItem("userId"),
      recc_id: item._id,
      type: type,
    };

    this.presentLoading();
    this.apiService.postData(dict, "addRemoveRecc").subscribe((result) => {
      this.stopLoading();
      this.ref.detectChanges();
      this.posts[index].fav = type;
      if (this.profiletab == "Saved") {
        this.posts.splice(index, 1);
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

    var onSuccess = function (result) {};

    var onError = function (msg) {};

    this.win.plugins.socialsharing.shareWithOptions(
      options,
      onSuccess,
      onError
    );
  }

  like(likesArray, dislikesArray, index, post) {
    var isLogin = localStorage.getItem("IsLoggedIn");
    if (isLogin == "true") {
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
    } else {
      this.apiService.presentToast("Please login", "danger");
      return;
    }
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

  isLikedPost(likesArray) {
    //assets/imgs/like.png
    let IsLiked = false;
    if (likesArray.length == 0) {
    } else {
      for (var i = 0; i < likesArray.length; i++) {
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

  viewPost(post) {
    var isLogin = localStorage.getItem("IsLoggedIn");
    if (isLogin == "true") {
      this.selectedItemm = -1;
      localStorage.setItem("item", JSON.stringify(post));
      localStorage.setItem("postId", post._id);
      this.router.navigate(["/post-details"], { replaceUrl: true });
    } else {
      this.apiService.presentToast("Please login", "danger");
      return;
    }
  }

  viewComments(post) {
    var isLogin = localStorage.getItem("IsLoggedIn");
    if (isLogin == "true") {
      this.selectedItemm = -1;
      localStorage.setItem("item", JSON.stringify(post));
      localStorage.setItem("postId", post._id);
      this.router.navigate(["/comments"], { replaceUrl: true });
    } else {
      this.apiService.presentToast("Please login", "danger");
      return;
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

  //social share

  async selectSocialShare(item) {
    const actionSheet = await this.apiService.actionSheetController.create({
      header: "Share via",
      buttons: [
        {
          text: "Whatsapp",
          handler: () => {
            this.socialSharing
              .shareViaWhatsApp(
                item.description,
                this.errors.indexOf(item.image) >= 0
                  ? null
                  : this.IMAGES_URL + "/IMAGES/" + item.image,
                this.errors.indexOf(item.web_link) >= 0 ? null : item.web_link
              )
              .then((res) => {
                // Success
              })
              .catch((e) => {
                // Error!
              });
          },
        },
        {
          text: "Instagram",
          handler: () => {
            this.socialSharing
              .shareViaInstagram(
                item.description,
                this.errors.indexOf(item.image) >= 0
                  ? null
                  : this.IMAGES_URL + "/IMAGES/" + item.image
              )
              .then((res) => {
                // Success
              })
              .catch((e) => {
                // Error!
              });
          },
        },
        {
          text: "Facebook",
          handler: () => {
            this.socialSharing
              .shareViaFacebook(
                item.description,
                this.errors.indexOf(item.image) >= 0
                  ? null
                  : this.IMAGES_URL + "/IMAGES/" + item.image,
                this.errors.indexOf(item.web_link) >= 0 ? null : item.web_link
              )
              .then((res) => {
                // Success
              })
              .catch((e) => {
                // Error!
              });
          },
        },
        {
          text: "Twitter",
          handler: () => {
            this.socialSharing
              .shareViaTwitter(
                item.description,
                this.errors.indexOf(item.image) >= 0
                  ? null
                  : this.IMAGES_URL + "/IMAGES/" + item.image,
                this.errors.indexOf(item.web_link) >= 0 ? null : item.web_link
              )
              .then((res) => {
                // Success
              })
              .catch((e) => {
                // Error!
              });
          },
        },
        {
          text: "Email",
          handler: () => {
            this.socialSharing
              .shareViaEmail(item.description, "Favreet-Share Post", [])
              .then((res) => {
                // Success
              })
              .catch((e) => {
                // Error!
              });
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  //edit post
  editPost(item, i) {
    this.selectedItemm = -1;
    localStorage.setItem("postId", item._id);
    localStorage.setItem("category_id", item.category_id);
    localStorage.setItem("route", "/tabs/home");
    this.router.navigate(["/edit-reccomendation"], { replaceUrl: true });
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
          this.posts.splice(i, 1);
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

  ///category area
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
        this.latest_categories = result.data;
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

  ///category area
  getCategories() {
    //this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
    };

    this.apiService.postData(dict, "categories").subscribe(
      (result) => {
        //this.apiService.stopLoading();
        this.ref.detectChanges();

        for (var i = 0; i < result.data.length; i++) {
          if (this.filter_cat_array.indexOf(result.data[i]._id) >= 0) {
            result.data[i].checked = true;
          } else {
            result.data[i].checked = false;
          }
        }
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
        this.getAllReccomdations(false, "");
        if (result.status == 1) {
        } else {
          this.apiService.presentToast(
            "Error while sending request,Please try after some time",
            "success"
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

  async presentAlertRadio() {
    const alert = await this.apiService.alertController.create({
      cssClass: "my-custom-class",
      header: "Sort By",
      inputs: [
        {
          name: "Saved",
          type: "radio",
          label: "Saved",
          value: "Saved",
          checked: this.type == "Saved" ? true : false,
        },
        {
          name: "Likes",
          type: "radio",
          label: "Likes",
          value: "Likes",
          checked: this.type == "Likes" ? true : false,
        },
        {
          name: "Comments",
          type: "radio",
          label: "Comments",
          value: "Comments",
          checked: this.type == "Comments" ? true : false,
        },
        {
          name: "Random",
          type: "radio",
          label: "Random",
          value: "Random",
          checked: this.type == "Random" ? true : false,
        },
      ],
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
            this.typeChange(data);
            this.type = data;
          },
        },
      ],
    });

    await alert.present();
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
            this.filter_cat_array = JSON.parse(
              localStorage.getItem("categoriesCheck")
            );
            this.getAllReccomdations(false, "");
          },
        },
      ],
    });

    await alert.present();
  }

  selectCat(cat) {
    if (this.filter_cat_array.indexOf(cat._id) == -1) {
      this.filter_cat_array.push(cat._id);
    } else {
      this.filter_cat_array.splice(this.filter_cat_array.indexOf(cat._id), 1);
    }

    localStorage.setItem(
      "categoriesCheck",
      JSON.stringify(this.filter_cat_array)
    );

    this.getAllReccomdations(false, "");
  }

  //local feeds
  selectCatForLocalFeed(cat, i) {
    this.allposts = [];
    this.local_posts = [];
    if (this.filter_cat_array_local.indexOf(cat._id) == -1) {
      this.filter_cat_array_local.push(cat._id);
    } else {
      this.filter_cat_array_local.splice(
        this.filter_cat_array_local.indexOf(cat._id),
        1
      );
    }

    this.getAllLocalRecommendations(false, "");
  }

  getAllLocalRecommendations(isFirstLoad, event) {
    this.userId = localStorage.getItem("userId");

    let dict = {
      user_id: localStorage.getItem("userId"),
      skip: this.page_number,
      limit: this.page_limit,
      type: this.profiletab,
      cat: this.cat,
      keyword: this.authSearchForm.value.keyword,
      location: this.authSearchForm.value.location,
      lat: parseFloat(localStorage.getItem("lat")),
      lng: parseFloat(localStorage.getItem("long")),
      selected_cat: this.filter_cat_array_local,
      recc_type: "local",
      category: this.filter_cat_array_local,
    };

    if (this.counter == 0) {
      this.apiService.presentLoading();
    }
    // if(this.counter == 0){
    // this.apiService.presentLoading();
    // }

    var endpoint =
      this.profiletab == "Local" ? "getAllLocalfilterRecc" : "getAllLocalRecc";

    this.apiService.postData(dict, endpoint).subscribe(
      (result) => {
        this.ref.detectChanges();
        // if(this.counter == 0){
        //    this.apiService.stopLoading();
        // }
        if (this.counter == 4) {
          //this.apiService.stopLoading();
        }

        // this.local_posts = result.data;

        this.allposts = result.data;
        this.ref.detectChanges();
        this.is_response = true;

        if (this.authSearchForm.value.keyword == "") {
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

          this.searchLocalRecc(false, "");
        }

        this.ref.detectChanges();

        this.ref.detectChanges();
        this.is_response = true;

        this.apiService.stopLoading();
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

  public handleAddressChange(address) {
    // Do some stuff
    this.authSearchForm.patchValue({
      location: address.formatted_address,
    });

    this.geoCode(address.formatted_address);
  }

  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      localStorage.setItem("lat", this.latitude.toString());
      localStorage.setItem("long", this.longitude.toString());
    });
  }

  searchLocalReccNew(isFirstLoad, event) {
    this.presentLoading();
    var dict = {
      lat:
        this.errors.indexOf(this.authSearchForm.value.location) == -1
          ? parseFloat(localStorage.getItem("lat"))
          : 0,
      lng:
        this.errors.indexOf(this.authSearchForm.value.location) == -1
          ? parseFloat(localStorage.getItem("long"))
          : 0,
      cat: this.cat_id,
      keyword: this.authSearchForm.value.keyword,
      recc_type_for_all: "All",
    };
    this.apiService
      .postData(dict, "getAllLocalfilterRecc")
      .subscribe((result) => {
        this.posts = result.data;
        this.ref.detectChanges();
        this.is_response = true;
        this.stopLoading();

        if (event != "") {
          if (isFirstLoad) event.target.complete();
          this.page_number++;
        }

        // if (this.authSearchForm.value.keyword == "") {
        //   if (result.data.length > 10) {
        //     // this.posts = [];
        //     if (this.count == result.data.length) {
        //       this.is_response = false;
        //       event.target?.complete();
        //     } else {
        //       if (this.local_posts.length == 0) {
        //         this.local_posts = result.data.slice(0, 9);
        //         this.start_count = 9;
        //       } else {
        //         for (let i = this.start_count; i < this.count; i++) {
        //           this.local_posts.push(result.data[i]);
        //           this.start_count = i + 1;
        //         }
        //       }

        //       if (isFirstLoad) event.target.complete();

        //       this.page_number++;
        //     }
        //   } else {
        //     this.local_posts = this.allposts;
        //     this.ref.detectChanges();
        //     // this.is_response = false;
        //     //event.target.complete();
        //   }
        // } else {
        //   var searchText = this.authSearchForm.value.keyword;
        //   this.local_posts = this.allposts.filter((it) => {
        //     return (
        //       it.user_name.toLowerCase().includes(searchText) ||
        //       it.user_name.toUpperCase().includes(searchText) ||
        //       it.user_name.includes(searchText) ||
        //       it.category.toLowerCase().includes(searchText) ||
        //       it.category.toUpperCase().includes(searchText) ||
        //       it.category.includes(searchText) ||
        //       it.title.toLowerCase().includes(searchText) ||
        //       it.title.toUpperCase().includes(searchText) ||
        //       it.title.includes(searchText) ||
        //       (this.errors.indexOf(it.description) == -1
        //         ? it.description.toLowerCase().includes(searchText)
        //         : "") ||
        //       (this.errors.indexOf(it.description) == -1
        //         ? it.description.toUpperCase().includes(searchText)
        //         : "") ||
        //       (this.errors.indexOf(it.description) == -1
        //         ? it.description.includes(searchText)
        //         : "")
        //     );
        //   });
        // }

        this.ref.detectChanges();
      });
  }

  onclear() {
    this.getAllReccomdations(true, "");
  }

  onNewSearch(data: any) {
    this.ref.detectChanges();
    if (data == "") {
      this.ref.detectChanges();
      this.getAllReccomdations(false, "");
      this.apiService.stopLoading();
      this.stopLoading();
    } else {
      this.getAllReccomdations(false, "");
      var dict = {
        keyword: data,
      };
      this.ref.detectChanges();
      this.apiService.postData(dict, "filterSearch").subscribe((res: any) => {
        this.ref.detectChanges();
        this.filterSearchData = res;
        this.ref.detectChanges();
      });
    }
  }

  searchLocalRecc(isFirstLoad, event) {
    if (this.cat_id == undefined) {
      this.cat_id = "All";
    }
    if (this.dict == undefined) {
      this.dict = {
        cat: this.cat_id,
        keyword: this.authSearchForm.controls["keyword"].value,
        lat: 0,
        lng: 0,
        recc_type_for_all: "All",
      };
    } else {
      this.dict.cat = this.cat_id;
      this.dict.keyword = this.authSearchForm.controls["keyword"].value;
    }

    this.apiService
      .postData(this.dict, "getAllLocalfilterRecc")
      .subscribe((result) => {
        this.allposts = result.data;
        localStorage.removeItem("dict");
        this.ref.detectChanges();
        this.is_response = true;

        if (this.authSearchForm.value.keyword == "") {
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

  //global feeds
  selectCatForGlobalFeed(cat, i) {
    this.cat_id = cat._id;
    this.apiService.presentLoading();

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
    this.getAllReccomdations(false, "");
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
