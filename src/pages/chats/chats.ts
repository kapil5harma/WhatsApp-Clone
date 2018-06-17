import { NewChatComponent } from './../../components/new-chat/new-chat';
import { MessagesPage } from './../messages/messages';
import { Component, OnInit } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  ModalController
} from 'ionic-angular';
import { Chats, Messages, Users } from './../../../api/server/collections';
import { Chat, Message } from 'api/models';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable, Subscriber } from 'rxjs';
import { ChatOptionsComponent } from '../../components/chat-options/chat-options';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage implements OnInit {
  chats;
  senderId: string;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) {
    this.senderId = Meteor.userId();
  }

  addChat(): void {
    const modal = this.modalCtrl.create(NewChatComponent);
    modal.present();
  }

  ngOnInit() {
    this.chats = this.findChats();
  }

  findChats(): Observable<Chat[]> {
    // Find chats and transform them
    return Chats.find().map(chats => {
      chats.forEach(chat => {
        chat.title = '';
        chat.picture = '';

        const receiverId = chat.memberIds.find(
          memberId => memberId !== this.senderId
        );
        const receiver = Users.findOne(receiverId);

        if (receiver) {
          chat.title = receiver.profile.name;
          chat.picture = receiver.profile.picture;
        }

        // This will make the last message reactive
        this.findLastChatMessage(chat._id).subscribe(message => {
          chat.lastMessage = message;
        });
      });

      return chats;
    });
  }

  findLastChatMessage(chatId: string): Observable<Message> {
    return Observable.create((observer: Subscriber<Message>) => {
      const chatExists = () => !!Chats.findOne(chatId);

      // Re-compute until chat is removed
      MeteorObservable.autorun()
        .takeWhile(chatExists)
        .subscribe(() => {
          Messages.find(
            { chatId },
            {
              sort: { createdAt: -1 }
            }
          ).subscribe({
            next: messages => {
              // Invoke subscription with the last message found
              if (!messages.length) {
                return;
              }

              const lastMessage = messages[0];
              observer.next(lastMessage);
            },
            error: e => {
              observer.error(e);
            },
            complete: () => {
              observer.complete();
            }
          });
        });
    });
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(
      ChatOptionsComponent,
      {},
      {
        cssClass: 'options-popover chats-options-popover'
      }
    );

    popover.present();
  }

  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, { chat });
  }

  removeChat(chat: Chat): void {
    Chats.remove({ _id: chat._id }).subscribe(() => {});
  }
}
