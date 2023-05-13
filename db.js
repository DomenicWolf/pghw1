/** Database setup for BizTime. */

const { Client } = require('pg');

//let DB_URI;

/*if (process.env.NODE_ENV === 'test') {
    DB_URI = 'postgresql:///usersdb_test';
} else {
    DB_URI = "postgresql:///usersdb";
}*/

const PASSWORD = process.env.DB_PASSWORD



console.log('*****************')
const deletee = 'SCRAM-SHA-256$4096:RR1pqYZq+IxKTSEvHML6Aw==$iIK4ERTWdBKOixTKZfxwaLC7liHzNsuwx/FXSR8Vh70=:oa+OqNV69MZ7Dr4bvcCz123fB6FN5ZP7k29oVqVCo24='
const neww = 'SCRAM-SHA-256$4096:iKrePslDAZbKDxX2+QD9xg==$30OubYCIAluGFWJXCiLNaY4jGwCVGjiXQKUe8HOu3uA=:PANTzG3uNhPCbAMr5M16oZyqBUYRZL+otLh9pKWTM64='
console.log(deletee)
console.log(process.env.NODE_ENV)
const DB_URI = process.env.NODE_ENV === 'test' ? `postgresql://dom:${'dom123321!'}@127.0.0.1:5432/biztime_test`: `postgresql://dom:${'dom123321!'}@127.0.0.1:5432/biztime`;
 
    
    

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = {db};