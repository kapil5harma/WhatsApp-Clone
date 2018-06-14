import { Component, OnInit } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Profile } from 'api/models';
import { ChatsPage } from '../chats/chats';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit {
  picture: string;
  profile: Profile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.profile = Meteor.user().profile || {
      name: ''
    };
  }

  updateProfile(): void {
    MeteorObservable.call('updateProfile', this.profile).subscribe({
      next: () => {
        this.navCtrl.push(ChatsPage);
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
}
