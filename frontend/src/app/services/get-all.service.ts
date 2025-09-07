import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  username: string;
  active: boolean;
}

interface UsersStatus {
  online: User[];
  offline: User[];
}

@Injectable({
  providedIn: 'root'
})
export class GetAllService {

  private apiUrl: string = 'http://localhost:3100/api/user/all/status';
  constructor(private httpClient : HttpClient ) {}


  getAllUsersStatus(): Observable<UsersStatus> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.httpClient.get<UsersStatus>(this.apiUrl, { headers, withCredentials: true });
  }

}
