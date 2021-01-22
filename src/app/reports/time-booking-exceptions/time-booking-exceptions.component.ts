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
import { CommsService } from '../../comms.service';
import { Sprint, TimeBookingException } from '../../entities';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-time-booking-exceptions',
  templateUrl: './time-booking-exceptions.component.html',
  styleUrls: ['./time-booking-exceptions.component.css']
})
export class TimeBookingExceptionsComponent implements OnInit {
  faFileExcel = faFileExcel;

  sprints: Sprint[];
  sprint;

  columnDefs = [
    {headerName: 'Person', field: 'person', sortable: true, filter: true },
    {headerName: 'Expected Hours', field: 'expectedHours', sortable: true, filter: true },
    {headerName: 'Actual Hours', field: 'actualHours', sortable: true, filter: true},
    {headerName: 'Exceptions', field: 'errors', sortable: true, filter: true, cellStyle: function(params) {
      if (params.value && params.value != "") {
          return {backgroundColor: 'red'};
      } else {
          return null;
      }
    }}
  ];

  timeBookingExceptions: Observable<TimeBookingException[]>;
  includeCompleted = false;

  constructor(private commsService: CommsService, private _Activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    this.commsService.getSprints().subscribe(data => {
      this.sprints = data.sort((a,b) => a.name.localeCompare(b.name));
      var passedInSprintName = this._Activatedroute.snapshot.paramMap.get("sprintName");
      if (passedInSprintName) {
        this.sprint = passedInSprintName;
      } else {
        var currentSprint = this.sprints.find(s => new Date(s.endDate).getTime() >= (Date.now()-(10*1000*60*60*24)));
        this.sprint = currentSprint?currentSprint.name:"";
      }
      this.getTimeBookingExceptions();
    });

  }

  getTimeBookingExceptions(): void {
    this.timeBookingExceptions = this.commsService.getTimeBookingExceptions(this.sprint, this.includeCompleted);
  }

  downloadExcel(): void {
    this.commsService.downloadTimeBookingExceptionsExcel(this.sprint, this.includeCompleted);
  }

}
