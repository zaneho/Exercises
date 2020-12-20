import { PgPool } from "../db";

export default class User {
  getById(id: string) {
    return PgPool.query("SELECT * FROM user_account WHERE id = $1", [id]);
  }

  getByIdPw(id: string, password: string) {
    return PgPool.query(
      "SELECT * FROM user_account WHERE id = $1 AND password = crypt($2,password)",
      [id, password]
    );
  }

  // create(id: string, password: string) {
  //   const query =
  //     "INSERT INTO user_account VALUES ($1,crypt($2,gen_salt('bf'))) RETURNING *";
  //   return PgPool.query(query, [id, password]);
  // }

  async create(id: string, password: string, token: string) {
    const client = await PgPool.connect();
    try {
      await client.query("BEGIN");

      const insertUser =
        "INSERT INTO user_account VALUES ($1,crypt($2,gen_salt('bf'))) RETURNING *";
      await client.query(insertUser, [id, password]);

      const insertToken =
        "INSERT INTO refresh_token (userid, token) VALUES ($1,$2) RETURNING *";
      await client.query(insertToken, [id, token]);

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
}
