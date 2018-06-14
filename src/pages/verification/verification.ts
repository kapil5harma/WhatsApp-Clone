import { ProfilePage } from './../profile/profile';
import { Component, OnInit } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from 'ionic-angular';
import { PhoneService } from '../../services/phone';

@IonicPage()
@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html'
})
export class VerificationPage implements OnInit {
  private code: string = '';
  private phone: string;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private phoneService: PhoneService
  ) {}

  ngOnInit() {
    this.phone = this.navParams.get('phone');
  }

  onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode === 13) {
      this.verify();
    }
  }

  verify(): void {
    this.phoneService
      .login(this.phone, this.code)
      .then(() => {
        this.navCtrl.setRoot(
          ProfilePage,
          {},
          {
            animate: true
          }
        );
      })
      .catch(e => {
        this.handleError(e);
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
    console.log('ionViewDidLoad VerificationPage');
  }
}
