import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./services/auth.guard";
var IsLoggedIn = localStorage.getItem("IsLoggedIn");
const routes: Routes = [
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },

  {
    path: "",
    loadChildren: () =>
      IsLoggedIn == "true"
        ? import("./tabs/tabs.module").then((m) => m.TabsPageModule)
        : import("./landing-page/landing-page.module").then(
            (m) => m.LandingPagePageModule
          ),
    canActivate: [AuthGuard],
  },

  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "posts",
    loadChildren: () =>
      import("./post/post.module").then((m) => m.PostPageModule),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfilePageModule),
  },
  {
    path: "notification",
    loadChildren: () =>
      import("./notification/notification.module").then(
        (m) => m.NotificationPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./signup/signup.module").then((m) => m.SignupPageModule),
  },
  {
    path: "forgotpassword",
    loadChildren: () =>
      import("./forgotpassword/forgotpassword.module").then(
        (m) => m.ForgotpasswordPageModule
      ),
  },
  {
    path: "profile-setting/:id",
    loadChildren: () =>
      import("./profile-setting/profile-setting.module").then(
        (m) => m.ProfileSettingPageModule
      ),
  },
  {
    path: "following",
    loadChildren: () =>
      import("./following/following.module").then((m) => m.FollowingPageModule),
  },
  {
    path: "add-recommendation",
    loadChildren: () =>
      import("./add-recommendation/add-recommendation.module").then(
        (m) => m.AddRecommendationPageModule
      ),
  },
  {
    path: "post-details",
    loadChildren: () =>
      import("./post-details/post-details.module").then(
        (m) => m.PostDetailsPageModule
      ),
  },

  {
    path: "user-profile",
    loadChildren: () =>
      import("./user-profile/user-profile.module").then(
        (m) => m.UserProfilePageModule
      ),
  },
  {
    path: "edit-reccomendation",
    loadChildren: () =>
      import("./edit-reccomendation/edit-reccomendation.module").then(
        (m) => m.EditReccomendationPageModule
      ),
  },
  {
    path: "followingfollowers",
    loadChildren: () =>
      import("./followingfollowers/followingfollowers.module").then(
        (m) => m.FollowingfollowersPageModule
      ),
  },
  {
    path: "landing-page",
    loadChildren: () =>
      import("./landing-page/landing-page.module").then(
        (m) => m.LandingPagePageModule
      ),
  },
  {
    path: "comments",
    loadChildren: () =>
      import("./comments/comments.module").then((m) => m.CommentsPageModule),
  },
  {
    path: "category",
    loadChildren: () =>
      import("./category/category.module").then((m) => m.CategoryPageModule),
  },
  {
    path: "local",
    loadChildren: () =>
      import("./local/local.module").then((m) => m.LocalPageModule),
  },
  {
    path: "addlocalrecommendation",
    loadChildren: () =>
      import("./addlocalrecommendation/addlocalrecommendation.module").then(
        (m) => m.AddlocalrecommendationPageModule
      ),
  },
  {
    path: "add-recommend",
    loadChildren: () =>
      import("./add-recommend/add-recommend.module").then(
        (m) => m.AddRecommendPageModule
      ),
  },
  {
    path: "localrecommenddetail",
    loadChildren: () =>
      import("./localrecommenddetail/localrecommenddetail.module").then(
        (m) => m.LocalrecommenddetailPageModule
      ),
  },
  {
    path: "saved-posts",
    loadChildren: () =>
      import("./saved-posts/saved-posts.module").then(
        (m) => m.SavedPostsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "add-all-recommendation",
    loadChildren: () =>
      import("./add-all-recommendation/add-all-recommendation.module").then(
        (m) => m.AddAllRecommendationModule
      ),
  },
  {
    path: "feedback",
    loadChildren: () =>
      import("./feedback/feedback.module").then((m) => m.FeedbackModule),
  },
  {
    path: "see-friends-recomendations",
    loadChildren: () =>
      import(
        "./see-friend-recomendations/see-friend-recomendations.module"
      ).then((m) => m.SeeFriendRecomendationsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "sidebarnew",
    loadChildren: () =>
      import("./sidebarnew/sidebarnew.module").then(
        (m) => m.SidebarnewPageModule
      ),
  },
  {
    path: "headerall",
    loadChildren: () =>
      import("./headerall/headerall.module").then((m) => m.HeaderallPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
