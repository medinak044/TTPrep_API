import {Speaker} from "./speaker";
import {TextBlockLabel} from "./textBlockLabel";

export interface TextBlock {
  id: string
  label?: string // X
  orderNumber: number
  originalText?: string
  modifiedText?: string
  chapterId: string
  speakerId?: string
  speaker?: Speaker
  textBlockLabelId?: string
  textBlockLabel?: TextBlockLabel
}
