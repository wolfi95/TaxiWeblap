export const dateToString = (date: any) => {
    var d = new Date(date);
    return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + (d.getHours() % 12) + ":" + (d.getMinutes() < 10 ? ("0"+d.getMinutes()) : d.getMinutes()) + (d.getHours() >= 12 ? ' pm' : ' am')
}