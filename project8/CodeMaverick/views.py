import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.utils.crypto import get_random_string
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from datetime import datetime
from .models import *

def home(request):
    return render(request, "CodeMaverick/index.html")

def load_profile(request):
    return render(request, "CodeMaverick/profile.html")

def teams(request):
    return render(request, "CodeMaverick/teams.html")

def load_teams(request):
    try:
        my_teams = Team.objects.filter(members = request.user)
        teams = Team.objects.exclude(members = request.user).order_by("rank").all()
        return JsonResponse({"my_teams":[my_team.team_info() for my_team in my_teams], "teams":[team.team_info() for team in teams]}, safe = False, status = 201)
    except:
        return JsonResponse({"error":"Something went wrong! Cannot load teams!"}, status = 200)

def create_new_team(request):
    data = json.loads(request.body)
    new_team_name = data.get("data")
    try:
        if not new_team_name.isalnum() or 3 > len(new_team_name) > 24:
            raise ValueError
        temp_team = Team.objects.filter(name = new_team_name)
        if temp_team:
            raise IntegrityError
        new_team_id = get_random_string(length=12)
        while(True):
            temp_team = Team.objects.filter(id = new_team_id)
            if not temp_team:
                break
            new_team_id = get_random_string(length=12)
        new_rank = len(Team.objects.all())
        new_team = Team.objects.create(id = new_team_id, name = new_team_name, admin = request.user, rank = new_rank)
        new_team.members.add(request.user)
        new_team.save()
        return JsonResponse({"success": "Team created succesfully!"})
    except IntegrityError:
        return JsonResponse({"error":"Team name not available!"})
    except ValueError:
        return JsonResponse({"error":"Team name cannot have characters other than a-z, A-Z, 0-9, _; length must be greter than 3 and less than/equal 24"})
    except:
        return JsonResponse({"error":"Something went wrong!"})

def apply_team(request, team_id):
    data = request.json.loads("body")
    message = data["message"]
    notif_id = len(Notification.objects.all)
    notif = Notification(id = notif_id, sender = request.user, receiver =  Team.objects.get(team_id = team_id).admin.username, message = message)
    notif.save()
    
@csrf_exempt
def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("home"))
        else:
            return render(request, "CodeMaverick/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "CodeMaverick/login.html")

# def login_API_google():



def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("home"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        name = request.POST["name"]
        email = request.POST["email"]
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "CodeMaverick/register.html", {
                "message": "Passwords must match."
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            user.name = name
            user.save()
        except IntegrityError:
            return render(request, "CodeMaverick/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("home"))
    else:
        return render(request, "CodeMaverick/register.html")
    