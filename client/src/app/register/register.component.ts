import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  maxDate = new Date();

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      knownAs: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12),
        this.hasNumber(), this.hasLowerCase(), this.hasUpperCase()]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
      dateOfBirth: ['', Validators.required],
      publicProfile: ['private', Validators.required]
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true};
    }
  }

  hasNumber(): ValidatorFn{
    return (control: AbstractControl) => {
      return /\d/.test(control.value) === true ? null : {hasNumber: true};
    }
  }

  hasLowerCase(): ValidatorFn{
    return (control: AbstractControl) => {
      return /[a-z]/.test(control.value) === true ? null : {hasLowerCase: true};
    }
  }

  hasUpperCase(): ValidatorFn{
    return (control: AbstractControl) => {
      return /[A-Z]/.test(control.value) === true ? null : {hasUpperCase: true};
    }
  }

  hasOnlyLettersAndSpaces(): ValidatorFn{
    return (control: AbstractControl) => {
      return /^[a-zA-Z ]*$/.test(control.value) === true ? null : {hasOnlyLettersAndSpaces: true};
    }
  }

  hasOnlyNumbers(): ValidatorFn{
    return (control: AbstractControl) => {
      return /^[0-9]*$/ .test(control.value) === true ? null : {hasOnlyNumbers: true};
    }
  }

  register(){
    const dateOfBirth = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({dateOfBirth: dateOfBirth});
    const publicProfile = this.getBoolean(this.registerForm.get('publicProfile')?.value);
    this.registerForm.patchValue({publicProfile: publicProfile});

    this.accountService.register(this.registerForm.value).subscribe({
      next: _ => this.router.navigateByUrl('/'),
      error: error => this.validationErrors = error
    })
  }

  private getDateOnly(dateOfBirth: string | undefined){
    if(!dateOfBirth) return;
    return new Date(dateOfBirth).toISOString().slice(0,10);
  }

  private getBoolean(publicProfile: string | undefined){
    if(publicProfile == "public") return true;
    return false;
  }
}
