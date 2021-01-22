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
import { BudgetLine } from 'src/app/entities';
import { CommsService } from 'src/app/comms.service';
import { Observable } from 'rxjs';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-budget-lines',
  templateUrl: './list-budget-lines.component.html',
  styleUrls: ['./list-budget-lines.component.css']
})
export class ListBudgetLinesComponent implements OnInit {

  faPlus = faPlus;

  columnDefs = [
    {headerName: 'Name', field: 'name'},
    {headerName: 'Finance Year', field: 'financeYear'},
    {headerName: 'Budget', field: 'budget'}
  ];

  gridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      editable: true
    },
    onFirstDataRendered: this.onFirstDataRendered,
    api: null
  };

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  budgetLines: Observable<BudgetLine[]>;

  constructor(private commsService: CommsService) { }

  ngOnInit(): void {
    this.budgetLines = this.commsService.getBudgetLines();
  }

  addNewBudgetLine(): void {
    this.commsService.addBudgetLine({ id: null, name: "New Budget Line", financeYear: "FY21", budget: 0})
      .subscribe(
        budgetLine => {
          this.gridOptions.api.applyTransaction({ add: [budgetLine]})
        }, 
        error => console.error("Error: " + JSON.stringify(error))
      );
  }

  public saveBudgetLine(event: any): void {
    console.log(JSON.stringify(event.data));
    event.data.budget = event.data.budget?parseInt(event.data.budget):0;
    console.log(JSON.stringify(event.data));
    this.commsService.updateBudgetLine(event.data)
        .subscribe(data => {
          console.log("Save completed: " + data);
        }, error => { 
          console.error("Error: " + JSON.stringify(error))
        });
  }

}
