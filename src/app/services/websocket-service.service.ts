import { Injectable, OnDestroy } from '@angular/core';

import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

import { BehaviorSubject, Observable } from 'rxjs';
import { SocketClientState } from './SocketClientState';
import { filter, first, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService implements OnDestroy {


  private client: any;
  private state: BehaviorSubject<SocketClientState>;
  
  constructor(private authService:AuthService) {
    this.client = Stomp.Stomp.over(new SockJS('http://localhost:8080/game'));
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    
    this.client.connect({'Auth-Token': authService.currentUserValue.token}, () => {
      this.state.next(SocketClientState.CONNECTED);
    });
  }

  connect(): Observable<any> {
    console.log("connected")
    return new Observable<any>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.client);
      });
    });
  }

  ngOnDestroy() {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(null));
  }

  onMessage(topic: string, handler = WebsocketServiceService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(inst => {
      return new Observable<any>(observer => {
        const subscription: any = inst.subscribe(topic, message => {
          observer.next(handler(message));
        });
        return () => inst.unsubscribe(subscription.id);
      });
    }));
  }

  onPlainMessage(topic: string): Observable<string> {
    return this.onMessage(topic, WebsocketServiceService.textHandler);
  }

  send(topic: string, payload: any): void {
    this.connect()
      .pipe(first())
      .subscribe(inst => inst.send(topic, {}, JSON.stringify(payload)));
  }
  sendWithNoPayload(topic: string): void {
    this.connect()
      .pipe(first())
      .subscribe(inst => inst.send(topic, {}));
  }

  static jsonHandler(message: any): any {
    return JSON.parse(message.body);
  }

  static textHandler(message: any): string {
    return message.body;
  }

  
}
