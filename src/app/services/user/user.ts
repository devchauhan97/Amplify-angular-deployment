import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_API_URL } from '../../config/api.config';

export type UserRecord = {
  user_id: number;
  user_name: string;
};

@Injectable({
  providedIn: 'root',
})
export class User {
  private http = inject(HttpClient);

  getUser(): Observable<UserRecord[]> {
    return this.http.get<UserRecord[]>(`${BACKEND_API_URL}/users`, {
      withCredentials: true,
    });
  }
  createUser(username: string, password: string): Observable<UserRecord[]> {
    return this.http.post<UserRecord[]>(`${BACKEND_API_URL}/users`, { username, password }, {
      withCredentials: true,
    });
  }
}
