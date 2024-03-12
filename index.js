//console.log("Hello");

const express = require('express') 
const app = express() 
const port = 7070 

var samsungRouter = require('./routers/samsung');
var lgRouter = require('./routers/lg');

app.get('/', (req, res) => { 
  res.send('Hello Root Page!') 
})

app.use('/samsung', samsungRouter);
app.use('/lg', lgRouter);

// 제공하는 url 이외의 url -> 404
app.use((req, res, next)=>{
  const error = new Error("invaild url");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message||"확인되지 않은 에러");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
}) //포트 7070번에서 이 앱을 실행한다.