import { Component } from '@angular/core';
import { ApiCallService } from '../service/api-call.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Geolocation} from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  cardColor = '';
  cardIcon = '';

  cityForm: FormGroup;

  fullWeather = null;
  fullWeatherDate;

  geolocation = [];

  errorMessages = {
    city: [
      { type: 'required', message: 'City is required' },
      { type: 'pattern', message: 'Incorrect city name format (use letters and dashes or spaces)'}
    ]
  };

  icons = {
    clear:[
      'sunny-outline',
      'moon-outline'
    ],
    fewC:[
      'partly-sunny-outline',
      'cloudy-night-outline'
    ],
    cloudy: 'cloud-outline',
    rain: 'rainy-outline',
    storm: 'thunderstorm-outline',
    snow: 'snow-outline',
    mist: 'reorder-four-outline'
  };

  constructor(
    private apiCalls: ApiCallService,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.initializeForm();
    this.getGeolocation();
  }

  ionViewWillLeave() {
    this.cityForm.clearValidators();
    this.cityForm.reset();
  }

  initializeForm() {
    this.cityForm = this.formBuilder.group({
      city: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?!-)(?!.*--)(?!\\s)(?!.*\\s\\s)[A-ZŻŹĆŃŁŚĄĘÓa-zżźćńłśąęó-\\s]+(?<!-)(?<!\\s)$')
      ])),
    });
  }

  async getGeolocation() {
    const position = await Geolocation.getCurrentPosition();
    this.geolocation[0] = position.coords.longitude;
    this.geolocation[1] = position.coords.latitude;
    this.getInitWeather();
  }

  getInitWeather() {
    let fullquery = `weather?lat=${this.geolocation[1]}&lon=${this.geolocation[0]}`;
    this.apiCalls.getData(fullquery).subscribe( response => {
      if (!response.message) {
        this.fullWeather = response;
        this.convertToFullWeatherDate();
        this.setIconAndColor();
      }
    }, (error) => {
      this.presentToast(error.statusText);
    });
  }

  getFullWeather() {
    const query = this.cityForm.get('city').value;
    let fullquery = `weather?q=${query}`;
    this.apiCalls.getData(fullquery).subscribe( response => {
      if (!response.message) {
        this.fullWeather = response;
        this.convertToFullWeatherDate();
        this.setIconAndColor();
      }
    }, (error) => {
      this.presentToast(error.statusText);
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  convertToFullWeatherDate() {
    let offset = this.fullWeather.timezone - 3600;
    let date = new Date((this.fullWeather.dt + offset) * 1000);
    let sunrise = new Date((this.fullWeather.sys.sunrise + offset) * 1000);
    let sunset = new Date((this.fullWeather.sys.sunset + offset) * 1000);
    
    this.fullWeatherDate = {
      city: this.fullWeather.name,
      hour: date,
      date: date,
      temperature:
            Math.round(this.fullWeather.main.temp) + '°',
      pressure:
            this.fullWeather.main.pressure + 'hPa',
      description:
            this.fullWeather.weather[0].description,
      sunrise:
            sunrise,
      sunset:
            sunset
    } 
  }

  setIconAndColor() {
    let icon = this.fullWeather.weather[0].icon;
    let rgba = '';
    let time = '';
    switch (icon) {
      case '01d':
        this.cardIcon = this.icons.clear[0];
        rgba = '255,246,0,0.65';
        time = '240,240,240,0.5';
        break;
      case '01n':
        this.cardIcon = this.icons.clear[1];
        rgba = '130,130,255,0.6';
        time = '2,0,36,0.5';
        break;
      case '02d':
        this.cardIcon = this.icons.fewC[0];
        rgba = '211,213,119,0.6';
        time = '240,240,240,0.5';
        break;
      case '02n':
        this.cardIcon = this.icons.fewC[1];
        rgba = '100,100,195,0.6';
        time = '2,0,36,0.5';
        break;
      case '03d':
        this.cardIcon = this.icons.cloudy;
        rgba = '196,196,196,0.6';
        time = '240,240,240,0.5';
        break;
      case '03n':
        this.cardIcon = this.icons.cloudy;
        rgba = '70,70,180,0.6';
        time = '2,0,36,0.5';
        break;
      case '04d':
        this.cardIcon = this.icons.cloudy;
        rgba = '196,196,196,0.6';
        time = '240,240,240,0.5';
        break;
      case '04n':
        this.cardIcon = this.icons.cloudy;
        rgba = '70,70,180,0.6';
        time = '2,0,36,0.5';
        break;
      case '09d':
        this.cardIcon = this.icons.rain;
        rgba = '0,67,227,0.6';
        time = '240,240,240,0.5';
        break;
      case '09n':
        this.cardIcon = this.icons.rain;
        rgba = '0,67,227,0.6';
        time = '2,0,36,0.5';
        break;
      case '10d':
        this.cardIcon = this.icons.rain;
        rgba = '0,67,227,0.6';
        time = '240,240,240,0.5';
        break;
      case '10n':
        this.cardIcon = this.icons.rain;
        rgba = '0,67,227,0.6';
        time = '2,0,36,0.5';
        break;
      case '11d':
        this.cardIcon = this.icons.storm;
        rgba = '98,0,170,0.6';
        time = '240,240,240,0.5';
        break;
      case '11n':
        this.cardIcon = this.icons.storm;
        rgba = '98,0,170,0.6';
        time = '2,0,36,0.5';
        break;
      case '13d':
        this.cardIcon = this.icons.snow;
        rgba = '0,219,247,0.6';
        time = '240,240,240,0.5';
        break;
      case '13n':
        this.cardIcon = this.icons.snow;
        rgba = '0,219,247,0.6';
        time = '2,0,36,0.5';
        break;
      case '50d':
        this.cardIcon = this.icons.mist;
        rgba = '168,160,122,0.6';
        time = '240,240,240,0.5';
        break;
      case '50n':
        this.cardIcon = this.icons.mist;
        rgba = '168,160,122,0.6';
        time = '2,0,36,0.5';
        break;
    }

    this.cardColor = `linear-gradient(45deg, rgba(${time}) 0%, rgba(${rgba}) 60%)`;
  }

}
