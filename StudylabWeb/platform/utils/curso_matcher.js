export function getCursoCodeByName(nameCurso) {
    const cursoMatcher = {
        "ES": 1,
        "CC": 2,
        "EC": 3,
        "EP": 4,
        "EM": 5
    };

    return cursoMatcher[nameCurso];
}