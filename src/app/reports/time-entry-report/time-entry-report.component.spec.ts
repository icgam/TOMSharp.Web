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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { AppConfig } from 'src/app/app-config';

import { TimeEntryReportComponent } from './time-entry-report.component';

describe('TimeEntryReportComponent', () => {
  let component: TimeEntryReportComponent;
  let fixture: ComponentFixture<TimeEntryReportComponent>;
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
      declarations: [ TimeEntryReportComponent],
      imports: [
        AgGridModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        FontAwesomeModule,
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
    fixture = TestBed.createComponent(TimeEntryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
