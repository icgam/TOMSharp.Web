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
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Forecast, Sprint, ForecastEntry } from '../../entities';
import { CommsService } from '../../comms.service';
import { MessageService } from 'src/app/message.service';
import { faSave, faUndo, faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-forecast-entries',
  templateUrl: './edit-forecast-entries.component.html',
  styleUrls: ['./edit-forecast-entries.component.css']
})
export class EditForecastEntriesComponent implements OnInit {
  faSave = faSave;
  faUndo = faUndo;
  faWindowClose = faWindowClose;
  enterByFTE: boolean = false;

  constructor(private router: Router, private commsService: CommsService, private messageService: MessageService, private _Activatedroute:ActivatedRoute) { }

  forecast: Forecast;
  forecastId: number;

  projects: string[];
  fullListOfProjects: string[];
  sprints: Sprint[];
  displayEntries: any;

  projectTotals = {};

  ngOnInit(): void {
    var forecastId: number = Number(this._Activatedroute.snapshot.paramMap.get("forecastId"));
    if (forecastId) {
      this.forecastId = forecastId;
      this.downloadForecast();
    }
  }

  downloadForecast(): void {
    this.commsService.getForecastById(this.forecastId).subscribe(
      data => {
        this.forecast = data;
        this.downloadSprints();
        this.populateAvailableProjects();

        this.harvestForecast();
      }
    );
  }

  harvestForecast(): void {
    this.projects = Array.from(new Set(this.forecast.entries.map( entry => entry.project )));

    let result = {};
    this.projectTotals = {};

    this.forecast.entries.forEach(entry => {
      result[entry.project] = result[entry.project] || {};
      result[entry.project][entry.sprint] = {hours: entry.hours, id: entry.id, fte: entry.hours / 80};
      this.projectTotals[entry.project] = this.projectTotals[entry.project] || 0;
      this.projectTotals[entry.project] += entry.hours * 575 / 8 ;
    });

    this.displayEntries = result;
  }

  downloadSprints(): void {
    this.commsService.getSprints().subscribe( data => this.sprints = data
      .filter(element => element.financeYear === this.forecast.financeYear)
      .sort((a,b) => a.name.localeCompare(b.name)) );
  }

  populateAvailableProjects(): void {
    this.commsService.getForecastAvailableProjects().subscribe( data => this.fullListOfProjects = data.filter(element => element != null));
  }

  isNumeric(obj: any): boolean {
    return !isNaN(obj - parseFloat(obj));
  }

  updateEntry(event: any, project: string, sprint: Sprint): void {
    if (project && sprint) {
      let entry = this.forecast.entries.filter(entry => entry.project === project && entry.sprint === sprint.name)[0];
      if (!entry) {
        entry = { id: null, sprint: sprint.name, project: project, hours: 0};
        this.forecast.entries.push(entry);
      }
      let newHours = event.target.value;
      if (this.isNumeric(newHours)) {
        entry.hours = this.enterByFTE?(parseFloat(event.target.value) * 80):parseFloat(event.target.value);
      } else if (newHours === null || newHours == '') {
        event.target.value = 0;
        entry.hours = 0;
      } else {
        event.target.value = this.enterByFTE?entry.hours/80:entry.hours;
      }
      this.harvestForecast();
    }
  }

  addProject(event: any): void {
    const newProjectName = event.target.value;
    console.log(JSON.stringify(event.target.value));
    if (newProjectName && this.forecast && (!this.displayEntries[newProjectName])) {
      this.sprints.forEach(s => {
        this.forecast.entries.push({id: null, project: newProjectName, sprint: s.name, hours: 0});
      })
      this.harvestForecast();
    }
    event.target.selectedIndex = 0;
  }

  saveForecast(): void {
    this.commsService.updateForecast(this.forecast).subscribe(data => console.log(JSON.stringify(data)), error => { 
      this.messageService.add("Error: " + JSON.stringify(error))
    });
    
  }

  reloadForecast(): void {
    this.downloadForecast();
  }

  removeProject(projectName: string): void {
    this.forecast.entries = this.forecast.entries.filter(entry => entry.project != projectName);
    this.harvestForecast();
  }

}
