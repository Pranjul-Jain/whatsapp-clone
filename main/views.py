from django.http import JsonResponse , HttpResponse
from django.middleware.csrf import get_token
from django.contrib.auth.hashers import make_password,check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from main.admin import User , Connection ,Group , MemberDetails
from djongo.models import *
from django.forms.models import model_to_dict
from django.shortcuts import render
import uuid
import dotenv
from datetime import datetime , timedelta
from bson import ObjectId

# Loading .env file
dotenv.load_dotenv()

def index(request):
    return render(request,"index.html")

def authenticateUser(request):
    user = request.session.get('user',None)
    if user:
        return JsonResponse({"message":"authorized","user_id":request.session.get("user",None)},safe=False)
    else:
        return JsonResponse({"message":"not authorized"},safe=False)

def csrftoken(request):
    Response = HttpResponse()
    token = get_token(request)
    Response.set_cookie("csrftoken",token,httponly=True,expires=datetime.now() + timedelta(days=7))
    
    return Response

@api_view(["POST"])
def register(request):
    username = request.data.get("username",None).strip().title()
    number = request.data.get("number",None)
    image = request.data.get("user-files",None)
    password = make_password(request.data.get("password",None))
    if image:
        image.name = image.name[:image.name.find(".")] + str(uuid.uuid4()) + image.name[image.name.find("."):]

    try:
        User.objects.get(number=number)
    except:
        user = User(username=username,number=number,upload_image = image,password = password)
        user.save()

        return Response({"message":"registered successfully"},status=200)

    return Response({"message":"already registered"},status=200)

@api_view(["POST"])
def login_user(request):
    if request.session.get("user",None):
        return JsonResponse({"message":"already login"},status=200)
    
    number = request.data.get("number",None)
    password = request.data.get("password",None)
    try:
        user = User.objects.filter(number=number)[0]
        request.session['user'] = str(user._id)
        if check_password(password,user.password):
            return JsonResponse({"message":"login successfully","user_id":request.session["user"]},status=200)
        else:
            return JsonResponse({"message":"Password is Wrong"},status=200)
    except Exception as e:
        print(e)
        return JsonResponse({"message":"Not Registered"},status=200)

def logout_user(request):
    if request.session.get("user",None):
        del request.session['user']
        return JsonResponse({"message":"logout"})
    else:
        return JsonResponse({"message":"not loggined"})

@api_view(["POST"])
def createConnection(request):
    number = request.data.get("number",None)
    name = request.data.get("name",None).strip()
    user_id = request.data.get('user_id',None)
    receiver = User.objects.filter(number=number)
    if receiver:
        receiver = receiver[0]
        try:
            user = Connection.objects.mongo_find({"user_id":ObjectId(user_id),"receiver_id":ObjectId(receiver._id)})

            if user.count()>0:
                return Response({"message":"user already exists"})
            
            name = name if name else number
            sender = User.objects.get(_id=ObjectId(user_id))

            Connection.objects.mongo_insert({"name":name,"user_id":ObjectId(user_id),"receiver_id":receiver._id,"messages":[]})
            
            connection_id = Connection.objects.mongo_insert({"name":sender.number,"user_id":receiver._id,"receiver_id":ObjectId(user_id),"messages":[]})

            return Response({"message":"user added","_id":str(connection_id)})
        except Exception as e:
            print(e)
            return Response({"message":"creation failed"})
    else:
        return Response({"message","user not exists"})

def Getusers(request,user_id):
    print(user_id)
    all_users = list(Connection.objects.filter(user_id=ObjectId(user_id)).values("receiver_id__upload_image","messages","receiver_id","name"))
    all_groups = [dict(entry) for entry in Group.objects.mongo_aggregate([{
        "$match":{
            "members.user_id":user_id
        }
    },
    {
            "$project": {
                "_id": 1,
                "upload_image": 1,
                "messages": 1,
                "name": 1
            }
    }
    ])]

    for group in all_groups:
        group['_id'] = str(group["_id"])

    for users in all_users:
        users["receiver_id"] = str(users["receiver_id"])

    if not all_groups:
        all_groups = []

    if all_users:
        return JsonResponse({"users":all_users + all_groups},safe=False)
    else:
        return JsonResponse({"users":None},safe=False)
    