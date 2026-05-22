import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl);
  }

  addUser(user: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, user);
  }

  updateUser(user: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(userId: number): Observable<UserProfile> {
    return this.http.delete<UserProfile>(`${this.apiUrl}/${userId}`);
  }
}
