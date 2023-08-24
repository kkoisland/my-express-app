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

/* エラーハンドリング関数 ---------------------------------------------*/
// データが有効かどうかをチェックする関数
function isValidData(data) {
  // ここでデータのバリデーションを行う
  // 有効なデータであればtrueを返す、無効な場合はfalseを返す
  // この例では単純にオブジェクトが空でないかをチェックしています
  return Object.keys(data).length > 0;
}

// 記事が存在するかどうかをチェックする関数
function articleExists(articleId) {
  // ここで記事の存在をデータベースなどから確認するロジックを実装する
  // 存在すればtrueを、存在しなければfalseを返す
  // この例ではarticlesオブジェクトを使って確認しています
  // hasOwnProperty メソッドは JavaScript の組み込みオブジェクトである Object オブジェクトのメソッド
  return articles.hasOwnProperty(articleId);
}

// 記事を更新する関数
function updateArticle(articleId, updatedData) {
  // ここで記事の更新をデータベースなどで実行するロジックを実装する
  // この例ではarticlesオブジェクトを使って更新しています
  articles[articleId] = updatedData;
}
/* ルートハンドラ more example ---------------------------------------------*/
const articles = {
  1: {
    title: 'Sample Article',
    content: 'This is a sample article.'
  }
};
// DELETEメソッド用のルートハンドラ
app.delete('/delete-article/:id', (req, res) => {
  const articleId = req.params.id;

  // データベースなどで記事を削除する処理
  if (articles[articleId]) {
    // 記事を削除
    delete articles[articleId];
    res.send(`Deleted article ${articleId}\n`);
  } else {
    res.status(404).send('Article not found\n');
  }
});
// command: curl -X DELETE http://localhost:3333/delete-article/1
// result: Deleted article 1
// command: curl -X DELETE http://localhost:3333/delete-article/2
// result: Article not found

// patch
app.patch('/articles_update/:id', (req, res) => {
  const articleId = req.params.id;
  const updatedData = req.body;

  // データベースなどで記事の一部を更新する処理
  if (articles[articleId]) {
    // リクエストのボディに含まれるデータで記事を更新
    Object.assign(articles[articleId], updatedData);
    res.send(`Partially updated article ${articleId}: ${JSON.stringify(updatedData)}\n`);
  } else {
    res.status(404).send('Article not found\n');
  }
});
// command: curl -X PATCH -d "title=Updated Title" -d "content=Updated Content" http://localhost:3333/articles_update/1
// result: Updated article 111: {"key_a":"value_b"}

// put
app.put('/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const updatedData = req.body;

  // データベースなどで記事の更新を行う処理
  // この例では単に更新データを表示しています
  if (!isValidData(updatedData)) {
    // クライアントからのリクエストデータが無効な場合、400 Bad Requestを返す
    res.status(400).send('Invalid request data\n');
  } else if (!articleExists(articleId)) {
    // 指定された記事が存在しない場合、404 Not Foundを返す
    res.status(404).send('Article not found\n');
  } else {
    // 正常な場合、記事を更新し、成功ステータスを返す
    // データベースなどで記事の更新を行う処理
    updateArticle(articleId, updatedData);
   // この例では単に更新データを表示しています
    res.send(`Updated article ${articleId}: ${JSON.stringify(updatedData)}\n`);
  }
});
// command: curl -X PUT -d "key_a=value_b" http://localhost:3333/articles/1
// result: Updated article 111: {"key_a":"value_b"}
// command: curl -X PUT -d "key_a=value_b" http://localhost:3333/articles/2
// result: Article not found

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

/* Error Handling ----------------------------------------------------*/
// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  // エラーログを出力
  console.error(err.stack);
  res.status(500).send('Something broke!\n');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});