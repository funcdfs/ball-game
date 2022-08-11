from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player



def register(request):
    data = request.GET
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    password_confirm = data.get("password_confirm", "").strip()
    if not username or not password:
        return JsonResponse({
            'result': "input can't empty"
        })
    if password != password_confirm:
        return JsonResponse({
            'result': "password_confirm failed",
        })
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result': "username already exist"
        })
    user = User(username=username)
    user.set_password(password)
    user.save()
    Player.objects.create(user=user, photo="https://img2.baidu.com/it/u=2161949891,656888789&fm=26&fmt=auto")
    login(request, user)
    return JsonResponse({
        'result': "success",
    })