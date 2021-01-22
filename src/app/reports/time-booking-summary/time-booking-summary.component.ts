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
import { MessageService } from '../../message.service';
import { CommsService } from '../../comms.service';
import { TimeBookingSummary } from '../../entities';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-time-booking-summary',
  templateUrl: './time-booking-summary.component.html',
  styleUrls: ['./time-booking-summary.component.css']
})
export class TimeBookingSummaryComponent implements OnInit {
  faFileExcel = faFileExcel;

  financeYears: string[] = [ 'FY20', 'FY21'];
  financeYear = 'FY21';
  timeBookingSummaries: TimeBookingSummary[];

  timeBookings = {};
  sprints: string[];
  people: string[];

  constructor(private messageService: MessageService, private commsService: CommsService) { }

  ngOnInit(): void {
    this.getTimeBookingSummaries();
  }

  chopOffSprint(sprintName: string): string {
    if (sprintName?.indexOf(' ') > -1) {
      return sprintName.split(' ')[1];
    } else {
      return sprintName;
    }
  }

  getTimeBookingSummaries(): void {
    this.commsService.getTimeBookingSummaries(this.financeYear).subscribe(data => {
      this.timeBookingSummaries = data;
      this.sprints = [...new Set(data.map(t => t.sprint))].sort();
      this.people = [...new Set(data.map(t => t.person))].sort();
      this.timeBookingSummaries.forEach(tbs => {
        if (!this.timeBookings[tbs.person]) {
          this.timeBookings[tbs.person] = {};
        }
        this.timeBookings[tbs.person][tbs.sprint] = tbs.hours;
      });
    });
  }

  downloadExcel(): void {
    this.commsService.downloadTimeBookingSummariesExcel(this.financeYear);
  }

}
