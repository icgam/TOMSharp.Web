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


export class Person {
    id: number;
    name: string;
    team: string;
    resourceType: string;
    emailAddress: string;
    startDate: Date;
    endDate: Date;
    employer: string;
}

export class Sprint {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    financeMonth: string;
    financeYear: string;
}

export class FinanceSummary {
    budgetLine: string;
    project: string;
    capitalised: string;
    wipCode: string;
    activity: string;
    resourceType: string;
    months: [string, number][];
}

export class TimeBookingSummary {
    sprint: string;
    team: string;
    person: string;
    hours: number;
    financeYear: string;
}


export class SprintSummary {
    name: string;
    startDate: Date;
    endDate: Date;
    financeMonth: string;
    financeYear: string;
    hours: number;
    fte: number;
    people: number;
    charge: number;
    exceptionCount: number;
    lastUpdated: Date;
}

export class ContractorCapitalisationSummary {
    employer: string;
    resourceType: string;
    financeMonth: string;
    financeYear: string;
    capitalised: boolean;
    hours: number;
    charge: number;
}

export class TimeBookingException {
    sprint: string;
    person: string;
    expectedHours: number;
    actualHours: number;
    errors: string[];
    isCorrect: boolean;
}

export class ForecastEntry {
    id: number;
    sprint: string;
    project: string;
    hours: number;
}

export class Forecast {
    id: number;
    name: string;
    financeYear: string;
    created: Date;
    updated: Date;
    entries: ForecastEntry[];
}

export class Scenario {
    id: number;
    name: string;
    financeYear: string;
    created: Date;
    updated: Date;
    forecasts: Forecast[];
    projects: string[];
}

export class BudgetLine {
    id: number;
    name: string;
    financeYear: string;
    budget: number;
}

export class Project {
    id: number;
    name: string;
    timeEntryName: string;
    budgetLine: BudgetLine;
    financeWIPCode: string;
    type: string;
    financeName: string;
    capitalised: boolean;
    activity: string;
    financeYear: string;
}

export class DateConstants {
    public static MONTHS: string[] = [ 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    public static FINANCE_YEARS: string[] = [ 'FY20', 'FY21', 'FY22', 'FY23'];
    public static CURRENT_FINANCE_YEAR = 'FY23';
}
