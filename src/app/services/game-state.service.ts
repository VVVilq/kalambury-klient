import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  action:any;
  playerState:any;
  players:any;
  gameOptions:any;
  gameName:any;
  
  constructor() { }
}
