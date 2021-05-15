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


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListPeopleComponent } from './static/people/list-people/list-people.component';
import { EditPersonComponent } from './static/people/edit-person/edit-person.component';
import { ListSprintsComponent } from './static/sprints/list-sprints/list-sprints.component';
import { FinanceReportComponent } from './reports/finance-report/finance-report.component';
import { TimeBookingSummaryComponent } from './reports/time-booking-summary/time-booking-summary.component';
import { ContractorCapitalisationSummaryComponent } from './reports/contractor-capitalisation-summary/contractor-capitalisation-summary.component';
import { TimeBookingExceptionsComponent } from './reports/time-booking-exceptions/time-booking-exceptions.component';
import { ForecastAdminComponent } from './forecast/forecast-admin/forecast-admin.component';
import { EditForecastEntriesComponent } from './forecast/edit-forecast-entries/edit-forecast-entries.component';
import { ScenarioAdminComponent } from './forecast/scenario-admin/scenario-admin.component';
import { ScenarioEditComponent } from './forecast/scenario-edit/scenario-edit.component';
import { ListProjectsComponent } from './static/projects/list-projects/list-projects.component';
import { ListBudgetLinesComponent } from './static/budget-lines/list-budget-lines/list-budget-lines.component';
import { TimeEntryReportComponent } from './reports/time-entry-report/time-entry-report.component';

const routes: Routes = [ {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'list-people',
    component: ListPeopleComponent
  }, {
    path: 'edit-person',
    component: EditPersonComponent
  }, {
    path: 'list-projects',
    component: ListProjectsComponent
  }, {
    path: 'list-budget-lines',
    component: ListBudgetLinesComponent
  }, {
    path: 'list-sprints',
    component: ListSprintsComponent
  }, {
    path: 'time-booking-summary',
    component: TimeBookingSummaryComponent
  }, {
    path: 'time-booking-exceptions',
    component: TimeBookingExceptionsComponent
  }, {
    path: 'time-booking-exceptions/:sprintName',
    component: TimeBookingExceptionsComponent
  }, {
    path: 'finance-report',
    component: FinanceReportComponent
  }, {
    path: 'time-entry-report',
    component: TimeEntryReportComponent
  }, {
    path: 'contractor-capitalisation-summary',
    component: ContractorCapitalisationSummaryComponent
  }, {
    path: 'forecast-admin',
    component: ForecastAdminComponent
  }, {
    path: 'scenario-admin',
    component: ScenarioAdminComponent
  }, {
    path: 'forecast-entry/:forecastId',
    component: EditForecastEntriesComponent
  }, {
    path: 'scenario-edit/:scenarioId',
    component: ScenarioEditComponent
  }, {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
