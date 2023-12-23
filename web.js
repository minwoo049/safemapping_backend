const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const PORT = 8002;

const connection = mysql.createConnection({
  host: 'localhost',
  user: '사용자이름',
  password: '비밀번호',
  database: '분실물DB'
});

connection.connect((err) => {
  if (err) {
    console.error('DB 연결 실패: ' + err.stack);
    return;
  }
  console.log('DB 연결 성공, ID ' + connection.threadId);
});

const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/report', (req, res) => {
  const { dbId, uploaderDbId, photo, tags, description } = req.body;
  const insertQuery = 'INSERT INTO lost_items (DBID, UploaderDBID, Photo, Tags, Description) VALUES (?, ?, ?, ?, ?)';
  const values = [dbId, uploaderDbId, photo, JSON.stringify(tags), description];

  connection.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('분실물 추가 에러: ' + err.message);
      res.status(500).send('분실물 추가 실패');
      return;
    }
    console.log('분실물이 성공적으로 추가되었습니다.');
    res.status(200).send('분실물이 성공적으로 추가되었습니다.');
  });
});

app.get('/lost', (req, res) => {
  const selectQuery = 'SELECT * FROM lost_items';

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('분실물 가져오기 에러: ' + err.message);
      res.status(500).send('분실물 가져오기 실패');
      return;
    }
    console.log('분실물 목록을 성공적으로 가져왔습니다.');
    res.render('lost', { lostItems: results });
  });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
