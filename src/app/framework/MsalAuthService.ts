/**
    Copyright (C) 2021 Intermediate Capital Group
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/


import { MsalService } from '@azure/msal-angular';
import { AuthResponse, AuthenticationParameters } from 'msal';
import { AuthService, User } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

export class MsalAuthService implements AuthService {
  user: User = null;

  private userSubject = new BehaviorSubject<User>(null);

  constructor(private auth: MsalService) {}

  public currentUser: Observable<User> = this.userSubject.asObservable();

  login(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      if (this.user) {
        return resolve(this.user);
      }

      return this.auth.loginPopup().then((p) => {
        this.user = {
          name: p.account.name,
          email: p.account.userName
        }
        this.userSubject.next(this.user);
        resolve(this.user);
      });
    });
  }

  consent(url: string): Promise<any> {
    return this.auth.acquireTokenPopup({
      scopes: this.auth.getScopesForEndpoint(url),
    });
  }

  acquireTokenSilent(request: AuthenticationParameters): Promise<AuthResponse> {
    return this.auth.acquireTokenSilent(request);
  }

  clearCacheForScope(accessToken: string): void {
    this.auth.clearCacheForScope(accessToken);
  }

  getScopesForEndpoint(endpoint: string): Array<string> {
    return this.auth.getScopesForEndpoint(endpoint);
  }
}