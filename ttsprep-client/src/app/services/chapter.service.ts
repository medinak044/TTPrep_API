import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Chapter} from "../models/chapter";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private chapterControllerUrl: string = "Chapter" // ChapterController
  constructor(private http: HttpClient) { }

  getAllChapters(): Observable<Chapter[]> {
    return this.http.get<Chapter[]>
    (`${environment.apiUrl}/${this.chapterControllerUrl}/GetAllChapters`)
  }

  getChaptersByProjectId(projectId: string): Observable<Chapter[]> {
    return this.http.get<Chapter[]>
    (`${environment.apiUrl}/${this.chapterControllerUrl}/GetChaptersByProjectId/${projectId}`)
  }

  getChapterById(chapterId: string): Observable<Chapter> {
    return this.http.get<Chapter>
    (`${environment.apiUrl}/${this.chapterControllerUrl}/GetChapterById/${chapterId}`)
  }

  createChapter(chapterForm: Chapter): Observable<Chapter> {
    return this.http.post<Chapter>
    (`${environment.apiUrl}/${this.chapterControllerUrl}/CreateChapter`, chapterForm)
  }

  updateChapter(chapterForm: Chapter): Observable<Chapter> {
    return this.http.put<Chapter>
    (`${environment.apiUrl}/${this.chapterControllerUrl}/UpdateChapter`, chapterForm)
  }

  updateChapterOrderNumber(chapterForm: Chapter): Observable<Chapter> {
    return this.http.put<Chapter>
    (`${environment.apiUrl}/${this.chapterControllerUrl}/UpdateChapterOrderNumber`, chapterForm)
  }

  removeChapter(chapterId: string): Observable<Chapter> {
    return this.http.delete<Chapter>
    (`${environment.apiUrl}/${this.chapterControllerUrl}/RemoveChapter/${chapterId}`)
  }
}
