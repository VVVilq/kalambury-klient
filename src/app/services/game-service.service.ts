import { Injectable } from '@angular/core';
import { WebsocketServiceService } from './websocket-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {

  constructor(private socketClient: WebsocketServiceService) { }
  


  save(post: any,gameName:string) {
    return this.socketClient.send(`/app/create/${gameName}`, post);
  }

  join(gameName:string) {
    return this.socketClient.sendWithNoPayload(`/app/joinGame/${gameName}`);
  }

  start(gameName:string) {
    return this.socketClient.sendWithNoPayload(`/app/startGame/${gameName}`);
  }

  guess(post: any,gameName:string) {
    return this.socketClient.send(`/app/guessTheWord/${gameName}`, post);
  }

  onGameCreation(): Observable<any> {
    return this.socketClient.onMessage('/user/topic/game/created');
  }
  
  onNewPlayer(): Observable<any> {
    return this.socketClient.onMessage('/user/topic/game/newPlayer');
  }

  onNewGameJoin(): Observable<any> {
    return this.socketClient.onMessage('/user/topic/game/joined');
  }

  onGameLeft(): Observable<any> {
    return this.socketClient.onMessage('/user/topic/game/left');
  }

  onGameStart(): Observable<any> {
    return this.socketClient.onMessage('/user/topic/game/started');
  }

  onGameRound(): Observable<any> {
    return this.socketClient.onMessage('/user/topic/game/');
  }

}
