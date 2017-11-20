var authorization_request_1 = require("./node_modules/@openid/appauth/built/authorization_request");
var authorization_request_handler_1 = require("./node_modules/@openid/appauth/built//authorization_request_handler");
var authorization_service_configuration_1 = require("./node_modules/@openid/appauth/built/authorization_service_configuration");
var token_request_1 = require("./node_modules/@openid/appauth/built/token_request");

var token_request_handler_1 = require("./node_modules/@openid/appauth/built/token_request_handler");
var node_request_handler_1 = require("./node_modules/@openid/appauth/built/node_support/node_request_handler");
var node_requestor_1 = require("./node_modules/@openid/appauth/built/node_support/node_requestor");

var secret = require("./dist/secret.js");

const PORT = 8000;
const redirectURL = "http://localhost:"+PORT;
const scope = "openid";
const openIdConnectUrl = 'https://accounts.google.com';

/* the Node.js based HTTP client. */
var requestor = new node_requestor_1.NodeRequestor();

class App{
    constructor(){
        this.notifier = new authorization_request_handler_1.AuthorizationNotifier();
        this.authorizationHandler = new node_request_handler_1.NodeBasedHandler(PORT);
        this.tokenHandler = new token_request_handler_1.BaseTokenRequestHandler(requestor);
        this.authorizationHandler.setAuthorizationNotifier(this.notifier);

        this.fetchConfig = this.fetchConfig.bind(this);
        this.getRefreshToken = this.getRefreshToken.bind(this);
        this.authCodeRequest = this.authCodeRequest.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);

        this.configuration = {};

        this.notifier.setAuthorizationListener(function (request, response, error) {
            console.log('Authorization request complete ', request, response, error);

            if (response) {
                this.getRefreshToken(this.configuration, response.code).then(function(refreshToken){
                    this.getAccessToken(this.configuration, refreshToken).then(function(){
                        console.log("Done");
                    })
                }.bind(this));
            }

        }.bind(this))
    }

    fetchConfig() {
      return authorization_service_configuration_1.AuthorizationServiceConfiguration.fetchFromIssuer(openIdConnectUrl, requestor)
        .then(function (response) {
            console.log('Fetched service configuration', response);
            this.configuration = response;

            return response;
        }.bind(this));
    };


    authCodeRequest(config){
        // create a request
        var request = new authorization_request_1.AuthorizationRequest(secret.CLIENTID, redirectURL, scope, authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_CODE, undefined, /* state */ { 'prompt': 'consent', 'access_type': 'offline' });

        console.log('Making authorization request ', config, request);
        this.authorizationHandler.performAuthorizationRequest(config, request);
    }

    getRefreshToken(config, code) {
        console.log("Requesting Refresh Token", code);

        // use the code to make the token request.
        var request = new token_request_1.TokenRequest(secret.CLIENTID, redirectURL, token_request_1.GRANT_TYPE_AUTHORIZATION_CODE, code, undefined, {"client_secret":secret.SECRET});

        return this.tokenHandler.performTokenRequest(config, request).then(function (response) {
            console.log("Refresh Token is " + response.refreshToken);
            return response.refreshToken;
        });
    }
    
    getAccessToken(config, refreshToken){
        console.log("Getting Access Token");

        var request = new token_request_1.TokenRequest(secret.CLIENTID, redirectURL, token_request_1.GRANT_TYPE_REFRESH_TOKEN, undefined, refreshToken, {"client_secret":secret.SECRET});

        return this.tokenHandler.performTokenRequest(config, request).then(function (response) {
            console.log("Access Token is " + response.accessToken);
            return response;
        });
    }
}

var app = new App();
app.fetchConfig().then(function(config) {
    console.log("Making auth code request");
    this.configuration = config;
    app.authCodeRequest(config);
});