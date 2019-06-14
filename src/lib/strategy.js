/**
 * Passport Strategy that implements "Sign in with Apple"
 * @author: Ananay Arora <i@ananayarora.com>
 */

const OAuth2Strategy = require('passport-oauth2'),
    crypto = require('crypto'),
    AppleClientSecret = require("./token"),
    util = require('util')
    querystring = require('querystring'),
    jwt = require('jsonwebtoken');

/**
 * Passport Strategy Constructor
 * 
 * Example:
 * 
 *   passport.use(new AppleStrategy({
 *      clientID: "",
 *      teamID: "",
 *      callbackURL: "",
 *      keyID: "",
 *      privateKeyLocation: ""
 *   }, function(accessToken, refreshToken, idToken, profile, cb) {
 *       // Here, check if the idToken exists in your database!
 *       cb(null, idToken);
 *   }));
 *  
 * @param {object} options - Configuration options
 * @param {string} options.clientID – Client ID (also known as the Services ID
 *  in Apple's Developer Portal). Example: com.ananayarora.app
 * @param {string} options.teamID – Team ID for the Apple Developer Account
 *  found on top right corner of the developers page
 * @param {string} options.keyID – The identifier for the private key on the Apple
 *  Developer Account page
 * @param {string} options.callbackURL – The identifier for the private key on the Apple
 *  Developer Account page
 * @param {string} options.privateKeyLocation - Location to the private key
 * @param {function} verify
 */
function Strategy(options, verify) {
    
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://appleid.apple.com/auth/authorize';
    options.tokenURL = options.tokenURL || 'https://appleid.apple.com/auth/token';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'apple';
    const _tokenGenerator = new AppleClientSecret({
        "client_id": options.clientID,
        "team_id": options.teamID,
        "key_id": options.keyID
    }, options.privateKeyLocation);

    this._oauth2.getOAuthAccessToken = function(code, params, callback) {
        _tokenGenerator.generate().then((client_secret) => {
            params = params || {};
            const codeParam = params.grant_type === 'refresh_token' ? 'refresh_token' : 'code';
            params[codeParam] = code;
            params['client_id'] = this._clientId;
            params['client_secret'] = client_secret;

            const post_data = querystring.stringify(params);
            const post_headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            this._request(
                'POST',
                this._getAccessTokenUrl(),
                post_headers,
                post_data,
                null,
                function(error, data, response) {
                    if (error) {
                        console.log(error);
                        callback(error);
                    } else {
                        var results = JSON.parse(data);
                        var access_token = results.access_token;
                        var refresh_token = results.refresh_token;
                        var id_token = jwt.decode(results.id_token).sub;
                        callback(null, access_token, refresh_token, id_token, results);
                    }
                }
            )
        }).catch((error) => {
            console.log(error);
        });
    }
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authenticate = function(req, options) {
    OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

Strategy.prototype.authorizationParams = function (options) {
    options.state = crypto.randomBytes(5).toString('hex');
    return options;
}

// Strategy.prototype.userProfile = function(access_token, done) {
//     console.log("ACCESSTOKEN", access_token);
// }

module.exports = Strategy;