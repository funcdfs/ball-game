#!/usr/bin/env python
# encoding: utf-8

from django.shortcuts import render

def index(request):
    return render(request, "multiends/web.html")