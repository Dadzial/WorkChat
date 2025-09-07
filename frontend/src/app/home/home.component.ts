import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import { Router } from '@angular/router';
import { LogoutService } from '../services/logout.service';
import { AuthService } from '../services/auth.service';
import { GetAllService } from '../services/get-all.service';

export interface User {
  username: string;
  active: boolean;
}

export interface UsersStatus {
  online: User[];
  offline: User[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, NgIf, NgForOf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  public displayName: string = '';
  public showUsersMenu: boolean = false;
  public onlineUsers: User[] = [];
  public offlineUsers: User[] = [];

  constructor(
    private logoutService: LogoutService,
    private authService: AuthService,
    private router: Router,
    private getAllService: GetAllService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      console.log("User already logged in, redirecting...");
      this.router.navigate(['/home']);
    }

    const name = this.authService.getDisplayName();
    this.displayName = name || '';
  }

  ngAfterViewInit(): void {
    console.log('View of component has been rendered');
  }

  ngOnDestroy(): void {
    console.log('Component has been destroyed');
  }

  toggleUsersMenu(): void {
    this.showUsersMenu = !this.showUsersMenu;

    if (this.showUsersMenu) {
      this.getAllService.getAllUsersStatus().subscribe({
        next: (res: UsersStatus) => {
          this.onlineUsers = res.online;
          this.offlineUsers = res.offline;
          console.log('Online:', this.onlineUsers, 'Offline:', this.offlineUsers);

        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.onlineUsers = [];
          this.offlineUsers = [];
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.showUsersMenu &&
      !target.closest('.users-menu') &&
      !target.closest('.users-button')) {
      this.showUsersMenu = false;
    }
  }

  onLogout(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.clearAndRedirect();
      return;
    }

    this.logoutService.removeHashSession(userId).subscribe({
      next: () => this.clearAndRedirect(),
      error: () => this.clearAndRedirect()
    });
  }

  private clearAndRedirect(): void {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
