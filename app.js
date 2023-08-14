const express = require('express');
const app = express();
const port = 3333;

app.use(express.urlencoded({ extended: true })); // urlencodedミドルウェア、req.bodyに必要

function displayLocalsData(req, res, next) { // ミドルウェア関数
  console.log('res.locals.data:', res.locals.data); // res.locals.data: undefined
    // 任意のデータをセット
    res.locals.data = {
      message: 'This is the data we want to share',
      value: 42
    };
    console.log('res.locals.data:', res.locals.data); // res.locals.data: { message: 'This is the data we want to share', value: 42 }
  next(); // 次のミドルウェアまたはルートハンドラに制御を渡す
}

app.use(displayLocalsData); // ミドルウェアを使用

/* ルートハンドラ more example ---------------------------------------------*/
// ミドルウェアのテスト
app.get('/mdtest', (req, res) => {
  // ミドルウェアでセットされたデータを表示
  res.send(`Data from middleware: ${JSON.stringify(res.locals.data)}\n`);
});

app.get('/getData/:publicKey', (req, res) => {
  res.send(`publicKey is ${req.params.publicKey}\n`);
});
// command: curl 'http://localhost:3333/getData/keiko'
// 結果: pablicKey is keiko

app.get('/pass', (req, res) => {
  res.send(`password is ${req.query.password} \n`);
});
// command: http://localhost:3333/pass?password=akih
// 結果: password is akih

/* req.body ---------------------------------------------------------*/
// POSTのコマンドの実行は、ブラウザではできない
app.post('/submit', (req, res) => {
  const inputData = req.body; // req.bodyにPOSTされたデータが含まれる
  const responseText = `Received data: ${JSON.stringify(inputData)}\n` +
                      `Received data2: ${JSON.stringify(inputData.password)}\n` +
                      `Received data3: ${JSON.stringify(req.body.publicKey)}\n`;
  res.send(responseText);
});
// command: curl -X POST -d "publicKey=keiko&password=akih" http://localhost:3333/submit
// 結果: 
// Received data: {"publicKey":"keiko","password":"akih"}
// Received data2: "akih"
// Received data3: "keiko"

/* Basic ---------------------------------------------------------*/
// req.params
app.get('/hey/:name', (req, res) => {
  res.send('Hello ' + req.params.name + '\n');
});
//command: http://localhost:3333/hey/Keiko
//結果: Hello Keiko

// req.query
app.get('/hello', (req, res) => {
  res.send(`Hello ${req.query.name}\n`);
});
// command: http://localhost:3333/hello?name=keiko
// 結果: Hello keiko

// req.query + req.params
// この関数は、他のすべてのルートにマッチしてしまうので、ユニークなパスを入れるか、一番下に置く必要がある
app.get('/:aisatsu', (req, res) => { 
  res.send(`${req.params.aisatsu} ${req.query.tuduki} \n`);
});
// command: http://localhost:3333/Good?tuduki=morning
// 結果: Good morning

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});