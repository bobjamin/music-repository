import {CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession, CognitoUserAttribute} from "amazon-cognito-identity-js";


function registerUser(username: string, password: string, email: string): Promise<void>{
    console.log('Registering User');
    return new Promise((resolve, reject) => {
        userPool().signUp(username, password, [new CognitoUserAttribute({ Name : 'email', Value : email })],null, (err, result) => {
            if(err){
                console.error(err);
                reject(err)
            }
            else{
                resolve();
            }
        })
    })
}

function userPool(): CognitoUserPool{
    return new CognitoUserPool({
        UserPoolId : 'eu-west-1_RYCwKGXfY',
        ClientId : '4avn56s118d6gi32a0bkhael90'
    });
}

function authenticateUser(username: string, password: string): Promise<CognitoUserSession>{
    console.log('Authenticating User');
    return new Promise((resolve, reject) => {
        new CognitoUser({ Username : username, Pool : userPool() })
            .authenticateUser(new AuthenticationDetails({ Username : username,  Password : password }), {
                onSuccess: (result: CognitoUserSession) => {
                    resolve(result)
                },
                onFailure: (err) => { console.error(err); reject(err) }
            });
    });
}

export const AUTH_SUCCESS = 'auth/AUTH_SUCCESS';
export const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
export const AUTH_FAILURE = 'auth/AUTH_FAILURE';
export const LOGGING_IN = 'auth/LOGGING_IN';


const initialState = {
    authorized: false,
    loggingIn: false,
    authFailReason: null,
    authTokens: null,
    user: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                authorized: false,
                loggingIn: false,
                authFailReason: "Registered Successfully, Verify by clicking the link that has been emailed to you then log in.",
                authTokens: null,
                user: null
            };
        case AUTH_SUCCESS:
            console.log('Auth Success');
            return {
                ...state,
                authorized: true,
                loggingIn: false,
                authFailReason: null,
                authTokens: action.authTokens,
                user: action.user
            };
        case AUTH_FAILURE: {
            console.log('Auth Failure ' + action.payload);
            return {
                ...state,
                authorized: false,
                loggingIn: false,
                authFailReason: action.payload,
                authTokens: null,
                user: null
            };
        }
        case LOGGING_IN:{
            return {
                ...state,
                authorized: false,
                loggingIn: true,
                authFailReason: null,
                authTokens: null,
                user: null
            }
        }
        default: return state;
    }
}

export const authenticate = (username, password) =>  dispatch => {
    console.log(username);
    dispatch({ type: LOGGING_IN });
    authenticateUser(username, password)
        .then((result) => dispatch({ type: AUTH_SUCCESS, authTokens: result, user: username }) )
        .catch((err) => {console.log(err);dispatch({ type: AUTH_FAILURE, payload: err.message }) });
};

export const register = (username, password, email) =>  dispatch => {
    console.log(username);
    dispatch({ type: LOGGING_IN });
    registerUser(username, password, email)
        .then((result) => dispatch({ type: REGISTER_SUCCESS, authTokens: result, user: username }) )
        .catch((err) => {console.log(err);dispatch({ type: AUTH_FAILURE, payload: err.message }) });
};