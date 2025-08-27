export function toggleAspect(
    id: number,
    list: number[],
    setList: (list: number[]) => void
) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
}
