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


import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { ColDef } from 'ag-grid-community';
import { CommsService } from 'src/app/comms.service';
import { FinanceSummary } from 'src/app/entities';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-time-entry-report',
  templateUrl: './time-entry-report.component.html',
  styleUrls: ['./time-entry-report.component.css']
})
export class TimeEntryReportComponent implements OnInit {

  faFileExcel = faFileExcel;

  sprints: string[];

  rowData: {budgetLinesName: string, peopleName:string}[] = [];


  months: string[] = [ 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  financeYears: string[] = [ 'FY20', 'FY21'];
  financeYear = 'FY21';
  financeSummaries: FinanceSummary[];
  includeNonCapitalised = false;
  projects = {};

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  getDataForMonth(params) {
    return params.data.months[params.colDef.headerName];
  }

  columnDefs:ColDef[] = [
    {field: 'person', pinned: 'left', minWidth: 200},
    {field: 'budgetLine', pinned: 'left', minWidth: 200},
    {field: 'projectName', pinned: 'left', minWidth: 400}
  ];

  currencyFormatter(params) {
    return params.value?formatNumber(params.value, "en-GB"):0;
  }
  
  gridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      filter: true,
      sortable: true,
      resizable: true
    },
    columnDefs: this.columnDefs,
    rowData: null,
    onFirstDataRendered: this.onFirstDataRendered,
    groupMultiAutoColumn: true,
    autoGroupColumnDef: {
      minWidth: 200,
    },
    api: null
  };

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  constructor(private messageService: MessageService, private commsService: CommsService ) { }

  ngOnInit(): void {
    this.getData();
   }

  getCellValue(params): string {
    return params.data.sprints.find(s => s.sprint == params.colDef.headerName)?.hours;
  }

  nullSortString(a: string, b: string): number {
    if (a===b) return 0;
    if (a===null) return 1;
    if (b===null) return -1;
    return a>b?1:-1;
  }

  getData(): void {
    this.commsService.getTimeEntryReport(this.financeYear).subscribe(data => {
      this.sprints = [...new Set(data.map(t => this.chopOffSprint(t.sprintsName)))].sort();
      const timeEntries = data
      .sort((a,b) => {
        if (a.peopleName === b.peopleName) {
          if (a.budgetLinesName === b.budgetLinesName) {
            //return a.projectsName > b.projectsName?1:-1;
            return this.nullSortString(a.projectsName, b.projectsName);
          }
          //return a.budgetLinesName > b.budgetLinesName?1:-1;
          return this.nullSortString(a.budgetLinesName, b.budgetLinesName);
        }
        //return a.peopleName > b.peopleName?1:-1;
        return this.nullSortString(a.peopleName, b.peopleName);
      });

      const rolledUpTimeEntries:RolledUpEntry[] = timeEntries.reduce((collector: RolledUpEntry[], entry) => {
        var rolledUpEntry:RolledUpEntry;

        var newCollector = collector?collector:[];

        //console.log("Entry for : " + entry.peopleName + ", " + entry.budgetLinesName + ", " + entry.projectsName + ", " + entry.sprintsName);
        //console.log("Collector: " + JSON.stringify(collector));

        rolledUpEntry = newCollector.find(e => e.person === entry.peopleName && e.budgetLine === entry.budgetLinesName && e.projectName === entry.projectsName);
        if (rolledUpEntry) {  
          //console.log("RUE found: " + JSON.stringify(rolledUpEntry));
          newCollector = newCollector.filter(e => !(e.person === entry.peopleName && e.budgetLine === entry.budgetLinesName && e.projectName === entry.projectsName));
        } else {
          rolledUpEntry = {
            person: entry.peopleName,
            budgetLine: entry.budgetLinesName,
            projectName: entry.projectsName,
            sprints: []
          };
          //console.log("RUE not found: creating new:" + JSON.stringify(rolledUpEntry));
          
        }

//        console.log("RolledUpEntry: " + JSON.stringify(rolledUpEntry));

        rolledUpEntry.sprints.push({
          sprint: this.chopOffSprint(entry.sprintsName),
          hours: entry.hours,
          charge: entry.charge
        });

        newCollector.push(rolledUpEntry);

        return newCollector;
       }, null);

      this.sprints.forEach(s => {
        this.columnDefs.push({
          headerName: s,
          valueGetter: this.getCellValue
        })
      });
      this.gridOptions.api.setColumnDefs(this.columnDefs);

      this.gridOptions.api.setRowData(rolledUpTimeEntries);
    });
  }

  downloadExcel(): void {
    this.commsService.downloadTimeEntryReportExcel(this.financeYear);
  }

  chopOffSprint(sprintName: string): string {
    if (sprintName?.indexOf(' ') > -1) {
      return sprintName.split(' ')[1];
    } else {
      return sprintName;
    }
  }
}

export class RolledUpEntry {
    person: string;
    budgetLine: string;
    projectName: string;
    sprints: { sprint: string, hours: number, charge: number }[];
}
