import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';
import { Subject, Observable } from 'rxjs';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private tokenStream: Subject<string> = new Subject();
  private notificationStream: Subject<PushNotification> = new Subject();

  public token$: Observable<string> = this.tokenStream.asObservable();
  public notification$: Observable<
    PushNotification
  > = this.notificationStream.asObservable();

  constructor() {
    this.initListeners();
  }

  public async requestPermission(): Promise<boolean> {
    const result = await PushNotifications.requestPermission();
    return result.granted;
  }

  public async registerDevice(): Promise<void> {
    PushNotifications.register();
  }

  private initListeners(): void {
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        console.log('registration token', token);
        this.tokenStream.next(token.value);
      },
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('registration error', error);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('push notification received', notification);
        this.notificationStream.next(notification);
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('push notification action performed', notification);
      },
    );
  }
}
