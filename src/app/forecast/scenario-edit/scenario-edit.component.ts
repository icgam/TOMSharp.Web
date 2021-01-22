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
import { Scenario, Forecast } from '../../entities';
import { CommsService } from '../../comms.service';
import { MessageService } from 'src/app/message.service';
import { faSave, faUndo, faWindowClose, faArrowUp, faArrowDown, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-scenario-edit',
  templateUrl: './scenario-edit.component.html',
  styleUrls: ['./scenario-edit.component.css']
})
export class ScenarioEditComponent implements OnInit {
  faSave = faSave;
  faUndo = faUndo;
  faWindowClose = faWindowClose;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faPlus = faPlus;

  constructor(private router: Router, private commsService: CommsService, private messageService: MessageService, private _Activatedroute:ActivatedRoute) { }

  scenario: Scenario;
  scenarioId: number;
  projects: string[];
  fullListOfProjects: string[];
  forecasts: Forecast[];
  selectedForecastIds: number[];

  ngOnInit(): void {
    var scenarioId: number = Number(this._Activatedroute.snapshot.paramMap.get("scenarioId"));
    if (scenarioId) {
      this.scenarioId = scenarioId;
      this.downloadScenario();
    }
  }

  downloadScenario(): void {
    this.commsService.getScenarioById(this.scenarioId).subscribe(
      data => {
        this.scenario = data;
        //this.downloadSprints();
        this.populateAvailableProjects();
        this.populateAvailableForecasts();
        this.selectedForecastIds = this.scenario.forecasts.map(f => f.id);
        //this.harvestForecast();
      }
    );
  }

  populateAvailableProjects(): void {
    this.commsService.getForecastAvailableProjects().subscribe( data => this.fullListOfProjects = data.filter(element => element != null));
  }

  populateAvailableForecasts(): void {
    this.commsService.getForecasts().subscribe(data => this.forecasts = data);
  }

  saveScenario(): void {
    this.commsService.updateScenario(this.scenario).subscribe(data => console.log(JSON.stringify(data)), error => { 
      this.messageService.add("Error: " + JSON.stringify(error))
    });
  }

  reloadScenario(): void {
    this.downloadScenario();
  }

  addProjectToScenario(project: string): void {
    this.scenario.projects.push(project);
  }

  addForecastToScenario(forecast: Forecast): void {
    this.scenario.forecasts.push(forecast);
    this.selectedForecastIds.push(forecast.id);
  }

  swapElements(array, indexA, indexB) {
    var tmp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = tmp;
  }

  moveForecastUp(index: number): void {
    if (index > 0) {
      this.swapElements(this.scenario.forecasts, index, index-1);
    }
  }

  moveForecastDown(index: number): void {
    if (index < this.scenario.forecasts.length-1) {
      this.swapElements(this.scenario.forecasts, index, index+1);
    }
  }

  removeForecastFromScenario(index: number): void {
    if (index >= 0 && index < this.scenario.forecasts.length) {
      this.scenario.forecasts.splice(index, 1);
      this.selectedForecastIds = this.scenario.forecasts.map(f => f.id);
    }
  }

  removeProjectFromScenario(index: number): void {
    if (index >= 0 && index < this.scenario.projects.length) {
      console.log("Splicing: " + index);
      this.scenario.projects.splice(index, 1);
    }
  }

}
