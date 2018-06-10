import { MessagesPage } from './../messages/messages';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chats, Messages } from './../../../api/server/collections';
import { Chat } from 'api/models';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage implements OnInit {
  chats;

  constructor(private navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.chats = Chats.find({}).mergeMap((chats: Chat[]) =>
      Observable.combineLatest(
        ...chats.map((chat: Chat) =>
          Messages.find({ chatId: chat._id })
            .startWith(null)
            .map(messages => {
              if (messages) chat.lastMessage = messages[0];
              return chat;
            })
        )
      )
    );
    // .zone(); // Commented this line as it throws error.
  }

  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, { chat });
  }

  removeChat(chat: Chat): void {
    Chats.remove({ _id: chat._id }).subscribe(() => {});
  }
}
