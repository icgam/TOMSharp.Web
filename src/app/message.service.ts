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


import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private toastr: ToastrService) { }

  applicationName = "TOM Sharp";

  messages: string[] = [];

  public add(message: string) {
    console.log(message);
  }

  public clear() {
    this.messages = [];
  }

  public info(message: string) {
    this.toastr.info(message, "TOM Sharp", { positionClass: 'toast-bottom-right' });
  }

  public success(message: string) {
    this.toastr.success(message, "TOM Sharp", { positionClass: 'toast-bottom-right' });
  }

  public error(message: string, details: any) {
    this.toastr.error(message + "\nSee console log for details.", this.applicationName, { positionClass: 'toast-bottom-right' });
    console.error(message, details);
  }
}