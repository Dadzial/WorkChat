import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface tokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3100/api/user';

  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string): Observable<tokenResponse> {
    return this.httpClient.post<tokenResponse>(`${this.apiUrl}/auth`, {
      login: username,
      password
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (e) {
      console.error('Error:', e);
      return null;
    }
  }
  getDisplayName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name || null;
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  }

  isTokenExpired(token?: string): boolean {
    const t = token || this.getToken();
    if (!t) return true;

    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (!payload.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (e) {
      console.error('Error decoding token:', e);
      return true;
    }
  }

}
