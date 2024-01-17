import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoginResDto} from "../../models/loginResDto";
import {Project} from "../../models/project";
import {FormBuilder} from "@angular/forms";
import {ProjectService} from "../../services/project.service";
import {ProjectReqDto} from "../../models/projectReqDto";
import {ActivatedRoute} from "@angular/router";
import {Chapter} from "../../models/chapter";
import {ChapterService} from "../../services/chapter.service";
import {AppUserService} from "../../services/app-user.service";
import {Observable} from "rxjs";
import {
  ChapterFormModalComponent,
  CrudMethodsEnum
} from "../../components/chapter-form-modal/chapter-form-modal.component";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  loggedInUser!: LoginResDto
  projectIdParam!: string

  currentProject!: Project
  // chapters?: Chapter[] = []
  // chapters$?: Observable<Chapter[]>
  currentChapter?: Chapter
  crudMethodModeEnum: any = CrudMethodsEnum // Used to define what the form components will do
  crudMethodMode!: CrudMethodsEnum
  @ViewChild(ChapterFormModalComponent) chapterFormModalComponent!: ChapterFormModalComponent

  constructor(
    public appUserService: AppUserService,
    public projectService: ProjectService,
    public chapterService: ChapterService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
    this.loggedInUser = this.appUserService.getLocalStorageUser()
    // Getting the project also gets its associated navigation properties
    this.projectIdParam = this.activatedRoute.snapshot.paramMap.get('projectId') as string
    this.getProjectById() // Get project data from db

    // this.initiateForm()  // If project data was passed on to this component, fill out form
  }

  setCurrentChapter(chapter?: Chapter) {
    this.currentChapter = chapter
  }

  setupChapterModal(crudMethodMode: CrudMethodsEnum, chapter?: Chapter) {
    // this.setCurrentChapter(chapter)

    // Set up the child component
    this.chapterFormModalComponent.inputChapter = chapter
    this.chapterFormModalComponent.crudMethodMode = crudMethodMode
    this.chapterFormModalComponent.initiateForm()
  }

  // Update the chapter display to reduce calls made to db
  attachChapterToProject(chapter: Chapter) {
    // Remove the old chapter data from the current project
    this.currentProject.chapters = this.currentProject.chapters?.filter(c => c.id !== chapter.id)

    // If chapter was deleted in db, refresh project data in case chapter order numbers were changed
    if (this.chapterFormModalComponent.crudMethodMode == this.crudMethodModeEnum.DELETE) {
      this.setCurrentChapter(undefined) // Clear current chapter
      this.getProjectById()
      return
    }

    // When creating a chapter, update the current chapter if none is being displayed
    if (!this.currentChapter && this.chapterFormModalComponent.crudMethodMode == this.crudMethodModeEnum.CREATE) {
      this.currentChapter = chapter
    }

      // Only update the current chapter data if user edited the same chapter
    if (this.currentChapter?.id == chapter.id)
      { this.setCurrentChapter(chapter) }

    this.currentProject.chapters?.push(chapter) // Attach chapter

    this.sortChapters()
  }

  async sortChapters() {
     // Sort by order number
    this.currentProject.chapters?.sort((a, b) => {
      return a.orderNumber - b.orderNumber
    })
  }

  async getProjectById() {
    this.projectService.getProjectById(this.projectIdParam).subscribe({
      next: (res: Project) => {
        this.currentProject = res // Update visual display
        // Make sure the chapters are sorted
        this.sortChapters()
          // Assign the first chapter in the sorted list as the current chapter by default
          .then(() => {
            if (this.currentProject.chapters) {
              // this.currentChapter = this.currentProject.chapters ? this.currentProject.chapters[0] : undefined
              this.currentChapter = this.currentProject.chapters[0]
            }
          })

      },
      error: (err) => { console.log(err) }
    })
  }

  editProject(projectReqDto: ProjectReqDto) {
    if (projectReqDto) {
      this.projectService.updateProject(projectReqDto).subscribe({
        next: (res: Project) => {
          this.currentProject = res // Update visual display
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  // createChapter(chapterForm: Chapter) {
  //   this.chapterService.createChapter(chapterForm).subscribe({
  //     next: (res: Chapter) => {
  //       this.getProjectById() // Update visual display
  //     },
  //     error: (err) => { console.log(err) }
  //   })
  // }
  //
  // editChapter(chapterForm: Chapter) {
  //   if (chapterForm) {
  //     this.chapterService.updateChapter(chapterForm).subscribe({
  //       next: (res: Chapter) => {
  //         this.getProjectById() // Update visual display
  //       },
  //       error: (err) => { console.log(err) }
  //     })
  //   }
  // }
  //
  // removeChapter(chapterId: string) {
  //   if (chapterId.length > 0) {
  //     this.chapterService.removeChapter(chapterId).subscribe({
  //       next: (res: Chapter) => {
  //         this.getProjectById() // Update visual display
  //       },
  //       error: (err) => { console.log(err) }
  //     })
  //   }
  // }

}
