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


import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListPeopleComponent } from './static/people/list-people/list-people.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessageComponent } from './message/message.component';
import { EditPersonComponent } from './static/people/edit-person/edit-person.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListSprintsComponent } from './static/sprints/list-sprints/list-sprints.component';
import { FormsModule } from '@angular/forms';
import { FinanceReportComponent } from './reports/finance-report/finance-report.component';
import { TimeBookingSummaryComponent } from './reports/time-booking-summary/time-booking-summary.component';
import { ListFinanceProjectMappingsComponent } from './static/financeprojectmappings/list-finance-project-mappings/list-finance-project-mappings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContractorCapitalisationSummaryComponent } from './reports/contractor-capitalisation-summary/contractor-capitalisation-summary.component';
import { AgGridModule } from 'ag-grid-angular';
import {
  AUTH_SERVICE,
  AuthService,
  MsalAuthService,
  AuthInterceptor,
} from './framework';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Configuration, CacheLocation } from 'msal';
import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration,
  BroadcastService,
} from '@azure/msal-angular';
import { TimeBookingExceptionsComponent } from './reports/time-booking-exceptions/time-booking-exceptions.component';
import { ForecastAdminComponent } from './forecast/forecast-admin/forecast-admin.component';
import { EditForecastEntriesComponent } from './forecast/edit-forecast-entries/edit-forecast-entries.component';
import { ScenarioAdminComponent } from './forecast/scenario-admin/scenario-admin.component';
import { ScenarioEditComponent } from './forecast/scenario-edit/scenario-edit.component';
import { ScenarioReportComponent } from './reports/scenario-report/scenario-report.component';
import { AppConfig } from './app-config';
import { ListProjectsComponent } from './static/projects/list-projects/list-projects.component';
import { ListBudgetLinesComponent } from './static/budget-lines/list-budget-lines/list-budget-lines.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeEntryReportComponent } from './reports/time-entry-report/time-entry-report.component';



function MSALConfigFactory(appConfig: AppConfig): Configuration {
  return {
    auth: {
      clientId: appConfig.auth.clientId,
      authority: appConfig.auth.authority,
      validateAuthority: true,
      redirectUri: appConfig.auth.redirectUri,
      postLogoutRedirectUri: appConfig.auth.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: <CacheLocation>appConfig.cache.cacheLocation,
    },
  };
}

function MSALAngularConfigFactory(appConfig: AppConfig): MsalAngularConfiguration {
  const protectedResourceMap: [string, string[]][] = [
    [
      appConfig.resources.tomSharpApi.resourceUri,
      [appConfig.resources.tomSharpApi.resourceScope],
    ],
    [
      appConfig.resources.graphApi.resourceUri,
      [appConfig.resources.graphApi.resourceScope],
    ],
  ];
  return {
    popUp: true,
    consentScopes: [
      appConfig.resources.tomSharpApi.resourceScope,
      appConfig.resources.graphApi.resourceScope,
      ...appConfig.scopes.loginRequest,
    ],
    unprotectedResources: [],
    protectedResourceMap,
    extraQueryParameters: {},
  };
}

export function authFactory(msal: MsalService, http: HttpClient): AuthService {
  return new MsalAuthService(msal);
  // return new ImpersonationAuthService(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ListPeopleComponent,
    HeaderComponent,
    DashboardComponent,
    MessageComponent,
    EditPersonComponent,
    ListSprintsComponent,
    FinanceReportComponent,
    TimeBookingSummaryComponent,
    ListFinanceProjectMappingsComponent,
    ContractorCapitalisationSummaryComponent,
    TimeBookingExceptionsComponent,
    ForecastAdminComponent,
    EditForecastEntriesComponent,
    ScenarioAdminComponent,
    ScenarioEditComponent,
    ScenarioReportComponent,
    ListProjectsComponent,
    ListBudgetLinesComponent,
    TimeEntryReportComponent
  ],
  imports: [
    AgGridModule.withComponents([]),
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    MsalModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    MsalService,
    BroadcastService,
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory,
      deps: [AppConfig]
    },
    {
      provide: AUTH_SERVICE,
      useFactory: authFactory,
      deps: [MsalService, HttpClient],
    },

    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory,
      deps: [AppConfig]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      deps: [AUTH_SERVICE, BroadcastService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
