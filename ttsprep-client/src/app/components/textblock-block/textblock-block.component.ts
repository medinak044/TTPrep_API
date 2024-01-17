import {Component, Input} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {TextBlockService} from "../../services/text-block.service";
import {TextBlock} from "../../models/textBlock";

@Component({
  selector: 'app-textblock-block',
  templateUrl: './textblock-block.component.html',
  styleUrls: ['./textblock-block.component.css']
})
export class TextblockBlockComponent {
  @Input() textBlock!: TextBlock

  constructor(
    public textBlockService: TextBlockService,
    private fb: FormBuilder
  ) { }
}
