import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chapter} from "../../models/chapter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ChapterService} from "../../services/chapter.service";

export enum CrudMethodsEnum {
  CREATE, READ,UPDATE, DELETE
}
@Component({
  selector: 'app-chapter-form-modal',
  templateUrl: './chapter-form-modal.component.html',
  styleUrls: ['./chapter-form-modal.component.css']
})
export class ChapterFormModalComponent implements OnInit{
  crudMethodMode!: CrudMethodsEnum
  inputChapter?: Chapter
  @Input() projectId!: string
  @Output() signalParentComponent = new EventEmitter<Chapter>() // Let parent component know to refresh its data

  crudMethodModeEnum: any = CrudMethodsEnum // Used to define what the form components will do

  chapterForm: FormGroup = this.fb.group({
    id: [''],
    title: [''],
    orderNumber: [1],
    projectId: [''],
  })

  constructor(
    public chapterService: ChapterService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initiateForm()  // If project data was passed on to this component, fill out form
  }

  initiateForm() {
    if (this.inputChapter) {
      const {
        id,
        title,
        orderNumber,
        projectId
      } = this.inputChapter

      this.chapterForm = this.fb.group({
        id: [id],
        title: [title],
        orderNumber: [orderNumber],
        projectId: [this.projectId]
      })
    }
    else {
      // For creating new chapter
      this.chapterForm = this.fb.group({
        id: [''],
        title: [''],
        orderNumber: [1],
        projectId: [''],
      })
    }

  }

  submitChapterForm() {
    let chapter: Chapter = this.chapterForm.value
    chapter.projectId = this.projectId // Include project id
    if (this.crudMethodMode == this.crudMethodModeEnum.CREATE) {this.createChapter(chapter)}
    if (this.crudMethodMode == this.crudMethodModeEnum.UPDATE) {this.updateChapter(chapter)}
    if (this.crudMethodMode == this.crudMethodModeEnum.DELETE) {this.removeChapter(chapter.id)}
  }

  getChapterById(chapterId: string) {
    this.chapterService.getChapterById(chapterId).subscribe({
      next: (res: Chapter) => {
        this.inputChapter = res
      },
      error: (err) => { console.log(err) }
    })
  }

  createChapter(chapterForm: Chapter) {
    this.chapterService.createChapter(chapterForm).subscribe({
      next: (res: Chapter) => {
        this.signalParentComponent.emit(res)
      },
      error: (err) => { console.log(err) }
    })
  }

  updateChapter(chapterForm: Chapter) {
    if (chapterForm) {
      this.chapterService.updateChapter(chapterForm).subscribe({
        next: (res: Chapter) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  // WARNING: Make sure api changes ALL the affected order numbers (if 3 was deleted, change only > 3)
  removeChapter(chapterId: string) {
    if (chapterId.length > 0) {
      this.chapterService.removeChapter(chapterId).subscribe({
        next: (res: Chapter) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }

}
