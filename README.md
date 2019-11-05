#  [Example] Sign in with Apple for Passport.js

<a href="https://twitter.com/intent/follow?screen_name=ananayarora"><img src="https://img.shields.io/twitter/follow/ananayarora.svg?label=Follow%20@ananayarora" alt="Follow @ananayarora"></img></a>
</p>

**This repository is a how-to-use example for my library – passport-apple**

Check it out here:

https://github.com/ananay/passport-apple

https://npmjs.com/package/passport-apple


**Live on https://passport-apple.ananay.dev**

## Configuring

<p>Make sure you've followed the configuration guide here!</p>
<p>Setup your Apple Developer Account as follows:</p>
https://github.com/ananay/apple-auth/blob/master/SETUP.md

Configure the parameters here:
```
passport.use(new AppleStrategy({
    clientID: "",
    teamID: "",
    redirect_uri: "",
    keyID: "",
    privateKeyLocation: ""
}, function(accessToken, refreshToken, idToken, profile, cb) {
    // Here, check if the idToken exists in your database!
    cb(null, idToken);
}));
```

Also make sure you've placed your AuthKey file in the config folder as well!

## Questions / Contributing

Feel free to open issues and pull requests. If you would like to be one of the core creators of this library, please reach out to me at i@ananayarora.com or message me on twitter @ananayarora!

<h4> Created with ❤️ by <a href="https://ananayarora.com">Ananay Arora</a></h4>
