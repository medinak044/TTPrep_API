import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Word} from "../models/word";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private wordControllerUrl: string = "Word" // WordController
  constructor(private http: HttpClient) { }

  getAllWords(): Observable<Word[]> {
    return this.http.get<Word[]>
    (`${environment.apiUrl}/${this.wordControllerUrl}/GetAllWords`)
  }

  GetWordsByProjectId(projectId: string): Observable<Word[]> {
    return this.http.get<Word[]>
    (`${environment.apiUrl}/${this.wordControllerUrl}/GetWordsByProjectId/${projectId}`)
  }

  getWordById(wordId: string): Observable<Word> {
    return this.http.get<Word>
    (`${environment.apiUrl}/${this.wordControllerUrl}/GetWordById/${wordId}`)
  }

  createWord(wordForm: Word): Observable<Word> {
    return this.http.post<Word>
    (`${environment.apiUrl}/${this.wordControllerUrl}/CreateWord`, wordForm)
  }

  updateWord(wordForm: Word): Observable<Word> {
    return this.http.put<Word>
    (`${environment.apiUrl}/${this.wordControllerUrl}/UpdateWord`, wordForm)
  }

  removeWord(wordId: string): Observable<Word> {
    return this.http.delete<Word>
    (`${environment.apiUrl}/${this.wordControllerUrl}/RemoveWord/${wordId}`)
  }
}
