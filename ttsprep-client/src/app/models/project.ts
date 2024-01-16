import {Chapter} from "./chapter";
import {Word} from "./word";
import {Speaker} from "./speaker";

export interface Project {
    id: string
    title?: string
    description?: string
    createdDate?: string
    lastModifiedDate: string
    ownerId?: string
    chapters?: Chapter[]
    words?: Word[]
    speakers?: Speaker[]
}
