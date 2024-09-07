const pool = require('../utils/mysql.connect');

/*********** extract info ************/
const localidadesGetInfo = async () => {
    try {
        const connection = await pool.getConnection();
        const sqlInfo = 'SELECT * FROM localidades';
        const [rows] = await connection.execute(sqlInfo);
        connection.release();

        if (rows.length > 0) {
            return {
                status: true,
                message: 'Localidades found',
                code: 200,
                data: rows
            };
        } else {
            return {
                status: false,
                message: 'Localidades not found',
                code: 404
            };
        }
    } catch (err) {
        console.error('Error in localidadesGetInfo model:', err); // Agrega un mensaje de error más detallado
        return {
            status: false,
            message: 'Server error',
            code: 500,
            error: err.message // Proporciona detalles del error
        };
    }
}


module.exports = { localidadesGetInfo }
