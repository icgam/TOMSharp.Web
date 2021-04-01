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
import { CommsService } from '../comms.service';
import { MessageService } from '../message.service';
import { DateConstants, SprintSummary } from '../entities';
import { FormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { faSync } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  faSync = faSync;

  sprints: SprintSummary[];
  buttonsDisabled: boolean = false;
  financeYears: string[] = DateConstants.FINANCE_YEARS;
  financeYear = DateConstants.CURRENT_FINANCE_YEAR;

  constructor(private messageService: MessageService, private commsService: CommsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.downloadSprintSummaries();
  }

  downloadSprintSummaries(): void {
    this.commsService.getSprintSummaries(this.financeYear).subscribe(data => {
      this.sprints = data.sort((a,b) => a.name.localeCompare(b.name));
      this.sprints.forEach(s => {
        if (new Date(s.endDate).getTime() <= Date.now()) {
          this.commsService.getTimeBookingExceptions(s.name, false).subscribe(data => {
            s.exceptionCount = data
              .filter(tbe => (tbe.isCorrect == false))
              .length;
          });
        }
      });
    });
  }

  downloadSprint(sprintName: string): void {
    if (this.buttonsDisabled) {
      return;
    }
    this.buttonsDisabled = true;
    this.commsService.downloadTimeEntries(sprintName)
    .subscribe(() => {
      this.messageService.success("Downloaded time entries for sprint " + sprintName);
      this.buttonsDisabled = false;
      this.downloadSprintSummaries();
    }, error => { 
      this.messageService.error("Error downloading sprint entries for sprint: " + sprintName, error);
    });
  }
}
