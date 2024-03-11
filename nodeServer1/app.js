var express = require('express');
var app = express();  //request, response
//post - npm install body-parser --save
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/',(req,resp)=>{
   resp.sendFile(__dirname+'/public/guestbook.html')
});
const mdbConn = require('./mariadb/mariaDBConn.js');
  
app.post("/save", async (req, res) => {
    const title = req.body.title;
    const email = req.body.email;
    const content = req.body.content;
  
    try {
      await mdbConn.saveUserList(email, title, content);
  
      res.send(`
      <html>
        <head>
          <script>
            alert("글이 성공적으로 등록되었습니다.");
            window.location.href = "/list"; // 경고창 닫힌 후 페이지를 리다이렉트하고 싶다면 사용
          </script>
        </head>
        <body></body>
      </html>
    `);

    } catch (err) {
      res.status(500).send("글 등록에 실패했습니다.");
      console.log(err);
    }
});

app.get('/list',(req,res)=>{
    mdbConn.getUserList()
    .then((rows) => {
       console.log(rows);
       res.render('list',{guestbookList:rows});
    })
    .catch((errMsg) => {
        console.log(errMsg);
       res.render('error.html');
    });
});

app.listen(3000, function(){
    console.log('My WebServer Start....');
});