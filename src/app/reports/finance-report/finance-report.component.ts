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
import { DateConstants, FinanceSummary } from '../../entities';
import { MessageService } from '../../message.service';
import { CommsService } from '../../comms.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { title } from 'process';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-finance-report',
  templateUrl: './finance-report.component.html',
  styleUrls: ['./finance-report.component.css']
})

export class FinanceReportComponent implements OnInit {

  faFileExcel = faFileExcel;

  months: string[] = DateConstants.MONTHS;
  financeYears: string[] = DateConstants.FINANCE_YEARS;
  financeYear = DateConstants.CURRENT_FINANCE_YEAR;
  financeSummaries: FinanceSummary[];
  includeNonCapitalised = false;
  projects = {};

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  getDataForMonth(params) {
    return params.data.months[params.colDef.headerName];
  }

  columnDefs = [
    {headerName: 'Cap.', field: 'capitalised', width:70, minWidth: 70, maxWidth: 70},
    {headerName: 'WIP Code', field: 'wipCode', sortable: true, filter: true, minWidth: 120, maxWidth: 120},
    {headerName: 'Activity', field: 'activity', sortable: true, filter: true},
    {headerName: 'BudgetLine', field: 'budgetLine', sortable: true, filter: true },
    {headerName: 'Resource', field: 'resourceType', sortable: true, filter: true, minWidth: 120, maxWidth: 120},
    {headerName: 'Apr', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'May', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Jun', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Jul', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Aug', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Sep', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Oct', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Nov', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Dec', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Jan', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Feb', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' },
    {headerName: 'Mar', valueFormatter: this.currencyFormatter, valueGetter: this.getDataForMonth, sortable: true, minWidth: 80, maxWidth: 80, type: 'numericColumn' }
  ];

  currencyFormatter(params) {
    return params.value?formatNumber(params.value, "en-GB"):0;
  }
  
  gridOptions = {
    defaultColDef: {
      resizable: true,
    },
    columnDefs: this.columnDefs,
    rowData: null,
    onFirstDataRendered: this.onFirstDataRendered,
  };

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  constructor(private messageService: MessageService, private commsService: CommsService ) { }

  ngOnInit(): void {
    this.getFinanceSummaries();
   }

  getFinanceSummaries(): void {
    this.commsService.getFinanceSummaries(this.financeYear, this.includeNonCapitalised).subscribe(data => {
      this.financeSummaries = data.sort((a,b) => {
        if (a.budgetLine === b.budgetLine) {
          if (a.capitalised === b.capitalised) {
            return a.resourceType > b.resourceType ? 1 : -1;
          }
          return a.capitalised > b.capitalised ? 1 : -1;
        }
        return a.budgetLine > b.budgetLine ? 1 : -1;
      });
    });
  }

  downloadExcel(): void {
    this.commsService.downloadFinanceSummariesExcel(this.financeYear, this.includeNonCapitalised);
  }
}


