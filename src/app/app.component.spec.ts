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
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header/header.component';
import { AppConfig } from './app-config';
import { AppComponent } from './app.component';
import {
  AUTH_SERVICE,
  AuthService
} from './framework';
import { ToastrModule } from 'ngx-toastr';



describe('AppComponent', () => {

  let appConfig: AppConfig = {
    baseApiUrl: '',
    auth: null,
    cache: null,
    scopes: null,
    resources: null,
    version: null
  };

  let mockAuthService: AuthService = {
    login: null,
    consent: null,
    acquireTokenSilent: null,
    clearCacheForScope: null,
    getScopesForEndpoint: null,
    currentUser: null
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ToastrModule.forRoot()
      ],
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: mockAuthService
        },
        {
          provide: AppConfig,
          useValue: appConfig
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TOMSharp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('TOMSharp');
  });


});
