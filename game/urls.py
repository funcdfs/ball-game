#!/usr/bin/env python
# encoding: utf-8

from django.urls import path
from game.views import index
from game.views import play

urlpatterns = [
    path("", index, name="game index"),
    path("play/", play, name="game play"),
]
