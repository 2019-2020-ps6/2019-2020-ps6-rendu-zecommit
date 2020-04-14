import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Profile} from '../../models/profile.models';
import {Quiz} from '../../models/quiz.models';
import {Question} from '../../models/question.models';
import {StatMemory} from '../../models/stat-memory.models';
import {ProfileService} from '../../services/profile.service';
import {QuizListService} from '../../services/quizList.service';
import {ActivatedRoute} from '@angular/router';
import {Answer} from '../../models/answer.models';
import {PopUpWarningComponent} from '../../pop-up/pop-up-warning/pop-up-warning.component';
import {MatDialog} from '@angular/material/dialog';
import {StatService} from '../../services/stats.service';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-quiz-page-vue',
  templateUrl: './quiz-page-vue.component.html',
  styleUrls: ['./quiz-page-vue.component.css']
})
export class QuizPageVueComponent implements OnInit {

  public profile: Profile;
  public quiz: Quiz;
  public questionList: Question[];
  public question: Question;
  public index = 0;
  public startQuiz: boolean;
  public quizDone: boolean;
  public stats: StatMemory;
  @Output()
  public size: EventEmitter<number> = new EventEmitter();

  constructor(public profileService: ProfileService, public quizService: QuizListService,
              private route: ActivatedRoute, public dialog: MatDialog, public statService: StatService) {
    this.startQuiz = false;
    const combinedObject = combineLatest(this.profileService.profiles$, this.quizService.quizzes$);
    combinedObject.subscribe(value => {
      if (value[0] && value[1]) {
        this.load(value[1], value[0]);
      }
    });

  }

  load(quizzes: Quiz[], profiles: Profile[]) {
    this.route.paramMap.subscribe(params => {
      const idQuiz = Number(params.get('idQuiz'));
      const idProfile = Number(params.get('idProfile'));
      const quiz = quizzes.find((quiz$) => quiz$.id === idQuiz);
      if (quiz) {
        this.quiz = quiz;
        this.questionList = quiz.questions;
        this.question = quiz.questions[this.index];
      }
      const profile = profiles.find((prof) => prof.id === idProfile);
      if (profile) {
        this.profile = profile;
      }
      if (profile && quiz) {
        this.stats = new StatMemory(this.quiz, this.profile); // creation objet stat
      }
    });
  }

  openDialog(path: string) {
    this.dialog.open(PopUpWarningComponent, {
      data: {
        path,
        url: this.route
      }
    });
  }

  getSize($event) {
    this.size = $event;
    this.startQuiz = true;
  }

  ngOnInit() {
  }

  setSize(n: number) {
    this.size.emit(n);
  }

  isCompleted(): boolean {
    if (this.stats.questionsDone.length === this.questionList.length) {
      this.terminateQuiz();
    }
    return false;
  }

  terminateQuiz() {
    this.quizDone = true;
    this.statService.addStat(this.stats, this.statService.MEMORY).subscribe(() => {
      this.statService.setStatsFromUrl(this.statService.MEMORY);
    });
  }

  UpdateMapStats(asw: Answer): void {
    if (this.stats.trial.get(asw.questionId) == null) {
      this.stats.trial.set(asw.questionId, 0);
    }
    this.stats.trial.set(asw.questionId, this.stats.trial.get(asw.questionId) + 1);
  }

  receiveQ($event) {
    this.UpdateMapStats($event);
    if ($event.isCorrect) {
      if (!this.stats.questionsDone.includes($event.questionId)) {
        this.stats.questionsDone.push($event.questionId);
      } // incrémente de 1 le nombre de question fini
      if (!this.isCompleted()) {
        this.searchNextQuestion();
      }
    }
  }

  searchNextQuestion() {
    for (let i = 0; i < this.questionList.length; i++) {
      if (!this.stats.questionsDone.includes(this.questionList[i].id)) {
        this.index = i;
        break;
      }
    }
  }


  skipQ(n) { // saute n question(s)
    this.index = n;
  }
}
