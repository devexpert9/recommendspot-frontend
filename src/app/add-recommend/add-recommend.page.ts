import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { ApiserviceService } from "../services/apiservice.service";
import { GlobalFooService } from "../services/globalFooService.service";
import { config } from "../services/config";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import {
  ModalController,
  ToastController,
  LoadingController,
  ActionSheetController,
  AlertController,
  NavController,
  IonContent,
} from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
declare var google: any;
@Component({
  selector: "app-add-recommend",
  templateUrl: "./add-recommend.page.html",
  styleUrls: ["./add-recommend.page.scss"],
})
export class AddRecommendPage implements OnInit {
  authForm: FormGroup;
  user_name: any;
  user_image: any;

  user_email: any;
  user_id: any;
  IMAGES_URL: any = config.IMAGES_URL;
  errors: any = config.errors;
  web_link: any = "";
  is_live_image_updated = false;
  live_image_url: any = "";
  noti_count = localStorage.getItem("notiCount");
  latitude: any = 0;
  longitude: any = 0;
  link_content: any;
  opencontent: any;
  is_submit = false;
  player: any;
  is_submit_platform = false;
  image_error: any = false;
  image_file: any;
  image_url: any;
  is_image_uploaded: any;
  typeTab = "Photo";
  loading: any;
  platforms: any;
  imgBlob: any;
  live_file_name: any;
  counter = 1;
  image: any = "";
  @ViewChild(IonContent, { static: true }) content: IonContent;
  plat_value = "Others";
  plat_selected_value = "";
  selected_cat: any = "";
  is_linkdata = false;
  categories: any;
  subcategories: any = [];
  allowedMimes: any = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/svg",
  ];
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  expression: any;
  filledData: any;
  isFillAddReccStatus: string;
  customAlertOptions: any = {
    cssClass: "SelectCat",
  };
  constructor(
    private ref: ChangeDetectorRef,
    public apiService: ApiserviceService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public sanitizer: DomSanitizer,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder
  ) {
    this.isFillAddReccStatus = localStorage.getItem("isFillAddReccStatus");

    if (this.isFillAddReccStatus) {
      var filledData = JSON.parse(localStorage.getItem("FilledAddRecc"));
      this.filledData = filledData;
      this.checklink(this.filledData.web_link);
      console.log(this.filledData);
    }
    this.createForm();

    this.expression =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    this.user_name = localStorage.getItem("user_name");
    this.user_image = localStorage.getItem("user_image");
    this.user_email = localStorage.getItem("user_email");
    this.user_id = localStorage.getItem("userId");
    this.globalFooService.getObservable().subscribe((data) => {
      this.user_name = localStorage.getItem("user_name");
      this.user_image = localStorage.getItem("user_image");
      this.user_email = localStorage.getItem("user_email");
      this.user_id = localStorage.getItem("userId");
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
      this.authForm.controls["category"].setValue(
        this.isFillAddReccStatus ? this.filledData.category : ""
      );
      this.ref.detectChanges();
      this.authForm.controls["tags"].setValue(
        this.isFillAddReccStatus ? this.filledData.tags : ""
      );
    }, 1000);
    this.ref.detectChanges();
  }

  ionViewDidEnter() {
    this.noti_count = localStorage.getItem("notiCount");
  }

  // getimage(img) {
  //   if (this.errors.indexOf(img) == -1) {
  //     if (img.includes("https") == true) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

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
  public handleAddressChange(address) {
    // Do some stuff
    this.authForm.patchValue({
      location: address.formatted_address,
    });

    this.geoCode(address.formatted_address);
  }

  stopPlayer() {
    if (this.player === undefined || !this.player || null) {
    } else {
      // this.player.stopVideo();
      this.player.destroy();
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

  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
    });
  }

  //define the validators for form fields
  createForm() {
    this.authForm = this.formBuilder.group({
      title: [
        this.isFillAddReccStatus ? this.filledData.title : "",
        Validators.compose([Validators.required]),
      ],
      recc_contact: [
        this.isFillAddReccStatus ? this.filledData.recc_contact : "",
      ],
      description: [
        this.isFillAddReccStatus ? this.filledData.description : "",
        Validators.compose([Validators.required]),
      ],
      category: ["", Validators.compose([Validators.required])],
      location: [this.isFillAddReccStatus ? this.filledData.location : ""],
      platform: [this.isFillAddReccStatus ? this.filledData.platform : ""],
      tags: [[this.isFillAddReccStatus ? this.filledData.tags : ""]],
      platform_name: [
        this.isFillAddReccStatus ? this.filledData.platform_name : "",
      ],
      web_link: [this.isFillAddReccStatus ? this.filledData.web_link : ""],
    });
    this.opencontent = false;

    this.link_content = "";
    this.getCategories();
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

  getSubCategory(event) {
    this.subcategories = [];
    this.authForm.patchValue({
      subcategory: "",
    });
    this.counter = 2;
    this.selected_cat =
      this.categories[
        this.categories.findIndex((x) => x._id == event.detail.value)
      ]?.name;

    if (
      this.categories[
        this.categories.findIndex((x) => x._id == event.detail.value)
      ].name === "Movies" ||
      this.categories[
        this.categories.findIndex((x) => x._id == event.detail.value)
      ].name === "Shows/Series"
    ) {
      this.authForm.controls["platform"].setValidators([Validators.required]);
    } else {
      this.authForm.controls["platform"].clearValidators();
    }
    this.authForm.controls["platform"].updateValueAndValidity();
    this.getSubCategories(this.authForm.value.category);
  }

  getSubCategories(cat_id) {
    this.presentLoading();
    var dict = {
      cat_id: cat_id,
    };
    this.apiService.postData(dict, "subCategoryListingAdmin").subscribe(
      (result) => {
        this.ref.detectChanges();
        this.stopLoading();
        if (result.status == 1) {
          this.subcategories = result.data;
          this.ref.detectChanges();

          if (result.data.length > 0) {
            this.authForm.controls["subcategory"].setValidators([
              Validators.required,
            ]);
          } else {
            this.authForm.controls["subcategory"].clearValidators();
          }
          this.authForm.controls["subcategory"].updateValueAndValidity();
        } else {
          //this.apiService.presentToast('Error while sending request,Please try after some time','success');
        }
        // this.stopLoading();
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "danger"
        );
        this.stopLoading();
      }
    );
  }

  add_local_recc() {
    this.is_submit = true;
    if (
      this.errors.indexOf(this.authForm.value.title) >= 0 ||
      this.errors.indexOf(this.authForm.value.description) >= 0 ||
      this.errors.indexOf(this.authForm.value.category) >= 0
    ) {
      return false;
    }

    if (this.errors.indexOf(this.image_file) == -1) {
      this.apiService.presentLoading();

      this.uploadImage();
    } else {
      this.apiService.presentLoading();
      if (this.isFillAddReccStatus) {
        if (this.errors.indexOf(localStorage.getItem("previousImage")) == -1)
          this.image = this.filledData.image;
        this.ref.detectChanges();
        // this.profileImageSubmit();
      }
      this.profileImageSubmit();
    }
  }

  onKeydown(event) {
    if (event.keyCode === 32) {
      return false;
    }
  }

  getCategories() {
    this.apiService.presentLoading();
    var dict = {
      user_id: localStorage.getItem("userId"),
    };

    this.apiService.postData(dict, "onlycategories").subscribe(
      (result) => {
        this.apiService.stopLoading();
        this.ref.detectChanges();
        if (result.status == 1) {
          this.categories = result.data;
          //this.category = this.categories[0]._id;
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
          "danger"
        );
        this.apiService.stopLoading();
      }
    );
  }

  uploadImage() {
    const frmData = new FormData();
    // frmData.append('file', this.imgBlob, this.live_file_name);
    frmData.append("file", this.image_file, this.image_file.name);
    this.apiService.postData(frmData, "uploadReccImage").subscribe(
      (result) => {
        this.image = result;
        this.ref.detectChanges();
        this.profileImageSubmit();
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "danger"
        );
      }
    );
  }

  profileImageSubmit() {
    this.apiService.presentLoading();
    var dict = {
      //   	title: this.authForm.value.title,
      //   	// type: this.authForm.value.type,
      //   	type: this.typeTab,
      //   	description: this.authForm.value.description,
      //   	category: this.authForm.value.category,
      //   	location: this.authForm.value.location,
      //   	lat: this.latitude,
      //   	long: this.longitude,
      //   	image: this.image,
      //   	user_id: localStorage.getItem('userId'),
      // add_user_type: 'user',

      title: "I Recommend " + this.authForm.value.title,
      type: this.typeTab,
      description: this.authForm.value.description,
      category: this.authForm.value.category,
      platform: "",
      sub_category: "",
      web_link: this.authForm.value.web_link,
      image: this.image,
      user_id: localStorage.getItem("userId"),
      add_user_type: "user",
      web_link_content: this.link_content,
      tags: this.authForm.value.tags,
      location: this.authForm.value.location,
      recc_contact: this.authForm.value.recc_contact,
      lat: this.latitude,
      long: this.longitude,
      cords: {
        type: "Point",
        coordinates: [this.longitude, this.latitude],
      },
      // recc_type: "local",
    };
    var isLogin = localStorage.getItem("IsLoggedIn");
    if (isLogin) {
      this.apiService.postData(dict, "addRecc").subscribe(
        (result) => {
          if (result.status == 1) {
            this.authForm.value.description = "";
            this.is_submit = false;
            this.live_image_url = "";
            this.imgBlob = "";
            this.live_file_name = "";
            this.authForm.reset();
            // this.authForm.value.type = 'Photo';
            // this.authForm.value.category = '';
            // this.authForm.value.web_link = '';
            this.link_content = "";
            this.is_live_image_updated = false;
            this.image = "";
            this.apiService.presentToast(result.msg, "success");
            this.apiService.stopLoading();
            this.ref.detectChanges();
            this.globalFooService.publishSomeData({
              foo: { data: "", page: "updateprofile" },
            });
            window.location.reload();
            this.image_url = "";
            this.router.navigate(["/tabs/home"]);
            localStorage.removeItem("FilledAddRecc");
            localStorage.removeItem("previousImage");
            localStorage.removeItem("isFillAddReccStatus");
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
            "danger"
          );
          this.apiService.stopLoading();
        }
      );
    } else {
      this.apiService.stopLoading();
      setTimeout(() => {
        this.apiService.presentToast("Please Login", "danger");
      }, 800);
    }
  }

  uploadImages(event) {
    this.image_error = false;
    var self = this;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      var image_file = event.target.files[0];
      if (self.allowedMimes.indexOf(image_file.type) == -1) {
        this.image_error = true;
      } else {
        self.image_file = image_file;
        self.image_url = window.URL.createObjectURL(image_file);
        self.is_image_uploaded = true;
      }
    }
  }

  checklink(link) {
    var self = this;
    // var target = link;
    // $.ajax({
    // url: "https://api.linkpreview.net",
    // dataType: 'jsonp',
    // data: {q: target, key: 'c23b499c88994dfa1fad242d8e141ee3'},
    // success: function (response) {
    // console.log(response);
    // self.opencontent = true;
    // self.link_content = response;

    // }
    // });

    var dict = {
      url: link,
    };
    this.is_linkdata = false;
    this.presentLoading();
    this.apiService.postData(dict, "scrapUrl").subscribe(
      (result) => {
        this.ref.detectChanges();
        this.stopLoading();
        if (result.data != null) {
          this.opencontent = true;
          this.link_content = result;
          this.is_linkdata = true;
        }

        // this.stopLoading();
      },
      (err) => {
        this.apiService.presentToast(
          "Technical error,Please try after some time",
          "danger"
        );
        this.stopLoading();
      }
    );
  }

  closeLinkContent() {
    this.opencontent = false;
  }

  async presentLoading() {
    if (this.errors.indexOf(this.loading) >= 0) {
      this.loading = await this.loadingController.create({
        spinner: "bubbles",
        cssClass: "my-loading-class",
      });
    }
    this.ref.detectChanges();
    await this.loading.present();
  }

  async stopLoading() {
    if (this.errors.indexOf(this.loading) == -1) {
      this.ref.detectChanges();
      await this.loading.dismiss();
      this.loading = null;
    } else {
      var self = this;
      setTimeout(function () {
        self.stopLoading();
      }, 1000);
    }
  }
}
