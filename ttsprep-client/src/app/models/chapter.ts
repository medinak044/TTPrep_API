import {TextBlock} from "./textBlock";
import {TextBlockLabel} from "./textBlockLabel";

export interface Chapter {
  id: string
  title?: string
  orderNumber: number
  projectId: string
  textBlocks?: TextBlock[]
  TextBlockLabels?: TextBlockLabel[]
}
