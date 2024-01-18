import {Component, OnInit, ViewChild} from '@angular/core';

import {CrudMethodsEnum} from "../../components/chapter-form-modal/chapter-form-modal.component";
import {Chapter} from "../../models/chapter";
import {TextBlockLabel} from "../../models/textBlockLabel";
import {
  TextblocklabelFormModalComponent
} from "../../components/textblocklabel-form-modal/textblocklabel-form-modal.component";
import {ActivatedRoute} from "@angular/router";
import {ChapterService} from "../../services/chapter.service";

@Component({
  selector: 'app-text-block-label',
  templateUrl: './text-block-label.component.html',
  styleUrls: ['./text-block-label.component.css']
})
export class TextBlockLabelComponent implements OnInit {
  crudMethodModeEnum: any = CrudMethodsEnum
  projectIdParam!: string // For going back to project view
  chapterIdParam!: string
  currentChapter!: Chapter

  textBlockLabels?: TextBlockLabel[] = []
  textBlockLabelsFiltered?: TextBlockLabel[] = []
  _filterText: string = ""

  @ViewChild(TextblocklabelFormModalComponent) textblocklabelFormModalComponent!: TextblocklabelFormModalComponent

  constructor(
    private chapterService: ChapterService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.projectIdParam = this.activatedRoute.snapshot.paramMap.get('projectId') as string
    this.chapterIdParam = this.activatedRoute.snapshot.paramMap.get('chapterId') as string
    this.getChapterById()
  }

  // Must set up Bootstrap modal data properly on click
  setupTextBlockLabelModal(crudMethodMode: CrudMethodsEnum, textBlockLabel?: TextBlockLabel) {
    // Set up the child component
    this.textblocklabelFormModalComponent.currentChapter = this.currentChapter
    this.textblocklabelFormModalComponent.textBlockLabel = textBlockLabel
    this.textblocklabelFormModalComponent.crudMethodMode = crudMethodMode
    this.textblocklabelFormModalComponent.initiateForm()
  }

  sortAlphaNum = (a: TextBlockLabel, b: TextBlockLabel) => a.name.localeCompare(b.name, 'en', { numeric: true })

  getChapterById() {
    this.chapterService.getChapterById(this.chapterIdParam).subscribe({
      next: (res: Chapter) => {
        res.textBlockLabels = res.textBlockLabels?.sort(this.sortAlphaNum)
        this.currentChapter = res // Update visual display
        this.textBlockLabels = res.textBlockLabels
        this.textBlockLabelsFiltered = res.textBlockLabels
      },
      error: (err) => { console.log(err) }
    })
  }

  get filterText(): string {
    return this._filterText
  }

  set filterText(value:string) {
    this._filterText = value
    this.textBlockLabelsFiltered = this.filterTextBlockLabelByName(value)
  }

  filterTextBlockLabelByName(filterTerm: string){
    if (this.textBlockLabels?.length === 0 || this.filterText === "") {
      return this.textBlockLabels
    } else {
      // Return a filtered array
      return this.textBlockLabels?.filter((textBlockLabel: TextBlockLabel) => {
        // Check if input text matches or partially matches
        return textBlockLabel.name?.toLowerCase().startsWith(filterTerm.toLowerCase())
      })
    }
  }

}
