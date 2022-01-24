const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').userModel;

// export 一個function, 需要一個參數, 參數丟入passport
module.exports = (passport) => {
  var opts = {};

  // header
  // key Authorization
  // value XXXXXX
  // 從header的auth找到jwt這個token
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      console.log('payload->', jwt_payload);
      // _id? id?
      // 這邊是mongoose的語法? findOne 後面一個callBack要執行的事情?
      
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          console.log('paylodUser--->', user)
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};

// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const User = require('../models').userModel;

// module.exports = (passport) => {
//   let opts = {};
//   opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
//   opts.secretOrKey = process.env.PASSPORT_SECRET;
//   passport.use(
//     new JwtStrategy(opts, function (jwt_payload, done) {
//       User.findOne({ id: jwt_payload.id }, (err, user) => {
//         if (err) {
//           return done(err, false);
//         }
//         if (user) {
//           done(null, user);
//         } else {
//           done(null, false);
//         }
//       });
//     })
//   );
// };
