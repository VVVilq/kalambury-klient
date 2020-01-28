import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { AuthGuard } from './guards/auth.guard';
import { GameLobbyComponent } from './components/game-lobby/game-lobby.component';


const routes: Routes = [{
  path: '', 
  component: LogInComponent 
},{
  path: 'sign_in',
  component: SignInComponent
},{
  path: 'game_menu',
  component: GameMenuComponent,
  canActivate: [AuthGuard]
},
{ 
  path: 'game_lobby',
  component: GameLobbyComponent ,
  canActivate:[AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
