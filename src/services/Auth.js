import React from 'react'

const API_KEY = 'AIzaSyBHW8c_z5Q2DgA8vdP7fA8XI7LlgsvDiMY';
const CLIENT_ID = '710244711285-m1ioc2b9c3aoi9n0v69jacf5aaoct0l0.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/tasks";
// const CLIENT_SECRET = 'AL7LY7OOPfa225aEUwoILuxx';

class GoogleAuth {
    
    // check that <script> is in
    googleApiScriptLoaded = false;

    // "init" method was called
    objectInitialized = false;

    // wait for google API to load (the script tag to finish loading)
    async _withGoogleApi(callbackFn) {
        let that = this;
        // check if the script has already loaded, if not, wait for 500ms
        // and try again
        if (typeof(window.gapi) == 'undefined') {

            // check if the script is in the doc
            if (!that.googleApiScriptLoaded) {
                let gapiScriptTag = document.createElement('script');
                gapiScriptTag.setAttribute('src', "https://apis.google.com/js/api.js");
                document.querySelector('body').appendChild(gapiScriptTag);
                that.googleApiScriptLoaded = true;
            }

            setTimeout(() => {
                console.log('waiting for google api script');
                that._withGoogleApi(callbackFn);
            }, 500);
        } else { 
            const bindCallbackFn = callbackFn.bind(this);
            bindCallbackFn();
        }
    }

    isSignedIn() {
        return window.gapi.auth2.getAuthInstance().isSignedIn.get();
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
        if (this.objectInitialized) {
            return;
        }

        let that = this;
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

                    that.objectInitialized = true;
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


// return singleton
if (typeof(window.__googleAuth) == 'undefined') {
    window.__googleAuth = new GoogleAuth();
}
export const GoogleAuth = window.__googleAuth;

// return context obj
export const AuthContext = React.createContext({});
export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;
