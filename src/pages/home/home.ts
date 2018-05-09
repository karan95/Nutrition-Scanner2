import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { GoogleCloudVisionServiceProvider } from '../../providers/google-cloud-vision-service/google-cloud-vision-service';
// import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseListObservable, AngularFireDatabase } from "angularfire2/database-deprecated";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alert: AlertController,
    private db: AngularFireDatabase,
    private vision: GoogleCloudVisionServiceProvider
    ) {
      this.items = db.list('items'); 
  }
  
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // this.saveResults(imageData,[]);

      this.vision.getLabels(imageData).subscribe((result:any) => {
        this.saveResults(imageData, result.responses);
      }, err => {
        this.showAlert(err);
      })
    
    }, err => {
      this.showAlert(err);
    });
  }

  saveResults(imageData, results) {
    // this.items.push(imageData);
    this.items.push({ imageData: imageData, results: results})
        .then(_ => { });
  }

  showAlert(message) {
    let alert = this.alert.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  
}
