const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

// let jobId1;
// let jobId2;
let jobIds = []

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);
  const jobs = await db.query(`
        INSERT INTO jobs(title,
                         salary,
                         equity,
                         company_handle)
        VALUES ('testjob1', 50000, 0, 'c1'),
        ('testjob2', 150000, 0.045, 'c2')
        RETURNING id`)
  jobIds.length = 0;
  jobIds.push(jobs.rows[0].id);
  // TODO: find name for jobIdsArray
  // jobId1 = jobIds.rows[0].id;
  // jobId2 = jobIds.rows[1].id;
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  jobIds,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};