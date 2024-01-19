import {Component, OnInit, ViewChild} from '@angular/core';
import {CrudMethodsEnum} from "../../components/chapter-form-modal/chapter-form-modal.component";
import {Project} from "../../models/project";
import {Word} from "../../models/word";
import {WordFormModalComponent} from "../../components/word-form-modal/word-form-modal.component";
import {ProjectService} from "../../services/project.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent implements OnInit {
  crudMethodModeEnum: any = CrudMethodsEnum
  projectIdParam!: string
  currentProject!: Project

  words?: Word[] = []
  wordsFiltered?: Word[] = []
  _filterText: string = ""

  @ViewChild(WordFormModalComponent) wordFormModalComponent!: WordFormModalComponent

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.projectIdParam = this.activatedRoute.snapshot.paramMap.get('projectId') as string
    this.getProjectById()
  }

  // Must set up Bootstrap modal data properly on click
  setupWordModal(crudMethodMode: CrudMethodsEnum, word?: Word) {
    // Set up the child component
    this.wordFormModalComponent.currentProject = this.currentProject
    this.wordFormModalComponent.word = word
    this.wordFormModalComponent.crudMethodMode = crudMethodMode
    this.wordFormModalComponent.initiateForm()
  }

  sortAlphaNum = (a: Word, b: Word) => a.originalSpelling.localeCompare(b.originalSpelling, 'en', { numeric: true })

  getProjectById() {
    this.projectService.getProjectById(this.projectIdParam).subscribe({
      next: (res: Project) => {
        res.words = res.words?.sort(this.sortAlphaNum)
        this.currentProject = res // Update visual display
        this.words = res.words
        this.wordsFiltered = res.words
      },
      error: (err) => { console.log(err) }
    })
  }

  get filterText(): string {
    return this._filterText
  }

  set filterText(value:string) {
    this._filterText = value
    this.wordsFiltered = this.filterWordByName(value)
  }

  filterWordByName(filterTerm: string){
    if (this.words?.length === 0 || this.filterText === "") {
      return this.words
    } else {
      // Return a filtered array
      return this.words?.filter((word: Word) => {
        // Check if input text matches or partially matches
        return word.originalSpelling?.toLowerCase().startsWith(filterTerm.toLowerCase())
      })
    }
  }

}
