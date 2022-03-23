import { ApiserviceService } from "./../services/apiservice.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { config } from "../services/config";
import { GlobalFooService } from "../services/globalFooService.service";
import { Router } from "@angular/router";
import { IonContent, LoadingController } from "@ionic/angular";
@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"],
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  submitted = false;
  user_image: any;
  noti_count = localStorage.getItem("notiCount");
  user_name: any;
  user_email: any;
  user_id: any;
  expression: any;
  loading: any;
  isEmailValidate: boolean = false;
  errors: any = config.errors;
  IMAGES_URL: any = config.IMAGES_URL;
  IsLoggedIn: any;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  constructor(
    private formBuilder: FormBuilder,
    private globalFooService: GlobalFooService,
    private router: Router,
    public loadingController: LoadingController,
    private apiService: ApiserviceService
  ) {
    this.IsLoggedIn = localStorage.getItem("IsLoggedIn");
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

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required]],
    });
    this.isEmailValidate = false;
  }

  ionViewWillEnter() {
    this.noti_count = localStorage.getItem("notiCount");
    this.isEmailValidate = false;
    this.IsLoggedIn = localStorage.getItem("IsLoggedIn");
    this.feedbackForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required]],
    });
    this.submitted = false;
  }

  get f() {
    return this.feedbackForm.controls;
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

  onSubmit() {
    this.submitted = true;
    if (this.feedbackForm.invalid) {
      return;
    }
    this.presentLoading();
    this.apiService
      .postData(this.feedbackForm.value, "addFeedback")
      .subscribe((res: any) => {
        if (res.status == 1) {
          this.apiService.presentToast(res.msg, "success");
          var isLogin = localStorage.getItem("IsLoggedIn");
          if (isLogin) {
            this.router.navigateByUrl("/tabs/home");
          } else {
            this.router.navigateByUrl("/landing-page");
          }
          this.stopLoading();
        } else {
          this.apiService.presentToast(res.msg, "danger");
          this.stopLoading();
        }
      });
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

  validateEmail(email: any) {
    const enterEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.isEmailValidate = enterEmail.test(String(email).toLowerCase());
  }

  async presentLoading() {
    if (this.errors.indexOf(this.loading) >= 0) {
      this.loading = await this.loadingController.create({
        spinner: "bubbles",
        cssClass: "my-loading-class",
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
}
