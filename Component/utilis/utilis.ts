import dayjs from "dayjs"
import "dayjs/locale/fr"

dayjs.locale("fr")

export const ResponseDateDisplay = (Responsedate: Date | string) => {
    const date = dayjs(Responsedate)
    if (!date.isValid()) return ""

    const now = dayjs()
    const minutes = now.diff(date, "minute")
    const hours = now.diff(date, "hour")
    const days = now.diff(date, "day")

    if (minutes < 1) {
        return "À l'instant"
    } else if (minutes < 60) {
        return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`
    } else if (hours < 24) {
        return `il y a ${hours} heure${hours > 1 ? "s" : ""}`
    } else if (days <= 1) {
        return "hier"
    }

    return date.format("D MMMM YYYY [à] HH:mm")
}
