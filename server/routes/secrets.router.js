const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
  // what is the value of req.user????
  console.log('req.user:', req.user);
  const userID = req.user.id;
  pool
    .query(`SELECT secret."secrecy_level", secret."content" FROM secret 
    JOIN "user" ON "user"."clearance_level" >= secret."secrecy_level"
    WHERE "user"."id" = $1;`, [userID])
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
