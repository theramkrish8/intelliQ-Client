import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group } from 'src/app/_models/group.model';
import { MetaService } from 'src/app/_services/meta.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { Meta } from 'src/app/_models/meta.model';
import { Subscription } from 'rxjs';
import { Subject } from 'src/app/_models/subject.model';
import { GroupService } from 'src/app/_services/group.service';

@Component({
	selector: 'app-group-subjects',
	templateUrl: './group-subjects.component.html',
	styleUrls: [ './group-subjects.component.css' ]
})
export class GroupSubjectsComponent implements OnInit, OnDestroy {
	group: Group;
	subjectBasket = new Set<string>();
	groupSubjectSet = new Set<string>();
	metaSubjects: string[];
	metaSubscription: Subscription;
	groupSubscription: Subscription;

	constructor(
		private metaService: MetaService,
		private localStorageService: LocalStorageService,
		private groupService: GroupService
	) {
		this.metaSubjects = [];
	}

	ngOnInit() {
		this.group = this.localStorageService.getItemFromLocalStorage('group', true);
		if (this.group) {
			this.constructSubjectSet(this.group.subjects);
		} else {
			this.initiateSubscriptions();
		}

		this.metaSubscription = this.metaService.getMeta().subscribe((metadata: Meta) => {
			this.metaSubjects = metadata.subjects;
		});
	}
	initiateSubscriptions() {
		this.groupSubscription = this.groupService.groupFetched.subscribe((group: Group) => {
			if (group) {
				this.group = group;
				this.constructSubjectSet(this.group.subjects);
			}
		});
	}
	ngOnDestroy(): void {
		this.metaSubscription.unsubscribe();
		if (this.groupSubscription) {
			this.groupSubscription.unsubscribe();
		}
	}

	constructSubjectSet(subjects: Subject[]) {
		subjects.forEach((subject) => {
			this.groupSubjectSet.add(subject.title);
		});
	}

	addSubject(subject: string) {
		this.subjectBasket.add(subject);
	}

	removeSubject(subject: string) {
		this.subjectBasket.delete(subject);
	}

	updateGroupSubjects() {
		this.subjectBasket.forEach((subject) => {
			if (!this.groupSubjectSet.has(subject)) {
				this.group.subjects.push(new Subject(subject));
			}
		});
		this.groupService.updateGroup(this.group).subscribe((response) => {
			if (response) {
				this.constructSubjectSet(this.group.subjects);
				this.subjectBasket.clear();
				this.group.lastModifiedDate = new Date();
				this.localStorageService.addItemToLocalStorage('group', this.group);
			}
		});
	}
}
