import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router} from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login-Daten:', this.loginForm.value);
      this.router.navigate(['/agenda']);
      
    }
  }
}


