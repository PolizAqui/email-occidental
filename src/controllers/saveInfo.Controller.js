const { localidadesGetInfo } = require('../models/localidades')

const controller = {}

controller.localidadesInfo = async (req, res) => {
    try {
        const result = await localidadesGetInfo();

        if (result.status) {
            res.status(result.code).json({
                message: result.message,
                data: result.data
            });
        } else {
            res.status(result.code).json({
                message: result.message
            });
        }
    } catch (err) {
        console.error('Error in localidadesInfo controller:', err); // Agrega un mensaje de error más detallado
        res.status(500).json({
            message: 'Server error',
            error: err.message // Proporciona detalles del error
        });
    }
}

module.exports = controller
