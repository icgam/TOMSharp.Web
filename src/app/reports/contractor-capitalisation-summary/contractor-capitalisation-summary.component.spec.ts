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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { AppConfig } from 'src/app/app-config';
import { CommsService } from 'src/app/comms.service';
import { ContractorCapitalisationSummary } from 'src/app/entities';

import { ContractorCapitalisationSummaryComponent } from './contractor-capitalisation-summary.component';

describe('Contractor Capitalisation Summary', () => {
  let component: ContractorCapitalisationSummaryComponent;
  let fixture: ComponentFixture<ContractorCapitalisationSummaryComponent>;
  let httpMock: HttpTestingController;
  let comms: CommsService;

  let dummyData: ContractorCapitalisationSummary[] = [
    {
      "employer": "Company3",
      "resourceType": "Rt1",
      "financeMonth": "Apr",
      "financeYear": "FY21",
      "capitalised": false,
      "hours": 100.000000,
      "charge": 1000
    }, {
      "employer": "Company1",
      "resourceType": "Rt1",
      "financeMonth": "Apr",
      "financeYear": "FY21",
      "capitalised": false,
      "hours": 100.000000,
      "charge": 1000
    }, {
      "employer": "Company2",
      "resourceType": "Rt1",
      "financeMonth": "Apr",
      "financeYear": "FY21",
      "capitalised": true,
      "hours": 100.000000,
      "charge": 1000
    },
  ]

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
      declarations: [ ContractorCapitalisationSummaryComponent],
      imports: [
        RouterTestingModule,
        AgGridModule,
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(ContractorCapitalisationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
    comms = TestBed.inject(CommsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sprint name formatting', () => {
    expect(component.chopOffSprint(null)).toBe(null);
    expect(component.chopOffSprint("")).toBe("");
    expect(component.chopOffSprint(" ")).toBe("");
    expect(component.chopOffSprint("Sprint ")).toBe("");
    expect(component.chopOffSprint("Sprint1")).toBe("Sprint1");
    expect(component.chopOffSprint("Sprint 1")).toBe("1");
    expect(component.chopOffSprint("Sprint 1 2 3 4")).toBe("1 2 3 4");
  });

  it('default financeYear', () => {
    expect(component.financeYear).toBe("FY21");
  });

  it('download data', () => {
    const request = httpMock.expectOne(comms.baseContractorCapitalisationSummaryUrl + component.financeYear);
    expect(request.request.method).toBe("GET");
    request.flush(dummyData);
    httpMock.verify();

    expect(component.employers).toEqual(['Company1', 'Company2', 'Company3']);
    });
    it('download excel', () => {
      window.open = jest.fn();
      component.downloadExcel();
      expect(window.open).toHaveBeenCalledWith(comms.baseContractorCapitalisationSummaryUrl + component.financeYear + "/Excel", "_blank");
      
    });
});
