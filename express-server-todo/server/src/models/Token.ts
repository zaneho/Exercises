import { PgPool } from "../db";

export default class Token {
  getToken(token: string) {
    return PgPool.query("SELECT * FROM refresh_token WHERE token = $1", [
      token,
    ]);
  }
  getTokenByUserid(userid: string) {
    return PgPool.query("SELECT * FROM refresh_token WHERE userid = $1", [
      userid,
    ]);
  }
  create(userid: string, token: string) {
    const query =
      "INSERT INTO refresh_token (userid, token) VALUES ($1,$2) RETURNING *";
    return PgPool.query(query, [userid, token]);
  }
  update(userid: string, token: string) {
    const query =
      "UPDATE refresh_token SET token=$2 WHERE userid=$1 RETURNING *";
    return PgPool.query(query, [userid, token]);
  }
  delete(token: string) {
    return PgPool.query(
      "DELETE FROM refresh_token WHERE token=$1 RETURNING *",
      [token]
    );
  }
}
