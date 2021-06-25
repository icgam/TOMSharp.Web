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


import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from './app-config';
import { Person, Sprint, FinanceSummary, TimeBookingSummary, SprintSummary, ContractorCapitalisationSummary, TimeBookingException, Forecast, ForecastEntry, Scenario, Project, BudgetLine } from './entities';

@Injectable({
  providedIn: 'root'
})
export class CommsService {

  constructor(private http: HttpClient, private messageService: MessageService, private appConfig: AppConfig) {

  }

  baseUrl = this.appConfig.baseApiUrl + '/api';
  basePeopleUrl = this.baseUrl + '/people/';
  baseSprintsUrl = this.baseUrl + '/sprints/';
  baseActionsUrl = this.baseUrl + '/actions/';
  baseFinanceSummaryUrl = this.baseUrl + '/FinanceSummary/';
  baseTimeBookingSummaryUrl = this.baseUrl + '/TimeBookingSummary/';
  baseSprintSummaryUrl = this.baseUrl + '/SprintSummary/';
  baseContractorCapitalisationSummaryUrl = this.baseUrl + '/ContractorCapitalisationSummary/';
  baseTimeBookingExceptionsUrl = this.baseUrl + '/TimeBookingExceptions/';
  baseForecastsUrl = this.baseUrl + '/Forecasts/';
  baseScenariosUrl = this.baseUrl + '/Scenarios/';
  baseProjectsUrl = this.baseUrl + '/Projects/';
  baseBudgetLinesUrl = this.baseUrl + '/BudgetLines/';
  baseTimeEntryReportUrl = this.baseUrl + '/TimeEntryReport/';
  baseExportUrl = this.baseUrl + '/ImportExport/';
  
  public loginUrl = this.baseUrl + '/People';

