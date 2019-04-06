import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'src/app/_services/group.service';
import { Group } from 'src/app/_models/group.model';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-add-group',
	templateUrl: './add-group.component.html',
	styleUrls: [ './add-group.component.css' ]
})
export class AddGroupComponent implements OnInit {
	createGroupForm: FormGroup;
	responseMsg: Observable<string>;
	groups: Observable<Group[]>;
	constructor(private formBuilder: FormBuilder, private groupService: GroupService) {}

	ngOnInit() {
		this.createGroupForm = this.formBuilder.group({
			groupCode: [ '', Validators.required ]
		});
		this.groups = this.groupService.getAllGroups();
	}

	onSubmit() {
		// stop here if form is invalid
		if (this.createGroupForm.invalid) {
			return;
		}
		var groupCode = this.createGroupForm.get('groupCode').value;
		this.groupService.addGroup(new Group(groupCode)).subscribe(() => {
			this.groups = this.groupService.getAllGroups();
		});
	}
}
