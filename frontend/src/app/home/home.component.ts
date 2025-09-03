import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LogoutService } from '../services/logout.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private logoutService: LogoutService,
    private authService: AuthService,
    private router: Router
  ) {}

  onLogout(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Brak userId w tokenie');
      return;
    }

    this.logoutService.removeHashSession(userId).subscribe({
      next: (res) => {
        console.log('Wylogowano:', res);
        localStorage.removeItem('token');
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Błąd przy logout:', err);
      }
    });
  }
}
