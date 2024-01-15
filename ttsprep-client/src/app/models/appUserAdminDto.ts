import { AppUser } from "./appUser"

// Modeled after "AppUserAdminDto" from api
export class AppUserAdminDto extends AppUser {
    roles?: string[]
}