from sqlite3 import connect
from django.contrib.auth.models import AbstractUser
from django.utils.crypto import get_random_string
from datetime import datetime
from django.db import models

class User(AbstractUser):
    pass
    name = models.TextField(max_length = 24, null = False)
    rank = models.IntegerField(default = 0, null = True)
    followers = models.ManyToManyField('self', related_name="get_followers", symmetrical=False)
    friends = models.ManyToManyField('self', symmetrical=True)
    qSolved = models.IntegerField(default = 0, null = True)

    def __str__(self):
        return f"{self.id}"
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
    id = models.BigAutoField(primary_key=True, null = False)
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
    team_id = models.CharField(max_length=12, null = False)
    name = models.TextField(max_length = 24, null = False)
    admin = models.ForeignKey('User', on_delete=models.PROTECT, null=False)
    rank = models.IntegerField(default = 0, null = True)
    members = models.ManyToManyField('User', related_name="get_members", symmetrical = False)

    def team_info(self):
        temp_randID = get_random_string(length=8)
        return {
            "team_id": temp_randID+self.team_id,
            "name": self.name,
            "rank": self.rank,
            "admin": self.admin.name,
            "members_count": self.members.count()
            }

class Message(models.Model):
    msg_id = models.BigAutoField(primary_key = True)
    room_id = models.CharField(max_length=24, null=False)
    sender = models.ForeignKey('User', on_delete=models.PROTECT, null=False)
    quote_text = models.TextField(null = False)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

    def message_form(self):
        temp_randID = get_random_string(length=8)
        return {
            "msg_id": temp_randID+self.msg_id,
            "sender_id": self.sender.id,
            "sender_name": self.sender.name,
            "quote_text": self.quote_text,
            "time": self.time
        }

class ChatRoom(models.Model):
    room_id = models.CharField(max_length=24, null=False)
    users = models.ManyToManyField('User', related_name="get_chatRoomUsers", symmetrical=False)
    messages = models.ManyToManyField('Message', related_name="get_messages", symmetrical=False)
    team = models.ForeignKey('Team', on_delete=models.PROTECT, null = True)

    def __str__(self):
        temp_randID = get_random_string(length=8)
        return f"{temp_randID+self.room_id}"

class Solution(models.Model):
    id = models.BigAutoField(primary_key=True, null = False)
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
    id = models.BigAutoField(primary_key=True, null = False)
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