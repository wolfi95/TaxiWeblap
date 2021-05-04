import { MenuItem } from "@material-ui/core";

export default function getEnumAsOptions (enumType: any, enumName: string){
    var items = [];
    items.push(<MenuItem value={-1}>None</MenuItem>)
    for (let item in enumType) {
        if(!isNaN(Number(item))) {
            
            
            var fnString = enumName + "String";
            
            // @ts-ignore
            var fn = window[fnString];
            
            items.push(<MenuItem value={+item}>{fn(+item)}</MenuItem>)
        }
    }
    return items;
}