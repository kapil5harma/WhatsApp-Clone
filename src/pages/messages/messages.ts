import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chat, Message, MessageType } from 'api/models';
import { Observable } from 'rxjs';
import { Messages } from 'api/collections';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage implements OnInit {
  selectedChat: Chat;
  title: string;
  picture: string;
  messages: Observable<Message[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedChat = <Chat>navParams.get('chat');
    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;

    console.log('Selected chat is: ', this.selectedChat);
  }

  ngOnInit() {
    let isEven = false;

    this.messages = Messages.find(
      { chatId: this.selectedChat._id },
      { sort: { createdAt: 1 } }
    ).map((messages: Message[]) => {
      messages.forEach((message: Message) => {
        message.ownership = isEven ? 'mine' : 'other';
        isEven = !isEven;
      });

      return messages;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }
}
