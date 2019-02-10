import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/_models/question.model';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormGroup } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user.model';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit {
  selectedGrade: string;
  selectedSubject: string;
  allQuestions: Question[];
  myQuestions: Question[];
  questions: Question[];
  grades;
  subjects;

  constructor(private router: Router, private authService: AuthenticationService, private userService: UserService) {
    this.allQuestions = [
      new Question("1", "Question 1", "Question 1 description?", "GK", 3, "1", "2", null, null, null, null, null, null, null, null, null, null), // my
      new Question("2", "Question 2", "Question 2 description?", "English", 4, "2", "3", null, null, null, null, null, null, null, null, null, null),
      new Question("3", "Question 3", "Question 3 description?", "Science", 5, "3", "1", null, null, null, null, null, null, null, null, null, null),
      new Question("4", "Question 4", "Question 4 description?", "Science", 6, "1", "3", null, null, null, null, null, null, null, null, null, null), // my
      new Question("5", "Question 5", "Question 5 description?", "Maths", 3, "1", "2", null, null, null, null, null, null, null, null, null, null), // my
      new Question("6", "Question 6", "Question 6 description?", "English", 4, "2", "3", null, null, null, null, null, null, null, null, null, null),
      new Question("7", "Question 7", "Question 7 description?", "Science", 5, "2", "1", null, null, null, null, null, null, null, null, null, null),
      new Question("8", "Question 8", "Question 8 description?", "GK", 6, "1", "3", null, null, null, null, null, null, null, null, null, null)]; // my
  }

  ngOnInit() {
    var loggedInUser = this.userService.getCurrentUser();
    if (loggedInUser) {
      this.initQuestion(loggedInUser);
    }
    this.userService.userDetailsUpdated.subscribe((user: User) => {
      this.initQuestion(user);
    });

  }

  initQuestion(user: User) {

    var loggedInUser = this.userService.getCurrentUser();
    if (this.router.url === "/teacher/my-questions" || this.router.url === "/approver/my-questions") {
      this.myQuestions = this.allQuestions.filter(function (el) {
        return el.owner === loggedInUser.userId;
      });
    }
    else {
      this.myQuestions = this.allQuestions;
    }

    this.questions = this.myQuestions;
    this.grades = this.unique(this.questions, "std");
    this.subjects = this.unique(this.questions, "subject");
    this.selectedGrade = "-1";
    this.selectedSubject = "default";
  }

  onFilterApplied() {

    if (this.selectedGrade !== "-1" && this.selectedSubject !== "default") {
      this.questions = this.myQuestions.filter(t => t.std === Number(this.selectedGrade) && t.subject === this.selectedSubject);
    }
    else if (this.selectedGrade === "-1" && this.selectedSubject === "default") {
      this.questions = this.myQuestions;
    }
    else if (this.selectedGrade !== "-1") {
      this.questions = this.myQuestions.filter(t => t.std === Number(this.selectedGrade));
    }
    else if (this.selectedSubject !== "default") {
      this.questions = this.myQuestions.filter(t => t.subject === this.selectedSubject);
    }

  }

  removeQuestion(questionId) {
    this.myQuestions = this.myQuestions.filter(function (item) {
      return item.questionId !== questionId;
    });
    this.onFilterApplied();
  }

  unique(arr, prop) {
    return arr.map(function (e) { return e[prop]; }).filter(function (e, i, a) {
      return i === a.indexOf(e);
    });
  }
}
