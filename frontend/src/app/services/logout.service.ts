import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  private apiUrl = 'http://localhost:3100/api/user/logout';

  constructor(private http: HttpClient) {}

  removeHashSession(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
