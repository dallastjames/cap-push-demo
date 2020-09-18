import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PushService } from '../push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public notAllowed = false;
  public token$ = this.pushService.token$;
  public notification$ = this.pushService.notification$;
  public tokenControl = new FormControl();

  constructor(private pushService: PushService) {
    this.pushService.token$.subscribe(token => {
      if (!!token) {
        this.tokenControl.setValue(token);
      } else {
        this.tokenControl.setValue('');
      }
      this.tokenControl.updateValueAndValidity();
    });
  }

  public async registerForPush(): Promise<void> {
    if (await this.pushService.requestPermission()) {
      this.notAllowed = false;
      await this.pushService.registerDevice();
    } else {
      this.notAllowed = true;
    }
  }
}
