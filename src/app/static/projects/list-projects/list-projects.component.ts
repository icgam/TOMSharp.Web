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
import { Project, BudgetLine, DateConstants } from 'src/app/entities';
import { CommsService } from '../../../comms.service';
import { Observable } from 'rxjs';
import { ListBudgetLinesComponent } from '../../budget-lines/list-budget-lines/list-budget-lines.component';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {

  financeYears: string[] = DateConstants.FINANCE_YEARS;
  financeYear = DateConstants.CURRENT_FINANCE_YEAR;

  budgetLines: BudgetLine[];
  budgetLineIds: number[] = [];
  budgetLinesRefData = {};

  columnDefs = [
    {headerName: 'Name', field: 'name'},
    {headerName: 'Toggl Code', field: 'timeEntryName'},
    {headerName: 'Finance Year', field: 'financeYear'},
    {headerName: 'Budget Line', field: 'budgetLineId',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.budgetLineIds
      },
      refData: this.budgetLinesRefData
    },
    {headerName: 'WIP Code', field: 'financeWIPCode'},
    {headerName: 'Activity', field: 'activity', cellEditor: 'agSelectCellEditor', cellEditorParams: {
      cellHeight: 50,
      values: ['Research', 'Development', 'Prod Support', 'Small Change', 'Other', 'Data Migration']
    }}
  ];

  valueFormatter(params): string {
    return this.resolveIdToName(params.value);
  }

  gridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      editable: true
    },
    onFirstDataRendered: this.onFirstDataRendered,
  };

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  resolveIdToName(id: number): string {
    return this.budgetLines?this.budgetLines.filter(budgetLine => budgetLine.id == id)[0]?.name:null;
  }

  resolveNameToId(name: string): number {
    return this.budgetLines?.filter(budgetLine => budgetLine.name == name)[0]?.id;
  }

  projects: Observable<Project[]>;

  constructor(private commsService: CommsService) { }

  ngOnInit(): void {
    this.getProjects();
  }
  
  getProjects(): void {
    this.commsService.getBudgetLines(this.financeYear).subscribe(data => {
      Object.keys(this.budgetLinesRefData).forEach(key => delete this.budgetLinesRefData[key]);
      while(this.budgetLineIds.length > 0) this.budgetLineIds.pop();
      this.budgetLines = data.sort((a, b) => a.name.localeCompare(b.name));
      this.budgetLines?.map(bl => bl.id).forEach(id => this.budgetLineIds.push(id));
      this.budgetLines.forEach(budgetLine => {
        this.budgetLinesRefData[budgetLine.id] = budgetLine.name;
      })
      this.projects = this.commsService.getProjects(this.financeYear);
    });
  }

  public saveProject(event: any): void {
    this.commsService.updateProject(event.data)
        .subscribe(data => {
          console.log("Save completed: " + data);
        }, error => { 
          console.error("Error: " + JSON.stringify(error))
        });
  }
}
