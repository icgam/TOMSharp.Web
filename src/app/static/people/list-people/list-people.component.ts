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
import { Person } from '../../../entities';
import { MessageService } from '../../../message.service';
import { CommsService } from '../../../comms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-people',
  templateUrl: './list-people.component.html',
  styleUrls: ['./list-people.component.css']
})
export class ListPeopleComponent implements OnInit {
  people: Person[];

  constructor(private router: Router, private messageService: MessageService, private commsService: CommsService ) { }

  ngOnInit(): void {
    this.commsService.getPeople().subscribe(data => this.people = data);
  }

  addPerson(): void {
    this.messageService.add("ListPeopleComponent: adding person");
    window.localStorage.removeItem("editPersonId");
    this.router.navigate(['edit-person']);
  }

  editPerson(person: Person): void {
    window.localStorage.removeItem("editPersonId");
    window.localStorage.setItem("editPersonId", person.id.toString());
    this.messageService.add("ListPeopleComponent: editing person: " + person.id);
    this.router.navigate(['edit-person']);
  }

}
