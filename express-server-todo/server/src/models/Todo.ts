import { PgPool } from "../db";

export default class Todo {
  getAll(userid: string) {
    return PgPool.query("SELECT * FROM todo WHERE userid = $1", [userid]);
  }
  getById(id: number, userid: string) {
    return PgPool.query("SELECT * FROM todo WHERE id = $1 AND userid = $2", [
      id,
      userid,
    ]);
  }
  create(description: string, userid: string) {
    const query =
      "INSERT INTO todo (description, userid) VALUES ($1, $2) RETURNING *";
    return PgPool.query(query, [description, userid]);
  }
  update(id: number, description: string, userid: string) {
    return PgPool.query(
      "UPDATE todo SET description=$1 WHERE id=$2 AND userid = $3 RETURNING *",
      [description, id, userid]
    );
  }
  delete(id: number, userid: string) {
    return PgPool.query(
      "DELETE FROM todo WHERE id=$1 AND userid=$2 RETURNING *",
      [id, userid]
    );
  }
}
