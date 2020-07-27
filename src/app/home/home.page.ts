import { Component } from '@angular/core';
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

  constructor(private pushService: PushService) {}

  public async registerForPush(): Promise<void> {
    if (await this.pushService.requestPermission()) {
      this.notAllowed = false;
      await this.pushService.registerDevice();
    } else {
      this.notAllowed = true;
    }
  }
}
