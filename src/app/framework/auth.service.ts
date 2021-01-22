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


import { AuthenticationParameters, AuthResponse } from 'msal';
import { Observable } from 'rxjs';

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface User {
  name: string;
  email: string;
}

export interface AuthService {
  login(): Promise<User>;
  consent(url: string): Promise<any>;
  acquireTokenSilent(request: AuthenticationParameters): Promise<AuthResponse>;
  clearCacheForScope(accessToken: string): void;
  getScopesForEndpoint(endpoint: string): Array<string>;
  currentUser: Observable<User>;
}