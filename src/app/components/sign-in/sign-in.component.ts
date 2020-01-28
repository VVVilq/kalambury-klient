import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signUpForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {

    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],

    });
  }


  onSubmit() {
    console.log("submit")
    this.submitted = true;

    // stop here if form is invalid
    if (this.signUpForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.signUp(this.signUpForm.value).subscribe((response)=>{
      
    },status=>{
      if(status=="OK"){
        this.openErrorMessage("Succesfull registration")
      }else{
        this.openErrorMessage("invalid data")
      }
      
    })
      
  }

  openErrorMessage(message:string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
    });
  }
}
