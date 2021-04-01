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


import { Component, OnInit } from '@angular/core';
import { Forecast, Scenario } from '../../entities';
import { CommsService } from '../../comms.service';
import { MessageService } from 'src/app/message.service';
import { faPlus, faEllipsisH, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forecast-admin',
  templateUrl: './forecast-admin.component.html',
  styleUrls: ['./forecast-admin.component.css']
})
export class ForecastAdminComponent implements OnInit {

  faPlus = faPlus;
  faEllipsisH = faEllipsisH;
  faTimesCircle = faTimesCircle;
  showSnapshotForm = false;
  months: number;
  extrapolateRemainingTime = false;
  financeYears: string[] = [ 'FY20', 'FY21', 'FY22'];
  financeYear = 'FY21';
  scenario: Scenario;
  scenarios: Scenario[];

  forecasts: Forecast[];

  constructor(private router: Router, private commsService: CommsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.downloadForecasts();
    this.downloadScenarios();
  }

  downloadForecasts(): void {
    this.commsService.getForecasts().subscribe(data => {
      this.forecasts = data.sort((a,b) => a.name.localeCompare(b.name));
    });
  }

  downloadScenarios(): void {
    this.commsService.getScenarios().subscribe(data => {
      this.scenarios = data.sort((a,b) => a.name.localeCompare(b.name));
    });
  }

  createNewForecast(event: any): void {
    if (event.target.value) {
      const forecast: Forecast = { id: null, name: event.target.value, created: null, updated: null, entries: null, financeYear: 'FY21' };
      this.commsService.addForecast(forecast).subscribe(data => {
        this.downloadForecasts();
      }, error => { 
        this.messageService.add("Error: " + JSON.stringify(error))
      });
    }
  }

  deleteForecast(forecast: Forecast): void {
    if (confirm("Deleting forecast: " + forecast.name + ". Are you sure? This action is irrevocable.")) {
      this.commsService.deleteForecast(forecast).subscribe(data => {
        this.downloadForecasts();
      }, error => {
        this.messageService.add("Error: " + JSON.stringify(error));
      });
    }
  }

  createNewSnapshot(): void {
    let params = {};
    params["financeYear"] = this.financeYear;
    params["months"] = this.months;
    if (this.extrapolateRemainingTime) {
      params["extrapolateRemainingTime"] = this.extrapolateRemainingTime;
      params["scenarioId"] = this.scenario?.id;
    }
    console.log("Params: " + JSON.stringify(params));
    this.commsService.createSnapshot(params)
    .subscribe(data => {console.log(data); this.downloadForecasts()}, error => {
      console.error();
    });
  }
}
