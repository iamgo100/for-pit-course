const express = require('express');
const app = express();
const port = 5000;
const path = require('path');
const session = require('express-session');

const passport = require('passport');
const YandexStrategy = require('passport-yandex').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

let users = [{"login": "admin", "email": "gufkz.tkrbyf@yandex.ru", "gitLogin": "iamgo100"}, 
            {"login": "user1", "email": "user1@yandex.ru", "gitLogin": "user1"}]

const findUserByLogin = (login) => {
    return users.find((el) => {
        return el.login == login;
    });
};

const findUserByEmail = (email) => {
    return users.find((el) => {
        return el.email.toLowerCase() == email.toLowerCase();
    });
};

const findUserByGitLogin = (gitLogin) => {
    return users.find((el) => {
        return el.gitLogin == gitLogin;
    });
};

app.use(session({secret: "supersecret", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.login);
});

passport.deserializeUser((login, done) => {
    user = findUserByLogin(login);
    done(null, user);
});

passport.use(new YandexStrategy({
    clientID: "d1d41811fcb34aef9848692a5611df78",
    clientSecret: "dee84b9be75848cf8b4e728ad70448b9",
    callbackURL: "http://localhost:5000/auth/yandex/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        let user = findUserByEmail(profile.emails[0].value);
        if (!user) return done(true, null);
        done(null, user);
    }
));

passport.use(new GitHubStrategy({
    clientID: "5eff404d48eb1d57786f",
    clientSecret: "ce1fdad23e6fd8e41365efc289e929807733eaa7",
    callbackURL: "http://localhost:5000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        let user = findUserByGitLogin(profile.username);
        if (!user) return cb(true, null);
        cb(null, user);
    }
));

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/sorry');
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "main.html"));
});

app.get('/sorry', (req, res) => {
    res.sendFile(path.join(__dirname, "sorry.html"));
});

app.get('/private', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "private.html"));
});

app.get('/auth/yandex', passport.authenticate('yandex'));

app.get('/auth/yandex/callback', passport.authenticate('yandex',
    { failureRedirect: '/sorry', successRedirect: '/private' })
);

app.get('/auth/github',
    passport.authenticate('github')
);
  
app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/sorry', successRedirect: '/private' })
);

app.listen(port, () => console.log(`Start on port ${port}`))
