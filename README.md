# back-end branch

## sns 프로젝트(2023.07.20~진행중)
소셜네트워크서비스 기능이 있는 서비스

## 작업환경(공통)
Framework : NestJS, react
language : typescript, javascript
DB(version, ORM) : MySql("mysql2": "^3.5.2", TypeOrm)

## 기능
1. 게시글 : NestJS의 jwt-token과 Gaurds를 이용하여 비인가(비 로그인) 시 401에러 -> 로그인 페이지로 처리
   multpart와 axios를 이용하여 파일처리
3. 좋아요 : sns기본 기능인 좋아요 기능을 구현 마찬가지로 비 인가(비 로그인) 사용불가
4. 채팅 : 비인가(비로그인)시 사용이 불가능하며 Websocket을 이용한 1:1 또는 단체 채팅을 가능하게 한 양방향 통신
   채팅내역은 DB에 저장 되어 history를 볼 수 있음.

## 추후 업데이트 예정(공통)
1.댓글기능
2.리펙토링 : nestjs의 life cycle(pipe, interceptor 등등)을 이용하여 더욱 안전하고 안정적으로 데이터 전송
3.swagger를 이용한 api문서 자동화
4.open api 이용
