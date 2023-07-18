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

class Chat():
    user = models.ForeignKey('User', on_delete=models.CASCADE, null=False)
    content = models.TextField(max_length=250, null=False)

class Team():
    team_id = models.CharField(default = 0, null = False)
    name = models.TextField(max_length = 24, null = False)
    # rank = models.IntegerField(default = 0, null = True)
    members = models.ManyToManyField('User', related_name="get_members", symmetrical = False)
    chats = models.ManyToManyField('Chat', related_name = "get_chats", symmetrical = False)

    def team_info(self):
        return {
            "team_id": self.team_id,
            "name": self.name
            }

class Solution():
    ques_id = models.IntegerField(default = 0, null = False)
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

class Question():
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