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


import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppConfig } from '../app-config';
import { AuthService, AUTH_SERVICE, User } from '../framework';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let appConfig: AppConfig = {
    baseApiUrl: '',
    auth: null,
    cache: null,
    scopes: null,
    resources: null,
    version: {
      "releaseId": "Dev-000",
      "releaseNumber": "0.0.0",
      "releaseNotes": "Dev Build Only",
      "releaseCreated": "Tuesday 10th September 1:23 PM"
    }
  };
  let mockAuthService: AuthService = {
    login: null,
    consent: null,
    acquireTokenSilent: null,
    clearCacheForScope: null,
    getScopesForEndpoint: null,
    currentUser: new Observable<User>(o => o.next({ name: 'test', email: 'test@test.com'}))
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        HttpClientModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: AppConfig, useValue: appConfig },
        { provide: AUTH_SERVICE, useValue: mockAuthService },

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
