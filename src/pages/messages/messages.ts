import { MessagesOptionsComponent } from './../../components/messages-options/messages-options';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import { Chat, Message, MessageType } from 'api/models';
import { Observable, Subscription } from 'rxjs';
import { Messages } from 'api/collections';
import { MeteorObservable } from 'meteor-rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage implements OnInit, OnDestroy {
  selectedChat: Chat;
  title: string;
  picture: string;
  messages: Observable<Message[]>;
  messagesDayGroups;
  message: string = '';
  autoScroller: MutationObserver;
  scrollOffset = 0;
  senderId: string;
  loadingMessages: boolean;
  messagesComputation: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ele: ElementRef,
    private popoverCtrl: PopoverController
  ) {
    this.selectedChat = <Chat>navParams.get('chat');
    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;
    this.senderId = Meteor.userId();

    console.log('Selected chat is: ', this.selectedChat);
  }

  private get messagesPageContent(): Element {
    return this.ele.nativeElement.querySelector('.messages-page-content');
  }

  private get messagesList(): Element {
    return this.messagesPageContent.querySelector('.messages');
  }

  private get scroller(): Element {
    return this.messagesList.querySelector('.scroll-content');
  }

  ngOnInit() {
    this.autoScroller = this.autoScroll();
    this.subscribeMessages();

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

  ngOnDestroy() {
    this.autoScroller.disconnect();
  }

  // Subscribes to the relevant set of messages
  subscribeMessages(): void {
    // A flag which indicates if there's a subscription in process
    this.loadingMessages = true;
    // A custom offset to be used to re-adjust the scrolling position once
    // new dataset is fetched
    this.scrollOffset = this.scroller.scrollHeight;

    MeteorObservable.subscribe('messages', this.selectedChat._id).subscribe(
      () => {
        // Keep tracking changes in the dataset and re-render the view
        if (!this.messagesComputation) {
          this.messagesComputation = this.autorunMessages();
        }

        // Allow incoming subscription requests
        this.loadingMessages = false;
      }
    );
  }

  // Detects changes in the messages dataset and re-renders the view
  autorunMessages(): Subscription {
    return MeteorObservable.autorun().subscribe(() => {
      this.messagesDayGroups = this.findMessagesDayGroups();
    });
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(
      MessagesOptionsComponent,
      {
        chat: this.selectedChat
      },
      {
        cssClass: 'options-popover messages-options-popover'
      }
    );

    popover.present();
  }

  findMessagesDayGroups() {
    let isEven = false;

    return Messages.find(
      {
        chatId: this.selectedChat._id
      },
      {
        sort: { createdAt: 1 }
      }
    ).map((messages: Message[]) => {
      const format = 'D MMMM Y';

      // Compose missing data that we would like to show in the view
      messages.forEach(message => {
        // message.ownership = isEven ? 'mine' : 'other';
        // isEven = !isEven;
        message.ownership =
          this.senderId == message.senderId ? 'mine' : 'other';

        return message;
      });

      // Group by creation day
      const groupedMessages = _.groupBy(messages, message => {
        return moment(message.createdAt).format(format);
      });

      // Transform dictionary into an array since Angular's view engine doesn't know how
      // to iterate through it
      return Object.keys(groupedMessages).map((timestamp: string) => {
        return {
          timestamp: timestamp,
          messages: groupedMessages[timestamp],
          today: moment().format(format) === timestamp
        };
      });
    });
  }

  autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messagesList, {
      childList: true,
      subtree: true
    });

    return autoScroller;
  }

  scrollDown(): void {
    // Don't scroll down if messages subscription is being loaded
    if (this.loadingMessages) {
      return;
    }
    // Scroll down and apply specified offset
    this.scroller.scrollTop = this.scroller.scrollHeight - this.scrollOffset;
    // Zero offset for next invocation
    this.scrollOffset = 0;
  }

  onInputKeypress({ keyCode }: KeyboardEvent): void {
    // if (keyCode.charCode === 13) {
    if (keyCode === 13) {
      this.sendTextMessage();
    }
  }

  sendTextMessage(): void {
    // If message was yet to be typed, abort
    if (!this.message) {
      return;
    }

    MeteorObservable.call(
      'addMessage',
      MessageType.TEXT,
      this.selectedChat._id,
      this.message
    );
    // ).zone().subscribe(() => {
    //   // Zero the input field
    //   this.message = '';
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }
}
