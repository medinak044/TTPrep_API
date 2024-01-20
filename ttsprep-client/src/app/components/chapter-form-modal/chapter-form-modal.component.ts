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
  inputChapter?: Chapter // Set by parent component
  @Input() projectId!: string
  @Output() signalParentComponent: EventEmitter<Chapter> = new EventEmitter<Chapter>() // Let parent component know to refresh its data

  crudMethodModeEnum: any = CrudMethodsEnum
  crudMethodMode!: CrudMethodsEnum

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
    else if (this.crudMethodMode == this.crudMethodModeEnum.UPDATE) {this.updateChapter(chapter)}
    else if (this.crudMethodMode == this.crudMethodModeEnum.DELETE) {this.removeChapter(chapter.id)}
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

  // TODO: Make sure api changes ALL the affected order numbers (if 3 was deleted, change only > 3)
  updateChapterOrderNumber(chapter: Chapter) {
    if (chapter) {
      this.chapterService.updateChapterOrderNumber(chapter).subscribe({
        next: (res: Chapter) => {
          this.removeChapter(res.id) // Then delete chapter
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  removeChapter(chapterId: string) {
      if (chapterId) {
        this.chapterService.removeChapter(chapterId).subscribe({
          next: (res: Chapter) => {
            this.signalParentComponent.emit(res)
          },
          error: (err) => { console.log(err) }
        })
    }
  }

}
