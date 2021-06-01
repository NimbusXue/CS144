var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c'));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
const MongoClient = require('mongodb').MongoClient;
const options = { useUnifiedTopology: true, writeConcern: { j: true } };
const url = 'mongodb://localhost:27017';
const commonmark = require('commonmark');
let db;

MongoClient.connect(url, options, function(err, client) {
  console.log("Connected successfully to server");
  db = client.db("BlogServer");
});

let jwt_cookie;

app.get('/blog/:username/:postid', async(req, res) => {
  try {
    let single_post = await db.collection('Posts').find({ $and: [ { username: req.params.username }, { postid: parseInt(req.params.postid) } ] }  ).sort( { postid: 1 }).toArray();

    if (single_post.length <= 0) {
      res.sendStatus(404);
      return;
    }
    res.render('index', { posts: single_post, commonmark: commonmark, next: null });
  } catch(err) {
    res.sendStatus(400);
  }
});

app.get('/blog/:username', async(req, res) => {
  try {
    let user = await db.collection('Users').find({ username: req.params.username }).toArray();
    if (user.length <= 0) {
      res.sendStatus(404);
      return;
    }
    let start = req.query.start;
    if (start === undefined) {
      start = 1;
    }
    let next;
    let posts = await db.collection('Posts').find({ $and: [ { username: req.params.username }, { postid: { $gte: parseInt(start) } } ] }  ).sort( { postid: 1 }).toArray();

    if (posts.length > 5) {
      next = "?start=" + posts[5].postid;
      posts = posts.slice(0, 5); 
    }
    res.render('index', { posts: posts, commonmark: commonmark, next: next });
  } catch(err) {
    res.sendStatus(400);
  }
});

app.get('/blog', async(req, res) => {
  res.sendStatus(404);
})

app.get('/login', async(req, res) => {
  try {
    let redirect_link = req.query.redirect;
    if (redirect_link === undefined) {
      redirect_link = null;
    }
    res.status(200).render('login', {  redirect: redirect_link });
  } catch(err) {
    res.sendStatus(400);
  }
})

app.post('/login', async(req, res) => {
  try {
    if (req.body.username=== undefined || req.body.password=== undefined){
      res.status(401);
      res.render('login', {  redirect: req.body.redirect });
      return;
    }
    
    let users = await db.collection('Users').find({ username: req.body.username }).toArray();
    // console.log(users);
    if (users.length<=0){
      res.status(401);
      res.render('login', { redirect: req.body.redirect });
      return;
    }
    // console.log("body password");
    // console.log(req.body.password);
    // console.log("user password");
    // console.log(users[0].password);
    let match = await bcrypt.compare(req.body.password, users[0].password);
    if (match === false) {
      res.status(401);
      res.render('login', {  redirect: req.body.redirect });
      return;
    }
    // res.sendStatus(401);

    jwt.sign({ "exp": Math.floor(Date.now() / 1000) + (2 * 60 * 60), "usr": req.body.username }, 
    'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', 
    { header: { alg: "HS256",typ: "JWT" } }, function(err, token) {
      console.log("token value");
      console.log(token);
      jwt_cookie=token;
      res.cookie('jwt', token);
      // res.cookie('jwt', token, { signed: true});
      
      if (req.body.redirect) {
        res.setHeader("Location", req.body.redirect);
        res.redirect(302,req.body.redirect);
        // console.log("below is the location header");
        // console.log(res.getHeader("Location"));
      }
      else {
        res.status(200).send("the authentication was successful");
        return;
      }
    });
  } catch(err) {
    res.sendStatus(400);
    return;
  }

})






app.get('/api/posts', async(req, res) => {
  try {
    if(req.query.username === undefined){
      res.sendStatus(400);
      return;

    }
    console.log("req.signedCookies.jwt value");
    console.log(req.cookies.jwt);
    jwt.verify(req.cookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', async(err, decoded) => {
      console.log("decoded value");
      console.log(decoded);
      if (!decoded) {
        res.sendStatus(401);
        return;
      }
      if (Date.now()/1000 > decoded.exp) {
        res.sendStatus(401);
        return;
      }
      if (decoded.usr !== req.query.username) {
        res.sendStatus(401);
        return;
      }
      if (req.query.postid===undefined){
        // res.sendStatus(402);
        res.setHeader('Content-Type', 'application/json');
        let user = await db.collection('Users').find({ username: req.query.username }).toArray();
        if (user.length <= 0) {
          res.status(200).send([]);
          return;
        }
        let posts = await db.collection('Posts').find({ username: req.query.username }).toArray();
        if (posts.length<=0) {
          res.status(200).send([]);
          return;
        }else{
          res.status(200).send(posts);
          return;
        }
        // console.log(posts);
        

      }else{
        res.setHeader('Content-Type', 'application/json');
        let single_post = await db.collection('Posts').find({ $and: [ { "username": req.query.username }, { "postid": parseInt(req.query.postid) } ] }  ).toArray();
        if(single_post.length<=0){
          res.sendStatus(404);
          return;
        }else{
          res.status(200).send(single_post);
          return;
        }

      }
      
    })
  } catch(err) {
    res.sendStatus(400);
    return;
  }

});




