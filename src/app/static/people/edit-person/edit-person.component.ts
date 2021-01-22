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


import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommsService } from "../../../comms.service";
import { MessageService } from '../../../message.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Person } from '../../../entities';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class EditPersonComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private comms: CommsService,
    private messageService: MessageService
  ) { }

  public editForm: FormGroup;

  ngOnInit(): void {
    
    let personId = window.localStorage.getItem('editPersonId')?window.localStorage.getItem('editPersonId'):null;

    this.editForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      team: [null, Validators.required],
      employer: [null, Validators.required],
      resourceType: [null, Validators.required],
      emailAddress: [null, [Validators.required, Validators.email]],
      startDate: [null],
      endDate: [null]
    });

    if (personId) {
      this.comms.getPersonById(+personId).subscribe(data => this.setEditForm(data));
    }
  }

  private setEditForm(person: Person): void {
    if (person.startDate != null) person.startDate = new Date(person.startDate);
    if (person.endDate != null) person.endDate = new Date(person.endDate);

    this.editForm.setValue(person);
  }

  deletePerson(): void {
    if (confirm("Are you sure you want to delete this person?")) {
      this.comms.deletePerson(this.editForm.value)
    .subscribe(data => {
      this.router.navigate(['list-people']);
    }, error => { 
      this.messageService.add("Error: " + JSON.stringify(error))
    });
    }
  }

  onSubmit(): void {
    this.messageService.add("Current view: " + JSON.stringify(this.editForm.value));
    if (this.editForm.valid) {
      if (this.editForm.value.id) {
        this.comms.updatePerson(this.editForm.value)
        .subscribe(data => {
          this.router.navigate(['list-people']);
        }, error => { 
          this.messageService.add("Error: " + JSON.stringify(error))
        });
      }
      else {
        this.comms.addPerson(this.editForm.value)
        .subscribe(data => {
          this.router.navigate(['list-people']);
        }, error => { 
          this.messageService.add("Error: " + JSON.stringify(error))
        });
      }
    }
  }
}
