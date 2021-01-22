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


import { Component, Directive, EventEmitter, OnInit, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Sprint } from '../../../entities';
import { MessageService } from '../../../message.service';
import { CommsService } from '../../../comms.service';
import { Router } from '@angular/router';

export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-list-sprints',
  templateUrl: './list-sprints.component.html',
  styleUrls: ['./list-sprints.component.css']
})
export class ListSprintsComponent implements OnInit {
  sprints: Sprint[];
  compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  constructor(private router: Router, private messageService: MessageService, private commsService: CommsService ) { }

  ngOnInit(): void {
    this.downloadSprints();
  }

  downloadSprints() {
    this.commsService.getSprints().subscribe(data => {
      this.sprints = data.sort((a,b) => a.name.localeCompare(b.name));
    });
  }

  addSprint(): void {
    this.messageService.add("ListSprintsComponent: adding sprint");
  }

  editSprint(sprint: Sprint): void {
    window.localStorage.removeItem("editSprintId");
    window.localStorage.setItem("editSprintId", sprint.id.toString());
    this.messageService.add("ListSprintsComponent: editing sprint: " + sprint.id);
    this.router.navigate(['edit-sprint']);
  }

  generateSprints(): void {
    this.commsService.generateSprints()
    .subscribe(() => {
      this.messageService.add("Sprint generation: complete");
      this.downloadSprints();
    }, error => { 
      this.messageService.add("Error: " + JSON.stringify(error));
    });
  }

}