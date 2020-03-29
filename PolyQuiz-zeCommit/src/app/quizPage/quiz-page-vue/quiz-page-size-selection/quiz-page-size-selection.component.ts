import { Component, OnInit } from '@angular/core';
import { Quiz} from '../../../models/quiz.models';
import { QuizListService} from '../../../services/quizList.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Question } from 'src/app/models/question.models';
import {StatMemory} from '../../../models/stat.models';

@Component({
  selector: 'app-quiz-page-size-selection',
  templateUrl: './quiz-page-size-selection.component.html',
  styleUrls: ['./quiz-page-size-selection.component.css']
})
export class QuizPageSizeSelectionComponent implements OnInit {
  public size = 3;
  public id: number;

  constructor(private route: ActivatedRoute) {


  }

  ngOnInit() {
    this.setQuizId();
  }

  ngOnClick() {
    this.setSize();
  }


  private setSize() {
    this.size = 4;
  }

  setQuizId() {
      this.id = Number(this.route.snapshot.paramMap.get('QuizId'));
      }
}

