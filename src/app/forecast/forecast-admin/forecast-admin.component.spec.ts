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
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { AppConfig } from 'src/app/app-config';

import { ForecastAdminComponent } from './forecast-admin.component';

describe('ForecastAdminComponent', () => {
  let component: ForecastAdminComponent;
  let fixture: ComponentFixture<ForecastAdminComponent>;

  let appConfig: AppConfig = {
    baseApiUrl: '',
    auth: null,
    cache: null,
    scopes: null,
    resources: null,
    version: null
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastAdminComponent ],
      imports: [
        FontAwesomeModule,
        RouterTestingModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        FormsModule
      ],
      providers: [
        {
          provide: AppConfig,
          useValue: appConfig
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
