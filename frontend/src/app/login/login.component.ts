import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {NgIf, NgOptimizedImage} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButton, HttpClientModule, NgIf, MatIconButton],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  imagePath = "assets/icons/ki_logo.png";
  username: string = '';
  password: string = '';


  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      console.log("User already logged in, redirecting...");
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    console.log("Component has been destroyed");
  }

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

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
}
