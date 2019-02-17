import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'src/app/_services/group.service';
import { Group } from 'src/app/_models/group.model';
import { AppResponse } from 'src/app/_models/app-response.model';
import { ResponseStatus } from 'src/app/_models/enums';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  createGroupForm: FormGroup;
  responseMsg: string;
  constructor(private formBuilder: FormBuilder, private groupService: GroupService) { }

  ngOnInit() {
    this.createGroupForm = this.formBuilder.group({
      groupCode: ['', Validators.required]
    });

  }


  onSubmit() {
    // stop here if form is invalid
    if (this.createGroupForm.invalid) {
      return;
    }
    var groupCode = this.createGroupForm.get('groupCode').value;
    this.groupService.addGroup(new Group(groupCode)).subscribe((appResponse: AppResponse) => {
      if (appResponse.status === ResponseStatus.ERROR) {
        this.responseMsg = appResponse.msg;
      }
      else if (appResponse.status === ResponseStatus.SUCCESS) {
        this.responseMsg = appResponse.body;
      }

    });

  }

}
