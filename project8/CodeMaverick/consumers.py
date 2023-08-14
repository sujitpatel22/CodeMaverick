import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, ChatRoom

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        msg_id = text_data_json['msg_id']
        send_id = text_data_json['send_id']
        sender_name = text_data_json['sender_name']
        quote_text = text_data_json['quote_text']
        room_id = text_data_json['room_id']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'send_id': send_id,
                'msg_id': msg_id,
                'sender_name': sender_name,
                'quote_text': quote_text,
                'room_id': room_id
            }
        )


    # Receive message from room group
    async def chat_message(self, event):
        quote_text = event['quote_text']
        room_id = event['room_id']

        message = Message.objects.create(room_id = room_id, sender = self.scope["user"], quote_text = quote_text)

        await self.send(text_data=json.dumps({
                'msg_id': message.msg_id,
                'send_id': self.scope["user"].id,
                'sender_name': self.scope["user"].name,
                'quote_text': quote_text,
                'room_id': room_id
        }))
        chatRoom = ChatRoom.objects.get(room_id = room_id[8:])
        chatRoom.messages.add(message)
        chatRoom.save()
    