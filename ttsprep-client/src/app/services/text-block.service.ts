import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TextBlock} from "../models/textBlock";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TextBlockService {
  private textBlockControllerUrl: string = "TextBlock" // TextBlockController
  constructor(private http: HttpClient) { }

  getAllTextBlocks(): Observable<TextBlock[]> {
    return this.http.get<TextBlock[]>
    (`${environment.apiUrl}/${this.textBlockControllerUrl}/GetAllTextBlocks`)
  }

  getTextBlocksByChapterId(chapterId: string): Observable<TextBlock[]> {
    return this.http.get<TextBlock[]>
    (`${environment.apiUrl}/${this.textBlockControllerUrl}/GetTextBlocksByChapterId/${chapterId}`)
  }

  getTextBlockById(textBlockId: string): Observable<TextBlock> {
    return this.http.get<TextBlock>
    (`${environment.apiUrl}/${this.textBlockControllerUrl}/GetTextBlockById/${textBlockId}`)
  }

  createTextBlock(textBlockForm: TextBlock): Observable<TextBlock> {
    return this.http.post<TextBlock>
    (`${environment.apiUrl}/${this.textBlockControllerUrl}/CreateTextBlock`, textBlockForm)
  }

  updateTextBlock(textBlockForm: TextBlock): Observable<TextBlock> {
    return this.http.put<TextBlock>
    (`${environment.apiUrl}/${this.textBlockControllerUrl}/UpdateTextBlock`, textBlockForm)
  }

  removeTextBlock(textBlockId: string): Observable<TextBlock> {
    return this.http.delete<TextBlock>
    (`${environment.apiUrl}/${this.textBlockControllerUrl}/RemoveTextBlock/${textBlockId}`)
  }
}
