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
import { FinanceProjectMapping } from '../../../entities';
import { MessageService } from '../../../message.service';
import { CommsService } from '../../../comms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-finance-project-mappings',
  templateUrl: './list-finance-project-mappings.component.html',
  styleUrls: ['./list-finance-project-mappings.component.css']
})
export class ListFinanceProjectMappingsComponent implements OnInit {

  mappings: FinanceProjectMapping[];

  constructor(private router: Router, private messageService: MessageService, private commsService: CommsService ) { }

  ngOnInit(): void {
    this.commsService.getFinanceProjectMappings().subscribe(data => this.mappings = data);
  }

  addMapping(): void {
    this.messageService.add("ListFinanceProjectMappingsComponent: adding mapping");
  }

  editMapping(mapping: FinanceProjectMapping): void {
    window.localStorage.removeItem("editFinanceProjectMappingId");
    window.localStorage.setItem("editFinanceProjectMappingId", mapping.id.toString());
    this.messageService.add("ListFinanceProjectMappingsComponent: editing mapping: " + mapping.id);
    this.router.navigate(['edit-mapping']);
  }

}