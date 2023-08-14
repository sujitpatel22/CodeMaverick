import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.crypto import get_random_string
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

@csrf_exempt
@login_required
def load_teams(request):
    my_teams = Team.objects.filter(members__id = request.user.id).order_by("rank")
    teams = Team.objects.exclude(members__id = request.user.id).order_by("rank")
    return JsonResponse({"my_teams": [team.team_info() for team in my_teams], "teams": [team.team_info() for team in teams]}, safe=False, status=201)
    # return JsonResponse({"error": "Something went wrong! Cannot load teams!"}, status=200)


@csrf_exempt
@login_required
def load_team_room(request, team_id):
    if request.method != "POST":
        return JsonResponse({"error": "Something went wrong! Invalid request method!"}, status = 403)
    team = Team.objects.get(team_id = team_id[8:])
    team_info = team.team_info()
    members = []
    for member in team.members.all():
        members.append({"name": member.name, "username": member.username})
    team_info["members"] = members
    try:
        chatRoom = ChatRoom.objects.get(team = team)
    except:
        chatRoom = create_chatRoom(team)
    try:
        messages = chatRoom.messages.all()
    except:
        messages = []
    temp_randID = get_random_string(length=8)
    return JsonResponse({"room_id":temp_randID+chatRoom.room_id, "team": team_info, "messages": [message.message_form for message in messages]}, safe=False, status = 201)


# @csrf_exempt
# @login_required
def create_chatRoom(team):
    new_room_id = get_random_string(length=12)
    while(True):
        temp_room = ChatRoom.objects.filter(room_id = new_room_id)
        if not temp_room:
            break
        new_room_id = get_random_string(length=12)
    chatRoom = ChatRoom.objects.create(room_id = new_room_id, team = team)
    if chatRoom.users.count != 1:
        for member in team.members.all():
            chatRoom.users.add(member)
    else:
        chatRoom.users.add(team.members.all())
    return chatRoom


@csrf_exempt
@login_required
def create_new_team(request):
    if request.method != "POST":
        return JsonResponse({"error": "Something went wrong! Invalid request method!"}, status = 403)
    data = json.loads(request.body)
    new_team_name = data.get("team_name")
    if not new_team_name.isalnum() or 3 > len(new_team_name) > 24:
        raise ValueError
    temp_team = Team.objects.filter(name = new_team_name)
    if temp_team:
        raise IntegrityError
    new_team_id = get_random_string(length=12)
    while(True):
        temp_team = Team.objects.filter(team_id = new_team_id)
        if not temp_team:
            break
        new_team_id = get_random_string(length=12)
    new_rank = len(Team.objects.all())
    new_team = Team.objects.create(team_id = new_team_id, name = new_team_name, admin = request.user, rank = new_rank)
    new_team.members.add(request.user)
    new_team.save()
    return JsonResponse(new_team.team_info())
    # return JsonResponse({"error":"Team name not available!"})
    # return JsonResponse({"error":"Team name cannot have characters other than a-z, A-Z, 0-9, _. length must be greter than 3 and less than/equal 24"})
    # return JsonResponse({"error":"Something went wrong!"})


@csrf_exempt
@login_required
def delete_team(request, team_id):
    if request.method != "POST":
        return JsonResponse({"error": "Something went wrong! Invalid request method!"}, status = 403)
    data = json.loads(request.body)
    delete_confirmation = data.get("team_name")
    if delete_confirmation != "yes":
        raise ValueError
    team = Team.objects.get(team_id = team_id[8:])
    if team.admin != request.user:
        return JsonResponse({"Error": "Invalid request: Auth failed"})
    chatRoom = ChatRoom.objects.get(team = team)
    chatRoom.messages.all().delete()
    chatRoom.delete()
    team.delete()
    return JsonResponse({"success": "Success"})


@csrf_exempt
@login_required
def apply_team(request, team_id):
    if request.method != "POST":
        return JsonResponse({"error": "Something went wrong! Invalid request method!"}, status = 403)
    data = request.json.loads("body")
    message = data["message"]
    notif_id = len(Notification.objects.all)
    notif = Notification(id = notif_id, sender = request.user, receiver =  Team.objects.get(team_id = team_id[8:]).admin.username, message = message)
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
    