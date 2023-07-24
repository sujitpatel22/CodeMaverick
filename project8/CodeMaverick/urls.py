from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("login", views.login_view, name="login"),
    # path("login", views.login_API_google, name = "login_API_google"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("teams", views.teams, name="teams"),
    path("profile", views.load_profile, name="load_profile"),
    # path("teams/<int:post_id>/<str:option>", views.update_post, name="post"),
    # path("profile/<int:get_user_id>/<str:option>", views.load_profile, name=" load_profile"),
]
