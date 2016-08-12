import cookie from 'react-cookie';

function isLoggedIn(){
    return cookie.load('user');
}

function isAdmin(){
    return cookie.load('user').admin;
}

function getNetId(){
    return cookie.load('user').netid;
}

export {isLoggedIn, isAdmin, getNetId};