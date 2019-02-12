import { Component, OnInit, OnDestroy } from '@angular/core';
import { Question } from 'src/app/_models/question.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user.model';
import { LocalStorageService } from 'src/app/_services/local-storage-service';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/_services/question.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  selectedGrade: string;
  selectedSubject: string;
  allQuestions: Question[] = [];
  questions: Question[] = [];
  grades;
  subjects;
  userSubscription: Subscription;

  constructor(private router: Router, private localStorageService: LocalStorageService,
    private userService: UserService, private questionService: QuestionService) { }

  ngOnInit() {
    var loggedInUser = this.localStorageService.getCurrentUser();
    if (loggedInUser) {
      this.initQuestions(loggedInUser);
    }
    this.initiateSubscriptions();
  }

  initiateSubscriptions(): any {
    this.userSubscription = this.userService.userDetailsUpdated.subscribe((user: User) => {
      this.initQuestions(user);
    });
  }

  initQuestions(user: User) {
    if (this.router.url === "/teacher/my-questions" || this.router.url === "/approver/my-questions") {
      this.questionService.getMyQuestions().subscribe((data) => {
        this.questions = data;
        this.allQuestions = data;
        this.grades = this.unique(this.questions, "std");
        this.subjects = this.unique(this.questions, "subject");
        this.selectedGrade = "-1";
        this.selectedSubject = "default";

      });
    }
    else {
      this.questionService.getAllQuestions().subscribe((data) => {
        this.questions = data;
        this.allQuestions = data;
        this.grades = this.unique(this.questions, "std");
        this.subjects = this.unique(this.questions, "subject");
        this.selectedGrade = "-1";
        this.selectedSubject = "default";
      });
    }

  }

  onFilterApplied() {

    if (this.selectedGrade !== "-1" && this.selectedSubject !== "default") {
      this.questions = this.allQuestions.filter(t => t.std === Number(this.selectedGrade) && t.subject === this.selectedSubject);
    }
    else if (this.selectedGrade === "-1" && this.selectedSubject === "default") {
      this.questions = this.allQuestions;
    }
    else if (this.selectedGrade !== "-1") {
      this.questions = this.allQuestions.filter(t => t.std === Number(this.selectedGrade));
    }
    else if (this.selectedSubject !== "default") {
      this.questions = this.allQuestions.filter(t => t.subject === this.selectedSubject);
    }

  }

  removeQuestion(questionId) {
    this.allQuestions = this.allQuestions.filter(function (item) {
      return item.questionId !== questionId;
    });
    this.onFilterApplied();
  }

  unique(arr, prop) {
    return arr.map(function (e) { return e[prop]; }).filter(function (e, i, a) {
      return i === a.indexOf(e);
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
