export function getCursoCodeByName(nameCurso) {
    const cursoMatcher = {
        "ES": 1,
        "CC": 2
    };
    return cursoMatcher[nameCurso];
}