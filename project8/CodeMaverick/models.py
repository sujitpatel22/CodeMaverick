from sqlite3 import connect
from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

class User(AbstractUser):
    pass
    name = models.TextField(max_length = 24, null = False)
    rank = models.IntegerField(default = 0, null = True)
    followers = models.ManyToManyField('self', related_name="get_followers", symmetrical=False)
    friends = models.ManyToManyField('self', symmetrical=True)
    qSolved = models.IntegerField(default = 0, null = True)

    def __str__(self):
        return f"{self.username}"
    def user_info(self):
        return {
            "name": self.name,
            "rank": self.rank,
            "followers": {follower.name for follower in self.followers},
            "qsolved": self.qSolved
        }
    def team_user_info(self):
        return {
            "name": self.name,
            "rank": self.rank,
            "qsolved": self.qSolved
        }
    
class Notification(models.Model):
    id = models.IntegerField(default = 0, null=False, primary_key=True)
    sender = models.ForeignKey('User', on_delete=models.CASCADE, null = False)
    receiver = models.CharField(max_length=64, null=False)
    message = models.TextField(max_length=512, null = False)
    status = models.BooleanField(default=False)

    def notif(self):
        return {
            "id": self.id,
            "sender": self.sender,
            "message": self.message,
            "status": self.status
        }

class Team(models.Model):
    team_id = models.CharField(max_length=12, null = False, primary_key=True)
    name = models.TextField(max_length = 24, null = False)
    admin = models.ForeignKey('User', on_delete=models.PROTECT, null=False)
    rank = models.IntegerField(default = 0, null = True)
    members = models.ManyToManyField('User', related_name="get_members")

    def team_info(self):
        return {
            "team_id": self.team_id,
            "name": self.name,
            "admin": self.admin.name,
            "rank": self.rank,
            "members": "self.members"
            }

class Message(models.Model):
    room_id = models.CharField(max_length=24, null=False, primary_key=True)
    sender = models.ForeignKey('User', on_delete=models.CASCADE,related_name ='send_messages', null=False)
    receiver = models.ForeignKey('User', on_delete=models.CASCADE,related_name ='receive_messages', null=False)
    content = models.TextField(null = False)
    time = models.TimeField(auto_now_add=True)

class ChatRoom(models.Model):
    room_id = models.CharField(max_length=24, null=False, primary_key=True)
    sender = models.ForeignKey('User', on_delete=models.CASCADE,related_name ='send_chatroom_messages', null=False)
    receiver = models.ForeignKey('User', on_delete=models.CASCADE,related_name ='receive_chatroom_messages', null=False)
    messages = models.ManyToManyField('Message', related_name="get_messages", symmetrical=False)
    team = models.ForeignKey('Team', on_delete=models.PROTECT, null = True)

class Solution(models.Model):
    ques_id = models.IntegerField(default = 0, null = False, primary_key=True)
    sol_id = models.IntegerField(default = 0, null = False)
    user = models.ForeignKey('User', on_delete = models.PROTECT, null = False)
    sol = models.TextField(null = False)
    likes = models.IntegerField(default = 0, null = True)

    def get_sol(self):
        return {
            "user": self.user.name,
            "sol": self.sol,
            "likes": self.likes
            }

class Question(models.Model):
    ques_id = models.IntegerField(default = 0, null = False)
    user = models.ForeignKey('User', on_delete = models.CASCADE, null = False)
    ques = models.TextField(null = False)
    sols = models.ManyToManyField('Solution', related_name = "get_solutions", symmetrical = False)
    category = models.TextField(null = False)
    src = models.TextField(null = False)

    def get_ques(self):
        return {
            "ques_id": self.ques_id,
            "user": self.user.name,
            "ques": self.ques,
            "category": self.category,
            "src": self.src
        }