var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'han1024',
    database: 'subwaypop',
    multipleStatements: true,
    connectionLimit: 5,
    waitForConnections: false 
});

/*
var DB = (function () {
    function _query(query, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                callback(null, err);
                throw err;
            }
            connection.query(query, params, function (err, rows) {
                connection.release();
                if (!err) {
                    callback(rows);
                } else {
                    callback(null, err);
                }
            });
            connection.on('error', function (err) {
                connection.release();
                callback(null, err);
                throw err;
            });
        });
    }
    return {
        query: _query
    };
})();
*/
module.exports = pool;