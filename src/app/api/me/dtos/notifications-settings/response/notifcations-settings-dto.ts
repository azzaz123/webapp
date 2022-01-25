import { NotificationsDto } from "../../notifications/response/notifcations-dto";

export interface NotificationsSettingsDto {
  title: string,
  subtitle: string,
  notifications: NotificationsDto[]
}
