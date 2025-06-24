export function toggleItemInList(list: number[], item: number): number[] {
    return list.includes(item)
        ? list.filter(i => i !== item)
        : [...list, item];
}
