from django.http import HttpResponse

def index(request):
    return HttpResponse("My first page")


def play(request):
    line1 = "11"
    return HttpResponse(line1)
