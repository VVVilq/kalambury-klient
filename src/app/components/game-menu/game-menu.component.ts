import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GameServiceService } from 'src/app/services/game-service.service';
import { GameStateService } from 'src/app/services/game-state.service';
import { CustomListServiceService } from 'src/app/services/custom-list-service.service';
import { MatSnackBar } from '@angular/material';

export interface ListData {
  name: string;
  words: string[];
}

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit {
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  newGameName:string ="";
  joinGameName: string;
  customWordListSelected: any[]=[];

  customLists: any[] =[];

  constructor(private gameData:GameStateService,
    private listService:CustomListServiceService,
    private router: Router,
    private authenticationService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { 
       // redirect to default route if already logged in
    }

    form: FormGroup; 

  ngOnInit() {
      this.listService.getUserLists().subscribe((response) => {
        Array.prototype.push.apply(this.customLists, response);
      }, error => {
        this.openErrorMessage()
      });
      this.form = new FormGroup({
        wordsFrequency:new FormControl("Never"),
        drawingTime:new FormControl("60"),
        maxPoints:new FormControl("1000"),
      });
  }


  onCheckChange(event) {
    
  
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      this.customWordListSelected.push(event.target.value);
      console.log(this.customWordListSelected)
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;
  
      this.customWordListSelected.forEach(item => {
        console.log("xx")
        if(item.name == event.target.value.name) {
          // Remove the unselected element from the arrayForm
          this.customWordListSelected.splice(i,1);
          console.log(this.customWordListSelected)
          return;
          
        }
  
        i++;
      });
    }
  }


  createListDialog(): void {
    const dialogRef = this.dialog.open(ListDialog,{ panelClass: ['custom-dialog-container'],
      data:{name:'',words:[]}});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result){
        if(!Array.isArray(result.words)){
        result.words = result.words.split(",").map(function(item) {
          return item.trim();
        });
      }  
        this.listService.addList(result).subscribe((response) => {
          console.log(result)
          this.customLists.push(result)
        }, error => {
          console.log("cooo")
          this.openErrorMessage()
        });
      }  
    });
  }


  editListDialog(element): void {
    const dialogRef = this.dialog.open(ListDialog,{ panelClass: ['custom-dialog-container']
  ,
  data: element});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result){
        if(!Array.isArray(result.words)){
          result.words = result.words.split(",").map(function(item) {
            return item.trim();
          });
        }  
        this.listService.editList(result,element.name).subscribe((response) => {
          console.log(result)
          this.customLists.splice( this.customLists.indexOf(element), 1 )
          this.customLists.push(result)
        }, error => {
          this.openErrorMessage()
        });
      }  
    });
  }

  deleteCustomList(element:ListData){
    this.listService.deleteList(element.name).subscribe(result=>{
      console.log(element)
      console.log(this.customLists)
      this.customLists.splice( this.customLists.indexOf(element), 1 )
    },error=>{
      this.openErrorMessage()
     // console.log(`${error.status}: ${JSON.parse(error.error).message}`);
    })
  }

  openErrorMessage() {
    this._snackBar.open("Invalid Data", "close", {
      duration: 3000,
    });
  }
  
  logOut(){
    console.log("gsda") 
    this.authenticationService.logout()
    this.router.navigate(['']);
  }

  createGame(){
    console.log("s")
    this.form.value
    console.log(this.newGameName)
    var gameOptions=this.form.value
    gameOptions.customListNames = this.customWordListSelected;
    console.log(gameOptions)
    this.gameData.gameName=this.newGameName;
    this.gameData.action="created";
    this.gameData.gameOptions=gameOptions;
    this.router.navigate([`/game_lobby`])
  }

  joinGame(){
    this.gameData.gameName=this.joinGameName;
    this.gameData.action="joined";
    this.router.navigate([`/game_lobby`])
  }

  onNewGameInput(value: string){
    this.newGameName = value
    console.log(value)
   // this.gameService.save(value)
  }

  onJoinGameInput(value: string){
    this.joinGameName = value
    console.log(value)
  }

}


@Component({
  selector: 'list-dialog',
  templateUrl: 'list-dialog.html',
})
export class ListDialog {


  constructor(
    public dialogRef: MatDialogRef<ListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ListData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
