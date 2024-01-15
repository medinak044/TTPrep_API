import { AppUserDto } from "./appUserDto"

// Modeled after "AppUserAdminDto" from api
export class AppUserAdminDto extends AppUserDto {
    roles?: string[]
}