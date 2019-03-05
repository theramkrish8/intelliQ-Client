import { Component, OnInit } from '@angular/core';
import { SchoolService } from 'src/app/_services/school.service';
import { Observable } from 'rxjs';
import { School } from 'src/app/_models/school.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';

@Component({
	selector: 'app-group-schools',
	templateUrl: './group-schools.component.html',
	styleUrls: [ './group-schools.component.css' ]
})
export class GroupSchoolsComponent implements OnInit {
	schools$: Observable<School[]>;
	selectedSchool: School;
	constructor(private schoolService: SchoolService, private localStorageService: LocalStorageService) {}

	ngOnInit() {
		this.schools$ = this.schoolService.getSchoolsByGroupId(
			this.localStorageService.getCurrentUser().school.group.groupId
		);
	}
}
