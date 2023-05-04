export default function sumProp(obj: any, propName: string) {
    let total = 0;
    obj.forEach(element => {
        total += element[propName]
    })

    return total;
}