app.delete('/api/posts', async(req, res) => {
  try {
    if(req.query.username === undefined || req.query.postid=== undefined){
      res.sendStatus(400);
      return;
    }
    console.log("req.signedCookies.jwt inside delete");
    console.log(jwt_cookie);
   
    jwt.verify(req.cookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', async(err, decoded) => {
      console.log(decoded);
      if (!decoded) {
        res.sendStatus(401);
        return;
      }
      
      if (Date.now()/1000 > decoded.exp) {
        res.sendStatus(401);
        return;
      }
      
      if (decoded.usr !== req.query.username) {
        res.sendStatus(401);
        return;
      }
      
      let single_post = await db.collection('Posts').find({ $and: [ { username: req.query.username }, { postid: parseInt(req.query.postid) } ] }  ).sort( { postid: 1 }).toArray();
      if(single_post.length<=0){
        res.sendStatus(404);
        return;
      }else{
        let delete_post = await db.collection('Posts').deleteOne({ $and : [{ username: req.query.username }, { postid: parseInt(req.query.postid) }]});
        res.sendStatus(204);
        return;
      }
      
    })
    // res.sendStatus(204);
  } catch(err) {
    res.sendStatus(404);
    return;
  }

});


app.post('/api/posts', async(req, res) => {
  try {
    if(req.body.username === undefined || req.body.postid=== undefined || req.body.title=== undefined || req.body.body=== undefined ){
      // console.log("here 1");
      res.sendStatus(400);
      return;
    }
    jwt.verify(req.cookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', async(err, decoded) => {
      if (!decoded) {
        res.sendStatus(401);
        return;
      }
      if (Date.now()/1000 > decoded.exp) {
        res.sendStatus(401);
        return;
      }
      if (decoded.usr !== req.body.username) {
        res.sendStatus(401);
        return;
      }
      if(parseInt(req.body.postid)===0){
        res.setHeader('Content-Type', 'application/json');
        let user = await db.collection('Users').find({ username: req.body.username }).toArray();
        let maxid = user[0].maxid+1;
        let time=Date.now();
        let insert = await db.collection('Posts').insertOne({ "postid": maxid , "username": req.body.username, "created": time, "modified": time, "title": req.body.title, "body": req.body.body });
        let json_body={"postid": maxid, "created":time , "modified": time};
        res.status(201).json(json_body);
        return;
      }else if(parseInt(req.body.postid)>0){
        res.setHeader('Content-Type', 'application/json');
        let time=Date.now();
        let single_post = await db.collection('Posts').find({ $and: [ { "username": req.body.username }, { "postid": parseInt(req.body.postid) } ] }  ).sort( { "postid": 1 }).toArray();
        if(single_post.length<=0){
          res.sendStatus(404);
          return;
        }
        time=Date.now();
        let update= await db.collection('Posts').updateOne({ $and : [{ "username": req.body.username }, { "postid": parseInt(req.body.postid) }]}, { $set: { "modified": time, "title": req.body.title, "body": req.body.body }});
        let json_body={"modified": time};
        res.status(200).json(json_body);
        return;



      }else{
        // console.log("here 2");
        res.sendStatus(400);
        return;
      }
      
      
    })
  } catch(err) {
    // console.log("here 3");
    res.sendStatus(400);
    return;
  }

});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



// curl --request POST --header "Content-Type: application/json" --data '{"username": "cs144", "postid": 0, "title": "yourtitle", "body": "yourbody"}' -- cookie "jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c3IiOiJjczE0NCJ9.a9JW_zXeLj_hD_w4dRAzxj5QOw0GV3d0NFty74gwXe0" http://localhost:3000/api/posts
