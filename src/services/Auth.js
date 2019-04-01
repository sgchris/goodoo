import React from 'react'

const API_KEY = 'AIzaSyBHW8c_z5Q2DgA8vdP7fA8XI7LlgsvDiMY';
const CLIENT_ID = '710244711285-m1ioc2b9c3aoi9n0v69jacf5aaoct0l0.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/tasks";
// const CLIENT_SECRET = 'AL7LY7OOPfa225aEUwoILuxx';

class GoogleAuth {

    authName = 'google';

    // wait for google API to load (the script tag to finish loading)
    async _withGoogleApi(callbackFn) {
        let that = this;
        // check if the script has already loaded, if not, wait for 500ms
        // and try again
        if (typeof(window.gapi) == 'undefined') {
            setTimeout(() => {
                console.log('waiting for google api script');
                that._withGoogleApi(callbackFn);
            }, 500);
        } else { 
            const bindCallbackFn = callbackFn.bind(this);
            bindCallbackFn();
        }
    }

    /**
     *  Sign in
     */
    signIn() {
        this._withGoogleApi(() => {
            window.gapi.auth2.getAuthInstance().signIn();
        });
    }

    /**
     *  Sign out
     */
    signOut() {
        this._withGoogleApi(() => {
            window.gapi.auth2.getAuthInstance().signOut();
        });
    }

    /**
     * Initialize the authentication, and assign the update auth function
     * to listen to auth status change
     * 
     * @param {function} updateSigninStatusFn Callback when auth status changes
     * @param {function} failureCallbackFn Failure callback
     */
    init(updateSigninStatusFn, failureCallbackFn) {
        this._withGoogleApi(() => {
            window.gapi.load('client:auth2', () => {
                window.gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES
                }).then(() => {
                    // Listen for sign-in state changes.
                    window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatusFn);
                    
                    // Handle the initial sign-in state.
                    updateSigninStatusFn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
                }, error => {
                    console.error('google init error', error);
                    if (typeof(failureCallbackFn) == 'function') {
                        failureCallbackFn();
                    }
                });
            });
        })
    }


}

export const googleAuth = new GoogleAuth();

const authContext = React.createContext({});
export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;
