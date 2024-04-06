const AUTH_TOKEN = "authToken"

export function hasCredentialsSave() {
    return localStorage.getItem(AUTH_TOKEN) !== null
}

export function getUserCredentials() {
    return localStorage.getItem(AUTH_TOKEN)
}

export function getUserInfo() {
    
}

export function saveUserCredentials(token) {
    localStorage.setItem(AUTH_TOKEN, token)
}