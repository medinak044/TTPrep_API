import {Speaker} from "./speaker";
import {TextBlockLabel} from "./textBlockLabel";

export interface TextBlock {
  id: string
  orderNumber: number
  originalText?: string
  modifiedText?: string
  chapterId: string
  speakerId?: string
  speaker?: Speaker
  textBlockLabelId?: string
  textBlockLabel?: TextBlockLabel
}
