from django.urls import path
from django.contrib.auth.views import LoginView

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("login", views.login_view, name="login"),
    # path("login", views.login_API_google, name = "login_API_google"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("teams", views.teams, name="teams"),
    path("new_team", views.create_new_team, name="new_team"),
    path("load_teams/", views.load_teams, name="load_teams"),
    path("load_team_room/<str:team_id>", views.load_team_room, name="load_team_room"),
    path("delete_team/<str:team_id>", views.delete_team, name="delete_team"),
    path("team_apply/<str:team_id>", views.apply_team, name="team_apply"),
    path("profile", views.load_profile, name="profile"),
    # path("profile/<int:get_user_id>/<str:option>", views.load_profile, name=" load_profile"),
]
