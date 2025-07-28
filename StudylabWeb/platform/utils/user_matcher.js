export function getTipoUserByName(nameOption) {
    const userMatcher = {
        "student": 0,
        "admin": 1,
        "prof": 2,
    };

    return userMatcher[nameOption];
}