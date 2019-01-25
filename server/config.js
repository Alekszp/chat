function ExtractJwt (req){
    let token = null;
    if(req.cookies && req.cookies.token != void(0)){
        token = req.cookies['token'];
    }
    return token;
}

const jwt = {
    jwtFromRequest: ExtractJwt,
    secretOrKey: 'Gkaj2gvJK86RY5fygkCxEp8gp44tTg7Kg5QK3M44G39wnWrR2D'
};

const expiresIn = '1 day';

export { jwt, expiresIn };