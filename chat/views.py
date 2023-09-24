from channels.generic.websocket import AsyncWebsocketConsumer
from  django.conf import settings
from main.admin import Connection,Group
import json
from datetime import datetime
from bson import ObjectId
from asgiref.sync import sync_to_async
import uuid
import pytz

class Consumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = self.scope['url_route']['kwargs']['room_name']
        
        self.is_group = len(self.group_name) == 24

        if not self.is_group:
            self.sender = self.group_name[:24]
            self.receiver = self.group_name[24:]

            self.group_name = self.sender+self.receiver if self.sender >= self.receiver else self.receiver+self.sender

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        print(self.group_name+" has been connected")
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name,self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        user_data = {
                "_id":uuid.uuid4().hex,
                "user_id": data['sender_id'],
                "ref_id": None,
                "message": data['message'],
                "message_timestamp": datetime.now(pytz.timezone("Asia/kolkata")).strftime("%a %b %d %Y %H:%M:%S GMT%z (%Z)")
        }
        if not self.is_group:    
            sender = await sync_to_async(Connection.objects.get)(user_id=ObjectId(self.sender),receiver_id=ObjectId(self.receiver))
            sender.messages.append(user_data)
            await sync_to_async(sender.save)()

            receiver = await sync_to_async(Connection.objects.get)(user_id=ObjectId(self.receiver),receiver_id=ObjectId(self.sender))
            receiver.messages.append(user_data)
            await sync_to_async(receiver.save)()

        else:
            group = await sync_to_async(Group.objects.get)(_id=ObjectId(self.group_name))
            group.messages.append(user_data)
            await sync_to_async(group.save)()
            
        await self.channel_layer.group_send(self.group_name, {
                "type": "chat_message",
                **user_data
            })

    async def chat_message(self,event):
        await self.send(json.dumps({"message":event["message"],"sender_id":event['user_id'],"message_timestamp":event['message_timestamp']}))