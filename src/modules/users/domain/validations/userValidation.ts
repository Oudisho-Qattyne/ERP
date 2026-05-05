export const isValidEmail = (email:string):boolean => {
    return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email);
}

export const isValidUsername = (username:string):boolean => {
    return username.length > 3 && username.length < 50
}

