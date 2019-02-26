import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MetaService } from 'src/app/_services/meta.service';
import { Meta } from 'src/app/_models/meta.model';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
	selector: 'app-upsert-metadata',
	templateUrl: './upsert-metadata.component.html',
	styleUrls: [ './upsert-metadata.component.css' ]
})
export class UpsertMetadataComponent implements OnInit {
	addMetadataForm: FormGroup;
	metadata: Meta;
	metadataLoaded = false;
	metaSubscription: Subscription;
	constructor(
		private formBuilder: FormBuilder,
		private metaService: MetaService,
		private notificationService: NotificationService
	) {}

	ngOnInit() {
		this.addMetadataForm = this.formBuilder.group({
			subjects: '',
			standards: ''
		});

		this.initiateSubscription();
	}
	onSubmit() {
		var standardsStr = this.addMetadataForm.get('standards').value;
		var subjectsStr = this.addMetadataForm.get('subjects').value;
		var standards: number[];
		var subjects: string[];
		if (!standardsStr && !subjectsStr) {
			this.notificationService.showErrorWithTimeout('Please enter values!', null, 2000);
			return;
		}
		if (subjectsStr) {
			subjects = this.metadata ? this.metadata.subjects.concat(subjectsStr.split(',')) : subjectsStr.split(',');
		} else {
			subjects = this.metadata ? this.metadata.subjects : [];
		}
		if (standardsStr) {
			var temp = standardsStr.split(',').map(function(item: string) {
				return parseInt(item, 10);
			});
			if (temp.length > 0 && isNaN(temp[0])) {
				this.notificationService.showErrorWithTimeout('Please enter valid standard!', null, 2000);
				return;
			}
			standards = this.metadata ? this.metadata.standards.concat(temp) : temp;
		} else {
			standards = this.metadata ? this.metadata.standards : [];
		}

		var meta = new Meta();
		meta.subjects = subjects;
		meta.standards = standards;
		if (this.metadata) {
			meta.metaId = this.metadata.metaId;
			this.metaService.updateMeta(meta).subscribe(() => {
				this.initiateSubscription();
			});
		} else {
			this.metaService.addMeta(meta).subscribe(() => {
				this.initiateSubscription();
			});
		}
	}

	initiateSubscription() {
		this.metaSubscription = this.metaService.getMeta().subscribe((metadata: Meta) => {
			this.metadataLoaded = true;
			this.metadata = metadata;
		});
	}
}
