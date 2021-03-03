export function formatDate(date, withTime = true) {
  // Formata date para: "%d/%m/%Y %H:%M"

  // %m/%d/%Y
  let dayStr = '0' + date.getDate().toString()
  dayStr = dayStr.slice(dayStr.length-2, )

  let monthStr = '0' + (date.getMonth() + 1).toString()
  monthStr = monthStr.slice(monthStr.length-2, )

  let yearStr = date.getFullYear().toString()

  if (withTime){

    let hourStr = '0' + date.getHours().toString()
    hourStr = hourStr.slice(hourStr.length-2, )

    let minuteStr = '0' + date.getMinutes().toString()
    minuteStr = minuteStr.slice(minuteStr.length-2, )

    return `${dayStr}/${monthStr}/${yearStr} ${hourStr}:${minuteStr}`
  }

  else {
    return `${dayStr}/${monthStr}/${yearStr}`
  }
  
}