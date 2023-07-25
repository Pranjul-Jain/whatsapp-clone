from django.http import HttpResponse , JsonResponse
from django.conf import settings
from rest_framework.decorators import  api_view
from rest_framework.response import Response
from main.admin import Group , User
import os
import uuid
import json
from bson import ObjectId
from datetime import datetime
import pytz

def GetUserImage(request):
    image_name = request.GET.get('image')
    image_path = os.path.join(settings.MEDIA_ROOT,image_name)
    with open(image_path,"rb") as fp:
        return HttpResponse(fp.read(),content_type="image/*")

def GetUserImageById(request):
    user_id = request.GET.get("user_id")
    user = User.objects.get(_id=ObjectId(user_id))
    image_path = os.path.join(settings.MEDIA_ROOT,user.upload_image.name)
    print(image_path)
    with open(image_path,"rb") as fp:
        return HttpResponse(fp.read(),content_type="image/*")

@api_view(["POST"])
def addGroup(request):
    timestamp = datetime.now(pytz.timezone("Asia/kolkata")).strftime("%a %b %d %Y %H:%M:%S GMT%z (%Z)")
    name = request.data.get("name",None)
    image = request.data.get("image",None)
    members = request.data.get("members",None)
    
    if members:
        members = json.loads(members)
        for member in members:
            member["_id"] = uuid.uuid4().hex
            member['message_timestamp'] = timestamp

    if image:
        image.name = image.name[:image.name.find(".")] + str(uuid.uuid4()) + image.name[image.name.find("."):]

    group = Group(name=name,creator_id=User.objects.get(_id=ObjectId(request.session.get("user",None))),upload_image=image,members=[],admin=[]\
                ,timestamp=datetime.now(pytz.timezone("Asia/kolkata")).strftime("%a %b %d %Y %H:%M:%S GMT%z (%Z)"),messages=[],restriction=False)
    group.members = members
    group.admin = [{"_id":uuid.uuid4().hex,"user_id":request.session.get("user",None)}]
    group.save()
    
    return Response({"message":"success"})