# front-end branch

# sns 프로젝트(2023.07.20~진행중)
소셜네트워크서비스 기능이 있는 서비스

# 작업환경(공통)
Framework : NestJS, react
language : typescript, javascript
DB(version, ORM) : MySql("mysql2": "^3.5.2", TypeOrm)

# 기능
1. 게시글 : axios를 이용한 비동기 처리 및 Bearer 토큰 전송, multpart와 axios를 이용하여 파일처리
3. 좋아요 : 토글버튼 생성으로 axios로 좋아요 정보 전송
4. 채팅 : 내가 보낸 채팅은 오른쪽, 다른 사람들은 "이름 : 내용" 형태로 왼쪽에서 생성

# 추후 업데이트 예정(공통)
1.댓글기능
2.리펙토링 : nestjs의 life cycle(pipe, interceptor 등등)을 이용하여 더욱 안전하고 안정적으로 데이터 전송
3.swagger를 이용한 api문서 자동화
4.open api 이용
