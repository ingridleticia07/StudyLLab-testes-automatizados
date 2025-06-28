export function getCursoCodeByName(nameCurso) {
    const cursoMatcher = {
        "ES": 1,
        "CC": 2,
        "EM": 3,
        "EP": 4,
        "EC": 5
    };

    return cursoMatcher[nameCurso];
}