import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
  ChangeDetectorRef,
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

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
declare var window: any;
declare var google: any;
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
// import { AddRecommendService } from '../services/addrecommend.service';
import { ImagepopupPage } from "../imagepopup/imagepopup.page";
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  @ViewChild("widgetsContent", { read: ElementRef })
  public widgetsContent: ElementRef<any>;
  authForm: FormGroup;
  authSearchForm: FormGroup;
  selectedItem: any = "item1";
  profiletab = "Global";
  // options: {
  //   types: ["(cities)"];
  // };
  profiletab1local = "Today";
  profiletab1: string = "Today";
  userSettings = {
    inputPlaceholderText: "Location",
    geoTypes: ["(regions)", "(cities)"],
  };
  isAndroid: boolean = false;
  keyword = "";
  posts: any = [];
  public userSettings3: any = {
    showCurrentLocation: true,
    resOnSearchButtonClickOnly: true,
    inputPlaceholderText: "Type anything and you will get a location",
    recentStorageName: "componentData3",
  };

  local_posts: any = [];
  allposts: any = [];
  is_response = false;
  IMAGES_URL: any = config.IMAGES_URL;
  errors = config.errors;
  page_number = 1;
  page_limit = 10;
  keyword1 = "name";
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
  local_count = 10;
  start_count = 0;
  loading: any;
  latitude: any;
  longitude: any;
  category_type: any = "1";

  showInput: boolean = false;
  cat_id: any = "All";
  filterSearchData: any;
  clickEvent() {
    this.showInput = !this.showInput;
  }

  hideMe2 = false;
  hide2() {
    this.hideMe2 = !this.hideMe2;
  }

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
  constructor(
    public sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    public apiService: ApiserviceService,
    public router: Router,
    private cd: ChangeDetectorRef,
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

    this.globalFooService.getObservable().subscribe((data) => {
      self.menuCtrl.enable(true);
      self.profiletab = "Local";
      self.counter = 1;
      self.page_number = 1;
      self.is_response = false;
      self.posts = [];
      self.getAllReccomdations(false, "");
      this.getCategoriesLatest();
      // this.searchLocalRecc(false, '');
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

  async openImagePopup(image) {
    //this.photoViewer.show(image);
    const modal = await this.modalController.create({
      component: ImagepopupPage,
      componentProps: { value: image },
      cssClass: "imgMod",
    });
    return await modal.present();
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
    // this.router.navigate(['/category'], { replaceUrl: true });
    this.router.navigate(["/category"]);
  }

  gotofollowing() {
    var user_id = localStorage.getItem("userId");
    localStorage.setItem("clickUserId", user_id);
  }

  ngOnInit() {}

  ionViewWillEnter() {
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
    this.getAllReccomdations(true, "");

    //this.searchLocalRecc(false, "");
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
    //this.getAllReccomdations(false, "");
    this.searchLocalRecc(false, "");
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
    localStorage.setItem("item", JSON.stringify(post));
    localStorage.setItem("postId", post._id);
    this.iab.create(link, "_system", {
      location: "yes",
      closebuttoncaption: "done",
    });
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
      //this.searchLocalRecc(false, "");
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
    this.noti_count = localStorage.getItem("notiCount");

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

    this.menuCtrl.enable(true);
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

  // onSearchChange(evt: any) {
  //   const searchText = evt.srcElement.value;
  //   // if (!searchText){
  //   //  return ;
  //   // }
  //   this.posts = this.allposts.filter((it) => {
  //     return (
  //       it.user_name.toLowerCase().includes(searchText) ||
  //       it.user_name.toUpperCase().includes(searchText) ||
  //       it.user_name.includes(searchText) ||
  //       it.category.toLowerCase().includes(searchText) ||
  //       it.category.toUpperCase().includes(searchText) ||
  //       it.category.includes(searchText) ||
  //       it.sub_category.toLowerCase().includes(searchText) ||
  //       it.sub_category.toUpperCase().includes(searchText) ||
  //       it.sub_category.includes(searchText) ||
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
    this.play_video = false;
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
    // this.getAllReccomdations(false, '');
    this.getAllLocalRecommendations(false, "");
  }

  updateInfo(data) {
    this.user_name = localStorage.getItem("user_name");
    this.user_image = localStorage.getItem("user_image");
    this.user_email = localStorage.getItem("user_email");
    this.user_id = localStorage.getItem("userId");
  }

  getAllReccomdations(isFirstLoad, event) {
    this.apiService.stopLoading();
    this.userId = localStorage.getItem("userId");
    // this.posts = [];
    // this.allposts = [];
    let dict = {
      user_id: localStorage.getItem("userId"),
      skip: this.page_number,
      limit: "",
      // type: this.profiletab,
      type: this.profiletab1,
      cat: this.cat,
      keyword: this.authForm.value.keyword,
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
        this.apiService.stopLoading();
        this.stopLoading();
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
              event.target?.complete();
            } else {
              if (this.posts.length == 0) {
                this.posts = result.data.slice(0, 9);
                this.start_count = 9;
              } else {
                for (let i = this.start_count; i < this.count; i++) {
                  this.posts.push(result.data[i]);
                  this.start_count = i + 1;
                }
              }
              if (isFirstLoad) event?.target?.complete();
              this.page_number++;
            }
          } else {
            this.posts = this.allposts;
            this.ref.detectChanges();
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
        this.ref.detectChanges();

        // if(this.counter == 0){
        //      this.apiService.stopLoading();
        //   }
        this.apiService.stopLoading();
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
    this.stopLoading();
    this.apiService.stopLoading();
  }

  onclear() {
    this.getAllReccomdations(true, "");
  }

  getAllReccomdationsAll(isFirstLoad, event) {
    this.userId = localStorage.getItem("userId");
    // this.posts = [];
    // this.allposts = [];
    let dict = {
      user_id: localStorage.getItem("userId"),
      skip: this.page_number,
      limit: "",
      // type: this.profiletab,
      type: this.profiletab1,
      cat: this.cat,
      keyword: this.authSearchForm.value.keyword,
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
              if (this.posts.length == 0) {
                this.posts = result.data.slice(0, 9);
                this.start_count = 9;
              } else {
                for (let i = this.start_count; i < this.count; i++) {
                  this.posts.push(result.data[i]);
                  this.start_count = i + 1;
                }
              }
              if (isFirstLoad) event?.target?.complete();
              this.page_number++;
            }
          } else {
            this.posts = this.allposts;

            this.ref.detectChanges();
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
        this.ref.detectChanges();

        // if(this.counter == 0){
        //      this.apiService.stopLoading();
        //   }
        this.apiService.stopLoading();
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
    this.stopLoading();
    this.apiService.stopLoading();
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

  doInfiniteloc(event) {
    this.counter = 1;
    if (this.allposts.length - this.posts.length < 10) {
      this.count = this.count + (this.allposts.length - this.posts.length);
    } else {
      this.count = this.count + 10;
    }

    this.searchLocalRecc(true, event);
  }

  doInfiniteLocal(event) {
    this.counter = 1;
    if (this.allposts.length - this.local_posts.length < 10) {
      var countlength = this.allposts.length - this.local_posts.length;
      this.local_count = this.local_count + countlength;
      // if(this.local_count > this.allposts.length){
      //   this.local_count = this.local_count -1 ;
      // }
    } else {
      this.local_count = this.local_count + 10;
      // this.local_count = this.local_count + (this.allposts.length - this.local_posts.length);
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
        this.posts[index].fav = type;
      }

      if (this.profiletab == "Saved") {
        if (str == "local") {
          this.local_posts.splice(index, 1);
        } else {
          this.posts.splice(index, 1);
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
              this.posts[index].likes.push(result.data);
            }
            for (var i = 0; i < dislikesArray.length; i++) {
              if (dislikesArray[i].userId == this.userId) {
                if (str == "local") {
                  this.local_posts[index].dislikes.splice(i, 1);
                } else {
                  this.posts[index].dislikes.splice(i, 1);
                }
              }
            }
          } else {
            for (var i = 0; i < likesArray.length; i++) {
              if (likesArray[i].userId == this.userId) {
                if (str == "local") {
                  this.local_posts[index].likes.splice(i, 1);
                } else {
                  this.posts[index].likes.splice(i, 1);
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
    this.apiService.stopLoading();
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
        // this.getAllReccomdations(false, "");
        this.searchLocalRecc(false, "");
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
            //this.getAllReccomdations(false, "");
            this.searchLocalRecc(false, "");
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
    //this.getAllReccomdations(false, "");
    this.searchLocalRecc(false, "");
  }

  //local feeds
  selectCatForLocalFeed(cat, i) {
    this.allposts = [];
    this.local_posts = [];

    if (i == "Today") {
      this.profiletab1local = i;
      this.filter_cat_array_local = [];
    } else {
      this.profiletab1local = "";
      this.filter_cat_array_local = [];
      this.cat_id = cat._id;
      if (this.filter_cat_array_local.indexOf(cat._id) == -1) {
        this.filter_cat_array_local.push(cat._id);
      } else {
        this.filter_cat_array_local.splice(
          this.filter_cat_array_local.indexOf(cat._id),
          1
        );
      }
    }

    this.getAllLocalRecommendations(false, "");
  }

  getAllLocalRecommendations(isFirstLoad, event) {
    this.userId = localStorage.getItem("userId");
    let dict = {
      user_id: localStorage.getItem("userId"),
      skip: this.page_number,
      limit: "",
      type: this.profiletab,
      cat: this.cat_id,
      keyword: this.authSearchForm.value.keyword,
      location: this.authSearchForm.value.location,
      lat:
        this.errors.indexOf(this.authSearchForm.value.location) == -1
          ? parseFloat(localStorage.getItem("lat"))
          : 0,
      lng:
        this.errors.indexOf(this.authSearchForm.value.location) == -1
          ? parseFloat(localStorage.getItem("long"))
          : 0,
      selected_cat: this.filter_cat_array_local,
      recc_type: "local",
      recc_type_for_all: this.profiletab1local == "Today" ? "All" : "",
    };

    if (this.counter == 0) {
      this.apiService.presentLoading();
    }
    // if(this.counter == 0){
    // this.apiService.presentLoading();
    // }
    var endpoint =
      this.profiletab == "Local" ? "getAllLocalfilterRecc" : "getAllLocalRecc";
    // this.apiService.postData(dict,'getAllLocalRecc').subscribe((result) => {
    this.apiService.postData(dict, "getAllLocalfilterRecc").subscribe(
      (result) => {
        this.ref.detectChanges();
        // if(this.counter == 0){
        //    this.apiService.stopLoading();
        // }
        if (this.counter == 4) {
          //this.apiService.stopLoading();
        }

        // this.local_posts = result.data;

        this.local_posts = result.data;
        // this.allposts = result.data;
        // this.ref.detectChanges();
        // this.is_response = true;
        // console.log('result = ', result);
        // console.log('local_count = ', this.local_count);
        // console.log(this.local_posts);

        // if(this.authSearchForm.value.keyword == ''){

        //   if(result.data.length > 10){
        //     // this.posts = [];
        //     if(this.local_count == result.data.length){
        //       this.is_response = false;
        //       event.target.complete();
        //     }else{
        //       if(this.local_posts.length == 0){
        //         this.local_posts = result.data.slice(0, 10);
        //         this.start_count = 9;
        //       }else{
        //         for (let i = this.start_count; i < this.local_count; i++) {
        //           this.local_posts.push(result.data[i]);
        //           this.start_count = i + 1;
        //         }
        //       }

        //       if (isFirstLoad)
        //         event.target.complete();

        //       this.page_number++;
        //     }
        //   }else{
        //     this.local_posts = this.allposts;
        //     this.ref.detectChanges();
        //     // this.is_response = false;
        //     //event.target.complete();
        //   }
        //   console.log('local_posts = ', this.local_posts)
        // }else{
        //   var searchText = this.authSearchForm.value.keyword;
        //   this.local_posts = this.allposts.filter(it => {
        //     return (it.user_name.toLowerCase().includes(searchText) || it.user_name.toUpperCase().includes(searchText) || it.user_name.includes(searchText) || it.category.toLowerCase().includes(searchText)    ||it.category.toUpperCase().includes(searchText)    ||it.category.includes(searchText)|| it.title.toLowerCase().includes(searchText)  || it.title.toUpperCase().includes(searchText)  || it.title.includes(searchText) || (this.errors.indexOf(it.description) == -1 ? it.description.toLowerCase().includes(searchText): '') || (this.errors.indexOf(it.description) == -1 ? it.description.toUpperCase().includes(searchText): '') || (this.errors.indexOf(it.description) == -1 ? it.description.includes(searchText): '') );
        //   });

        //   this.searchLocalRecc(false, '');
        // }
        this.ref.detectChanges();
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

  // selectEvent(data: any) {
  //   console.log(data);
  // }
  public handleAddressChange(address) {
    console.log(address);
    if (!address.response) {
      this.getAllReccomdations(false, "");
    } else {
      localStorage.removeItem("lat");
      localStorage.removeItem("long");
      this.cat_id = "All";
      this.authSearchForm.patchValue({
        location: address?.data?.formatted_address,
      });
      this.geoCode(address?.data?.formatted_address);
    }
  }

  onNewSearch(data: any) {
    this.apiService.stopLoading();
    this.stopLoading();
    this.cd.detectChanges();
    if (data == "") {
      this.cd.detectChanges();
      this.getAllReccomdations(false, "");
      this.apiService.stopLoading();
      this.stopLoading();
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

  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (results == null) {
        this.searchLocalRecc(false, "");
      } else {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();

        localStorage.setItem("lat", this.latitude.toString());
        localStorage.setItem("long", this.longitude.toString());
        this.searchLocalRecc(false, "");
      }
    });
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

  // onSelect(event: any) {
  //   console.log(event);
  // }

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

  searchLocalRecc(isFirstLoad, event) {
    this.presentLoading();
    if (this.cat_id == undefined) {
      this.cat_id = "All";
    }
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
      recc_type_for_all: this.profiletab1local == "Today" ? "All" : "",
    };
    this.apiService
      .postData(dict, "getAllLocalfilterRecc")
      .subscribe((result) => {
        this.allposts = result.data;
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
    this.allposts = [];
    this.posts = [];
    this.ref.detectChanges();
    if (i == "Today" || i == "Basic") {
      this.profiletab1 = i;
      this.filter_cat_array_global = [];
    } else {
      this.profiletab1 = "";
      this.filter_cat_array_global = [];
      if (this.filter_cat_array_global.indexOf(cat._id) == -1) {
        this.filter_cat_array_global.push(cat._id);
      } else {
        this.filter_cat_array_global.splice(
          this.filter_cat_array_global.indexOf(cat._id),
          1
        );
      }
    }
    this.apiService.stopLoading();
    //this.getAllReccomdations(false, "");
    this.searchLocalRecc(false, "");
  }

  selectCatForGlobalFeedAll(cat, i) {
    this.apiService.stopLoading();
    this.allposts = [];
    this.posts = [];
    this.ref.detectChanges();
    if (i == "Today" || i == "Basic") {
      this.profiletab1 = i;
      this.filter_cat_array_global = [];
    } else {
      this.profiletab1 = "";
      this.filter_cat_array_global = [];
      if (this.filter_cat_array_global.indexOf(cat._id) == -1) {
        this.filter_cat_array_global.push(cat._id);
      } else {
        this.filter_cat_array_global.splice(
          this.filter_cat_array_global.indexOf(cat._id),
          1
        );
      }
    }

    this.getAllReccomdationsAll(false, "");
  }
}
