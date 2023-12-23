const express = require('express')
const mysql = require('mysql');
const bodyParser = require('body-parser');


// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost', // 호스트 이름
  user: '사용자이름', // MySQL 사용자 이름
  password: '비밀번호', // MySQL 비밀번호
  database: '분실물DB' // 사용할 데이터베이스 이름
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error('DB 연결 실패: ' + err.stack);
    return;
  }
  console.log('DB 연결 성공, ID ' + connection.threadId);
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  res.render('index')
})
app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}`)
})

app.post('/report', (req, res) => {
   res.render('index')
})



// Express 앱 설정
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// 분실물 신고 페이지 렌더링
app.get('/report', (req, res) => {
  res.render('report');
});

// 분실물 신고 엔드포인트
app.post('/report', (req, res) => {
  const { dbId, uploaderDbId, photo, tags, description } = req.body;

  // DB에 쿼리 실행하여 분실물 추가
  const sql = 'INSERT INTO lost_items (DBID, UploaderDBID, Photo, Tags, Description) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [dbId, uploaderDbId, photo, JSON.stringify(tags), description], (err, result) => {
    if (err) {
      console.error('분실물 추가 에러: ' + err.message);
      res.status(500).send('분실물 추가 실패');
      return;
    }
    console.log('분실물이 성공적으로 추가되었습니다.');
    res.status(200).send('분실물이 성공적으로 추가되었습니다.');
  });
});

// 분실물 목록 가져오기 페이지 렌더링
app.get('/lost', (req, res) => {
  // DB에서 분실물 목록 가져오기 쿼리 실행
  connection.query('SELECT * FROM lost_items', (err, results) => {
    if (err) {
      console.error('분실물 가져오기 에러: ' + err.message);
      res.status(500).send('분실물 가져오기 실패');
      return;
    }
    console.log('분실물 목록을 성공적으로 가져왔습니다.');
    // 가져온 분실물 목록을 lost.ejs 템플릿에 넘겨주기
    res.render('lost', { lostItems: results });
  });
});

// 서버 시작
const PORT = 8002;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});