  getProjects(financeYear: string): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseProjectsUrl + "FinanceYear/" + financeYear);
  }

  updateProject(project: Project): Observable<string> {
    this.messageService.add("Comms: updating Project: " + project);
    return this.http.put<string>(this.baseProjectsUrl + project.id, project);
  }

  getBudgetLines(financeYear: string): Observable<BudgetLine[]> {
    return this.http.get<BudgetLine[]>(this.baseBudgetLinesUrl + "FinanceYear/" + financeYear);
  }

  addBudgetLine(budgetLine: BudgetLine): Observable<BudgetLine> {
    return this.http.post<BudgetLine>(this.baseBudgetLinesUrl, budgetLine);
  }

  updateBudgetLine(budgetLine: BudgetLine): Observable<string> {
    this.messageService.add("Comms: updating Budget Line: " + JSON.stringify(budgetLine));
    return this.http.put<string>(this.baseBudgetLinesUrl + budgetLine.id, budgetLine);
  }

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(this.basePeopleUrl);
  }

  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(this.basePeopleUrl + id);
  }

  updatePerson(person: Person): Observable<string> {
    this.messageService.add("Comms: updating Person: " + person);
    return this.http.put<string>(this.basePeopleUrl + person.id, person);
  }
  
  addPerson(person: Person): Observable<string> {
    this.messageService.add("Comms: adding Person: " + person);
    return this.http.post<string>(this.basePeopleUrl, person);
  }

  deletePerson(person: Person): Observable<string> {
    this.messageService.add("Comms: deleting Person: " + person);
    return this.http.delete<string>(this.basePeopleUrl + person.id);
  }

  getForecasts(): Observable<Forecast[]> {
    return this.http.get<Forecast[]>(this.baseForecastsUrl);
  }

  getForecastById(id: number): Observable<Forecast> {
    return this.http.get<Forecast>(this.baseForecastsUrl + id);
  }

  updateForecast(forecast: Forecast): Observable<string> {
    this.messageService.add("Comms: updating Forecast: " + forecast);
    return this.http.put<string>(this.baseForecastsUrl + forecast.id, forecast);
  }
  
  addForecast(forecast: Forecast): Observable<string> {
    this.messageService.add("Comms: adding Forecast: " + forecast);
    return this.http.post<string>(this.baseForecastsUrl, forecast);
  }

  deleteForecast(forecast: Forecast): Observable<string> {
    this.messageService.add("Comms: deleting Forecast: " + forecast);
    return this.http.delete<string>(this.baseForecastsUrl + forecast.id);
  }

  createSnapshot(params: any): Observable<string> {
    this.messageService.add("Comms: creating new snapshot");
    return this.http.get<string>(this.baseForecastsUrl + "createSnapshot", { params: params });
  }

  getScenarios(): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(this.baseScenariosUrl);
  }

  getScenarioById(id: number): Observable<Scenario> {
    return this.http.get<Scenario>(this.baseScenariosUrl + id);
  }

  updateScenario(scenario: Scenario): Observable<string> {
    this.messageService.add("Comms: updating Scenario: " + scenario);
    return this.http.put<string>(this.baseScenariosUrl + scenario.id, scenario);
  }
  
  addScenario(scenario: Scenario): Observable<string> {
    this.messageService.add("Comms: adding Scenario: " + JSON.stringify(scenario));
    return this.http.post<string>(this.baseScenariosUrl, scenario);
  }

  deleteScenario(scenario: Scenario): Observable<string> {
    this.messageService.add("Comms: deleting Scenario: " + scenario);
    return this.http.delete<string>(this.baseScenariosUrl + scenario.id);
  }

  getForecastAvailableProjects():Observable<string[]> {
    this.messageService.add("Comms: getting available projects");
    return this.http.get<string[]>(this.baseForecastsUrl + "availableprojects");
  }

  getTimeEntryReport(financeYear: string): Observable<any[]> {
    this.messageService.add("Comms: getting time entry report for finance year: " + financeYear);
    return this.http.get<string[]>(this.baseTimeEntryReportUrl + financeYear);
  }

  downloadTimeEntryReportExcel(financeYear: string): void {
    let url = this.baseTimeEntryReportUrl + financeYear + "/Excel";
    window.open(url, "_blank");
  }

  getFinanceSummaries(financeYear: string, includeNonCapitalised: boolean): Observable<FinanceSummary[]> {
    let url = this.baseFinanceSummaryUrl + financeYear + "?includeNonCapitalised=" + includeNonCapitalised;
    this.messageService.add("Comms: downloading finance summary for year: " + financeYear + "(" + url + ")");
    return this.http.get<FinanceSummary[]>(url);
  }

  downloadFinanceSummariesExcel(financeYear: string, includeNonCapitalised: boolean): void {
    let url = this.baseFinanceSummaryUrl + financeYear + "/Excel" + "?includeNonCapitalised=" + includeNonCapitalised;
    window.open(url, "_blank");
  }
  
  getTimeBookingSummaries(financeYear: string): Observable<TimeBookingSummary[]> {
    let url = this.baseTimeBookingSummaryUrl + financeYear;
    this.messageService.add("Comms: downloading time booking summary for year: " + financeYear + "(" + url + ")");
    return this.http.get<TimeBookingSummary[]>(url);
  }

  downloadTimeBookingSummariesExcel(financeYear: string): void {
    window.open(this.baseTimeBookingSummaryUrl + financeYear + "/Excel", "_blank");
  }

  getSprintSummaries(financeYear: string): Observable<SprintSummary[]> {
    let url = this.baseSprintSummaryUrl + financeYear;
    this.messageService.add("Comms: downloading sprint summary for year: " + financeYear + "(" + url + ")");
    return this.http.get<SprintSummary[]>(url);
  }

  getContractorCapitalisationSummaries(financeYear: string): Observable<ContractorCapitalisationSummary[]> {
    let url = this.baseContractorCapitalisationSummaryUrl + financeYear;
    this.messageService.add("Comms: downloading contractor capitalisation summary for year: " + financeYear + "(" + url + ")");
    return this.http.get<ContractorCapitalisationSummary[]>(url);
  }

  downloadContractorCapitalisationSummariesExcel(financeYear: string): void {
    let url = this.baseContractorCapitalisationSummaryUrl + financeYear + "/Excel";
    window.open(url, "_blank");
  }

  getTimeBookingExceptions(sprint: string, includeCompleted: boolean): Observable<TimeBookingException[]> {
    let url = this.baseTimeBookingExceptionsUrl + sprint + "?includeCompleted=" + includeCompleted;
    this.messageService.add("Comms: downloading time booking exceptions for sprint: " + sprint + "(" + url + ")");
    return this.http.get<TimeBookingException[]>(url);
  }

  downloadTimeBookingExceptionsExcel(sprint: string, includeCompleted: boolean): void {
    let url = this.baseTimeBookingExceptionsUrl + sprint + "/Excel" + "?includeCompleted=" + includeCompleted;
    window.open(url, "_blank");
  }

  getSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(this.baseSprintsUrl);
  }

  getSprintById(id: number): Observable<Sprint> {
    return this.http.get<Sprint>(this.baseSprintsUrl + id);
  }

  updateSprint(sprint: Sprint): Observable<string> {
    this.messageService.add("Comms: updating Sprint: " + sprint);
    return this.http.put<string>(this.baseSprintsUrl + sprint.id, sprint);
  }

  downloadTimeEntries(sprintName: string): Observable<any> {
    this.messageService.add("Comms: downloadingTimeEntry for sprint: " + sprintName);
    return this.http.get<string>(this.baseActionsUrl + "DownloadSprint/" + sprintName);
  }

  generateSprints(): Observable<any> {
    this.messageService.add("Comms: generating sprints.");
    return this.http.get<string>(this.baseActionsUrl + "GenerateSprints");
  }

  downloadAllData(): void {
    let url = this.baseExportUrl;
    window.open(url, "_blank");
  }

  importAllData(files): Observable<HttpEvent<any>> {
    if (files.length === 0)
      return;
  
    const formData = new FormData();
  
    for (const file of files) {
      formData.append(file.name, file);
    }
  
    const uploadReq = new HttpRequest('POST', this.baseExportUrl, formData, {
      reportProgress: true,
    });
  
    return this.http.request(uploadReq);
  }
}
