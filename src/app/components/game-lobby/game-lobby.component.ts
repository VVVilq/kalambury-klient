import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { GameServiceService } from 'src/app/services/game-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { GameStateService } from 'src/app/services/game-state.service';

interface Player{
  username:string,
  points:number,
  state:string
}

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit {
 

  constructor(private auth: AuthService,
  private gameService: GameServiceService,
  private gameData:GameStateService,
  private router: Router,) { 
    this.players=[]
  }

  gameChat:any[]=[];

  active:boolean =false;
  players:Player[];
  gameCreator:boolean=false;


  ngOnInit() {
    this.gameService.onNewGameJoin().subscribe(data=>this.gameJoinedEvent(data))
    this.gameService.onGameCreation().subscribe(data=>this.gameSuccesfulCreationEvent(data))
    //this.gameService.on().subscribe(data=>this.gameSuccesfulCreation(data))
    this.gameService.onGameLeft().subscribe(data=>this.gameLeftPlayerEvent(data))
    this.gameService.onGameStart().subscribe(data=>this.gameStartEvent())
    this.gameService.onNewPlayer().subscribe(data=>this.gameNewPlayerEvent(data))
    this.gameService.onGameRound().subscribe(data=>this.gameRoundEvent(data))

    if(this.gameData.action==="created"){
      this.gameService.save(this.gameData.gameOptions,this.gameData.gameName)
      this.gameCreator=true;
    }else if(this.gameData.action==="joined"){
      this.gameService.join(this.gameData.gameName)
    }
  }

  gameRoundEvent(data:any){
    console.log(data)
    if(data.drawingWord){
      this.gameChat.push("You are now drawing: " + data.drawingWord)
    }

    if(data.gameEvent){
      if(data.gameEvent=="DRAWING"){
        this.gameChat.push(data.trigerIdentifier + " is now drawing")
      }
    }
  }
  
  gameSuccesfulCreationEvent(data:any){
    console.log(data)
    console.log(this.players)
    this.gameData.action= true
    this.players.push({username: this.auth.currentUserValue.username,points:0,state:"Guessing"})
    console.log(this.players)
  }

  gameNewPlayerEvent(data){
    console.log(this.players)
    console.log(data.trigerIdentifier)

    this.players.push({username: data.trigerIdentifier,points:0,state:"Guessing"})
    console.log(this.players)
  }

  gameLeftPlayerEvent(data){
    this.players = this.players.filter(function( obj ) {
      return obj.username !== data.trigerIdentifier;
  });
  console.log(this.players)
  }

  gameJoinedEvent(data){
    console.log(data)
    this.active=data.active
    this.players=this.players.concat(data.playersDTO);
    console.log(this.players)
  }

  gameStartEvent(){
    this.active=true;
  }

  startGame(){
    this.gameService.start(this.gameData.gameName);
  }

  quit(){
    this.gameData.action="";
    this.gameData.gameName="";
    this.gameData.gameOptions="";
    this.gameData.playerState="";
    this.gameData.players=""
    this.router.navigate([`/game_menu`])
  }
}
