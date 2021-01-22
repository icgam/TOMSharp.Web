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


import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { from } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { BroadcastService } from '@azure/msal-angular';
import { AuthResponse, ServerHashParamKeys } from 'msal';
import { AUTH_SERVICE, AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(AUTH_SERVICE)
    private auth: AuthService,
    private broadcastService: BroadcastService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const scopes = this.auth.getScopesForEndpoint(req.url);

    if (!scopes) {
      return next.handle(req);
    }

    let token: string;

    // Acquire a token for this request, and attach as proper auth header.
    return from(
      this.auth
        .acquireTokenSilent({ scopes })
        .then((response: AuthResponse) => {
          token =
            response.tokenType === ServerHashParamKeys.ID_TOKEN
              ? response.idToken.rawIdToken
              : response.accessToken;
          const authHeader = `Bearer ${token}`;
          return req.clone({
            setHeaders: {
              Authorization: authHeader,
            },
          });
        })
    ).pipe(
      mergeMap((nextReq) => next.handle(nextReq)),
      tap(
        (event) => {},
        (err) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.auth.clearCacheForScope(token);
            this.broadcastService.broadcast('msal:notAuthorized', err.message);
          }
        }
      )
    );
  }
}