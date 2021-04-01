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
import { ContractorCapitalisationSummary, DateConstants } from '../../entities';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contractor-capitalisation-summary',
  templateUrl: './contractor-capitalisation-summary.component.html',
  styleUrls: ['./contractor-capitalisation-summary.component.css']
})
export class ContractorCapitalisationSummaryComponent implements OnInit {
  faFileExcel = faFileExcel;

  months: string[] = DateConstants.MONTHS;
  financeYears: string[] = DateConstants.FINANCE_YEARS;
  financeYear = DateConstants.CURRENT_FINANCE_YEAR;
  contractorCapitalisationSummaries: ContractorCapitalisationSummary[];

  summaries = {};
  employers: string[];

  constructor(private messageService: MessageService, private commsService: CommsService) { }

  ngOnInit(): void {
    this.getContractorCapitalisationSummaries();
  }

  chopOffSprint(sprintName: string): string {
    if (sprintName?.indexOf(' ') > -1) {
      return sprintName.slice(sprintName.indexOf(' ') + 1);
    } else {
      return sprintName;
    }
  }

  getContractorCapitalisationSummaries(): void {
    this.summaries['Capitalised'] = {};
    this.summaries['Non-capitalised'] = {};
    this.commsService.getContractorCapitalisationSummaries(this.financeYear).subscribe(data => {
      this.contractorCapitalisationSummaries = data;
      //this.months = [...new Set(data.map(t => t.financeMonth))];
      this.employers = [...new Set(data.map(t => t.employer))].sort();
      this.contractorCapitalisationSummaries.forEach(ccs => {
        var subset = ccs.capitalised?this.summaries['Capitalised']:this.summaries['Non-capitalised'];
        if (!subset.employers) {
          subset.employers = [...new Set(data.filter(t => t.capitalised == ccs.capitalised).map(t => t.employer))].sort();
        }
        if (!subset[ccs.employer]) {
          subset[ccs.employer] = {};
        }
        subset[ccs.employer][ccs.financeMonth] = ccs.charge;
      });
    });
  }

  downloadExcel(): void {
    this.commsService.downloadContractorCapitalisationSummariesExcel(this.financeYear);
  }

}
