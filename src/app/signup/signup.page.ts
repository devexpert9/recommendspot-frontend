import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ApiserviceService } from "../services/apiservice.service";
import { config } from "../services/config";
import { Router } from "@angular/router";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { FCM } from "@ionic-native/fcm/ngx";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Platform, MenuController } from "@ionic/angular";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { GlobalFooService } from "../services/globalFooService.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  customAlertOptions: any = {
    header: " Profession",

    translucent: true,
  };

  name: any;
  email: any;
  contact: any;
  password: any;
  confirm_password: any;
  is_submit: Boolean = false;
  errors = config.errors;
  reg_exp: any;
  reg_exp_letters: any;
  reg_exp_digits: any;
  fcm_token: any;
  withoutspace: any;
  authForm: FormGroup;

  constructor(
    private ref: ChangeDetectorRef,
    private fcm: FCM,
    public apiService: ApiserviceService,
    public router: Router,
    private globalFooService: GlobalFooService,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private formBuilder: FormBuilder,
    public fireAuth: AngularFireAuth
  ) {
    this.createForm();
    this.reg_exp =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.reg_exp_letters = /^[a-zA-Z].*$/;
    this.reg_exp_digits = /^\d{6,10}$/;
    this.withoutspace = /^\S*$/;
    var self = this;
    setTimeout(() => {
      if (localStorage.getItem("userId") != undefined) {
        self.router.navigate(["/tabs/home"]);
      }
    }, 100);
  }

  ngOnInit() {}

  //define the validators for form fields
  createForm() {
    this.authForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      // contact: ['', Validators.compose([Validators.required])],
      // location: ['', Validators.compose([Validators.required])],
      // bio: ['', Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required])],
      // confirm_password: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidEnter() {
    this.fcm.getToken().then((token) => {
      this.fcm_token = token;
    });
  }

  register() {
    this.is_submit = true;
    if (
      this.errors.indexOf(this.authForm.value.name) >= 0 ||
      !this.reg_exp_letters.test(
        String(this.authForm.value.name)
      ) /*|| this.errors.indexOf(this.authForm.value.contact) >= 0*/ ||
      this.errors.indexOf(this.authForm.value.email) >= 0 ||
      !this.reg_exp.test(String(this.authForm.value.email).toLowerCase()) ||
      this.errors.indexOf(this.authForm.value.password) >= 0 ||
      this.authForm.value.password.length <
        6 /*|| this.errors.indexOf(this.authForm.value.confirm_password) >= 0 || this.authForm.value.confirm_password.length < 6*/ /*|| !this.reg_exp_digits.test(String(this.authForm.value.contact))*/ /*|| this.errors.indexOf(this.authForm.value.location) >= 0 || this.errors.indexOf(this.authForm.value.bio) >= 0*/
    ) {
      return false;
    }

    // if(this.authForm.value.password != this.authForm.value.confirm_password){
    // 	return false;
    // }
    let dict = {
      name: this.authForm.value.name,
      contact: "",
      location: "",
      website: "",
      bio: "",
      email: this.authForm.value.email,
      password: this.authForm.value.password,
      fcm_token: this.fcm_token,
    };
    this.apiService.presentLoading();
    this.apiService.postData(dict, "registerUser").subscribe((result) => {
      this.apiService.stopLoading();
      this.ref.detectChanges();
      if (result.status == 1) {
        localStorage.setItem("userId", result.data._id);
        localStorage.setItem("user_name", result.data.name);
        localStorage.setItem("user_image", result.data.image);
        localStorage.setItem("user_email", result.data.email);
        localStorage.setItem("user_medium", result.data.medium);
        localStorage.setItem("first_login", result.data.first_login);
        this.globalFooService.publishSomeData({
          foo: { data: result.data, page: "profile" },
        });
        this.apiService.presentToast("Register successfully!", "success");
        //this.apiService.navCtrl.navigateRoot('tabs/home');
        if (result.data.first_login == "true") {
          this.apiService.navCtrl.navigateRoot("tabs/home");
        } else {
          this.apiService.navCtrl.navigateRoot("/category");
        }
      } else {
        this.apiService.presentToast(result.error, "danger");
      }
    });
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
        //  		this.apiService.presentToast('Error,Please try after some time', 'danger')
        // }
      })
      .catch((error) => console.error("Sigin error", error));
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
        //  		this.apiService.presentToast('Error,Please try after some time', 'danger')
        // }
      })
      .catch((error) => console.error("Sigin error", error));
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
            //  	medium: 'google',
            //  	social_id: profile['id']
            // }
            // this.apiService.postData(check_user,'check_user_existance').subscribe((result) => {
            //  	console.log(result);
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
          this.apiService.presentToast(result.error, "danger");
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
