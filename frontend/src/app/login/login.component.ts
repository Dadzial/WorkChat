import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {NgOptimizedImage} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,MatIconModule, MatButton,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  imagePath = "assets/icons/ki_logo.png";

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService , private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault();
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        console.log('Token:', res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}
