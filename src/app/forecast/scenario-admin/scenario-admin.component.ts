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
import { Scenario } from '../../entities';
import { CommsService } from '../../comms.service';
import { MessageService } from 'src/app/message.service';
import { faPlus, faEllipsisH, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-scenario-admin',
  templateUrl: './scenario-admin.component.html',
  styleUrls: ['./scenario-admin.component.css']
})
export class ScenarioAdminComponent implements OnInit {

  faPlus = faPlus;
  faEllipsisH = faEllipsisH;
  faTimesCircle = faTimesCircle;
  financeYears: string[] = [ 'FY20', 'FY21'];

  scenarios: Scenario[];

  constructor(private router: Router, private commsService: CommsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.downloadScenarios();
  }

  downloadScenarios(): void {
    this.commsService.getScenarios().subscribe(data => {
      this.scenarios = data.sort((a,b) => a.name.localeCompare(b.name));
    });
  }

  createNewScenario(event: any): void {
    if (event.target.value) {
      const scenario: Scenario = { id: null, name: event.target.value, created: null, updated: null, forecasts: null, financeYear: 'FY21', projects: null };
      this.commsService.addScenario(scenario).subscribe(data => {
        this.downloadScenarios();
      }, error => { 
        this.messageService.add("Error: " + JSON.stringify(error))
      });
    }
  }

  deleteScenario(scenario: Scenario): void {
    if (confirm("Deleting scenario: " + scenario.name + ". Are you sure? This action is irrevocable.")) {
      this.commsService.deleteScenario(scenario).subscribe(data => {
        this.downloadScenarios();
      }, error => {
        this.messageService.add("Error: " + JSON.stringify(error));
      });
    }
  }
}

