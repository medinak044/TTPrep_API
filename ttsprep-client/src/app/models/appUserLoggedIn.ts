// Modeled after "LoginResDto" from api
export class AppUserLoggedIn {
  id = ""
  userName = ""
  email = ""
  dateCreated = ""
  dateCreatedStr = ""
  token = "" // Includes Id, UserName, Email in claims
  refreshToken = ""

  roles?: string[]
}
