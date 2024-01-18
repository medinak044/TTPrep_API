import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {Project} from "../../models/project";
import {Speaker} from "../../models/speaker";
import {SpeakerFormModalComponent} from "../../components/speaker-form-modal/speaker-form-modal.component";
import {CrudMethodsEnum} from "../../components/chapter-form-modal/chapter-form-modal.component";

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit  {
  projectIdParam!: string
  currentProject!: Project

  speakers?: Speaker[] = []
  speakersFiltered?: Speaker[] = []
  _filterText: string = ""

  crudMethodModeEnum: any = CrudMethodsEnum
  @ViewChild(SpeakerFormModalComponent) speakerFormModalComponent!: SpeakerFormModalComponent

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    ) {
  }

  ngOnInit() {
    this.projectIdParam = this.activatedRoute.snapshot.paramMap.get('projectId') as string
    this.getProjectById()
  }

  // Must set up Bootstrap modal data properly on click
  setupSpeakerModal(crudMethodMode: CrudMethodsEnum, speaker?: Speaker) {
    // Set up the child component
    this.speakerFormModalComponent.currentProject = this.currentProject
    this.speakerFormModalComponent.speaker = speaker
    this.speakerFormModalComponent.crudMethodMode = crudMethodMode
    this.speakerFormModalComponent.initiateForm()
  }

  sortAlphaNum = (a: Speaker, b: Speaker) => a.name.localeCompare(b.name, 'en', { numeric: true })

  getProjectById() {
    this.projectService.getProjectById(this.projectIdParam).subscribe({
      next: (res: Project) => {
        res.speakers = res.speakers?.sort(this.sortAlphaNum)
        this.currentProject = res // Update visual display
        this.speakers = res.speakers
        this.speakersFiltered = res.speakers
      },
      error: (err) => { console.log(err) }
    })
  }

  get filterText(): string {
    return this._filterText
  }

  set filterText(value:string) {
    this._filterText = value
    this.speakersFiltered = this.filterSpeakerByName(value)
  }

  filterSpeakerByName(filterTerm: string){
    if (this.speakers?.length === 0 || this.filterText === "") {
      return this.speakers
    } else {
      // Return a filtered array
      return this.speakers?.filter((speaker: Speaker) => {
        // Check if input text matches or partially matches
        return speaker.name?.toLowerCase().startsWith(filterTerm.toLowerCase())
      })
    }
  }

}
