import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TextBlockLabel} from "../models/textBlockLabel";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TextBlockLabelService {
  private textBlockLabelControllerUrl: string = "TextBlockLabel" // TextBlockLabelController
  constructor(private http: HttpClient) { }

  getAllTextBlockLabels(): Observable<TextBlockLabel[]> {
    return this.http.get<TextBlockLabel[]>
    (`${environment.apiUrl}/${this.textBlockLabelControllerUrl}/GetAllTextBlockLabels`)
  }

  getTextBlockLabelsByChapterId(chapterId: string): Observable<TextBlockLabel[]> {
    return this.http.get<TextBlockLabel[]>
    (`${environment.apiUrl}/${this.textBlockLabelControllerUrl}/GetTextBlockLabelsByChapterId/${chapterId}`)
  }

  getTextBlockLabelById(textBlockLabelId: string): Observable<TextBlockLabel> {
    return this.http.get<TextBlockLabel>
    (`${environment.apiUrl}/${this.textBlockLabelControllerUrl}/GetTextBlockLabelById/${textBlockLabelId}`)
  }

  createTextBlockLabel(textBlockLabelForm: TextBlockLabel): Observable<TextBlockLabel> {
    return this.http.post<TextBlockLabel>
    (`${environment.apiUrl}/${this.textBlockLabelControllerUrl}/CreateTextBlockLabel`, textBlockLabelForm)
  }

  updateTextBlockLabel(textBlockLabelForm: TextBlockLabel): Observable<TextBlockLabel> {
    return this.http.put<TextBlockLabel>
    (`${environment.apiUrl}/${this.textBlockLabelControllerUrl}/UpdateTextBlockLabel`, textBlockLabelForm)
  }

  removeTextBlockLabel(textBlockLabelId: string): Observable<TextBlockLabel> {
    return this.http.delete<TextBlockLabel>
    (`${environment.apiUrl}/${this.textBlockLabelControllerUrl}/RemoveTextBlockLabel/${textBlockLabelId}`)
  }
}
