import { Component, OnInit } from '@angular/core';
import { School } from 'src/app/_models/school.model';
import { SchoolService } from 'src/app/_services/school.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';

@Component({
	selector: 'app-school-profile',
	templateUrl: './school-profile.component.html',
	styleUrls: [ './school-profile.component.css' ]
})
export class SchoolProfileComponent implements OnInit {
	school: School;

	constructor(private schoolService: SchoolService, private localStorageService: LocalStorageService) {}

	ngOnInit() {
		this.schoolService
			.getSchoolBySchoolCode(this.localStorageService.getCurrentUser().school.code)
			.subscribe((school: School) => {
				this.school = school;
			});
	}
	updateSchool() {
		this.school.contact.mobile = this.convertContactToArray(this.school.contact.mobile);
		this.school.contact.landline = this.convertContactToArray(this.school.contact.landline);
		this.schoolService.updateSchool(this.school).subscribe((response) => {
			if (response) {
				this.localStorageService.addItemToLocalStorage('school', this.school);
			}
		});
	}

	convertContactToArray(contact: any) {
		if (typeof contact === 'string') {
			return contact.split(',');
		} else {
			return contact;
		}
	}
}
