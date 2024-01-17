import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {TextBlockService} from "../../services/text-block.service";
import {TextBlock} from "../../models/textBlock";
import {CrudMethodsEnum} from "../chapter-form-modal/chapter-form-modal.component";
import {Chapter} from "../../models/chapter";

@Component({
  selector: 'app-textblock-form-modal',
  templateUrl: './textblock-form-modal.component.html',
  styleUrls: ['./textblock-form-modal.component.css']
})
export class TextblockFormModalComponent implements OnInit {
  currentChapter?: Chapter // The current chapter from the parent component
  textBlock?: TextBlock
  crudMethodMode!: CrudMethodsEnum
  @Output() signalParentComponent: EventEmitter<TextBlock> = new EventEmitter<TextBlock>() // Update the specific text block

  crudMethodModeEnum = CrudMethodsEnum;

  formGroup: FormGroup = this.fb.group({
    id: [''],
    label: [''],
    orderNumber: [1],
    originalText: [''],
    modifiedText: [''],
    chapterId: [''],
    speakerId: [''],
  })

  constructor(
    public textBlockService: TextBlockService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initiateForm()
  }

  initiateForm() {
    // Create
    if (this.crudMethodMode == this.crudMethodModeEnum.CREATE) {
      this.formGroup = this.fb.group({
        id: [''],
        label: [''],
        orderNumber: [1],
        originalText: [''],
        modifiedText: [''],
        chapterId: [''],
        speakerId: [''],
      })
    }

    // Edit and Delete
    if (this.textBlock && (
      this.crudMethodMode == this.crudMethodModeEnum.UPDATE
      || this.crudMethodMode == this.crudMethodModeEnum.DELETE)) {
      const {
        id,
        label,
        orderNumber,
        originalText,
        modifiedText,
        chapterId,
        speakerId,
      } = this.textBlock

      this.formGroup = this.fb.group({
        id: [id],
        label: [label],
        orderNumber: [orderNumber],
        originalText: [originalText],
        modifiedText: [modifiedText],
        chapterId: [chapterId],
        speakerId: [speakerId],
      })
    }

  }

  onSubmit() {
    let textBlock: TextBlock = this.formGroup.value

    if (this.crudMethodMode == this.crudMethodModeEnum.CREATE) {
      textBlock.chapterId = this.currentChapter!.id
      this.createTextBlock(textBlock)
    }
    else if (this.crudMethodMode == this.crudMethodModeEnum.UPDATE) {this.updateTextBlock(textBlock)}
    else if (this.crudMethodMode == this.crudMethodModeEnum.DELETE) {this.removeTextBlock(textBlock.id)}

  }

  createTextBlock(textBlockForm: TextBlock) {
    this.textBlockService.createTextBlock(textBlockForm).subscribe({
      next: (res: TextBlock) => {
        this.signalParentComponent.emit(res)
      },
      error: (err) => { console.log(err) }
    })
  }

  updateTextBlock(textBlockForm: TextBlock) {
    if (textBlockForm) {
      this.textBlockService.updateTextBlock(textBlockForm).subscribe({
        next: (res: TextBlock) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  // TODO: Make sure api changes ALL the affected order numbers (if 3 was deleted, change only > 3)
  removeTextBlock(textBlockId: string) {
    if (textBlockId.length > 0) {
      this.textBlockService.removeTextBlock(textBlockId).subscribe({
        next: (res: TextBlock) => {
          this.signalParentComponent.emit(res)
        },
        error: (err) => { console.log(err) }
      })
    }
  }

}
