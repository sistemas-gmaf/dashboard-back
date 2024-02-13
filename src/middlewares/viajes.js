import { createTransaction } from "../configs/dbConnection.js";
import * as viajesService from "../services/viajes.js";
import * as tarifarioViajesEspecialesService from "../services/tarifarioViajesEspeciales.js";
import { VIAJE_ESTADO } from "../utils/constants.js";

export const validateTarifario = async (req, res, next) => {
  const { connection: previousConnection } = req.body;
  const { mail: userEmail } = req.user.profile;
  let { viaje, tarifas } = req.body;
  let connection;

  viaje = JSON.parse(viaje);
  tarifas = JSON.parse(tarifas);
  try {
    connection = previousConnection || await createTransaction();

    const tarifaTransporte = await viajesService.calculateTarifaTransporte({ ...viaje });
    const tarifaCliente = await viajesService.calculateTarifaCliente({ ...viaje });

    if (typeof tarifaCliente == 'undefined' || !tarifaTransporte.tarifario_id) {
      return res.status(400).json({ message: 'No existe tarifario para la combinacion zona-vehiculo-cliente-fecha seleccionados' });
    }

    const tarifasIsChanged = (
      tarifas.cliente != tarifaCliente.monto ||
      tarifas.cliente_por_ayudante != tarifaCliente.monto_por_ayudante ||
      tarifas.transporte != tarifaTransporte.monto ||
      tarifas.transporte_por_ayudante != tarifaTransporte.monto_por_ayudante
    );

    // Si la tarifa cambia por el usuario se debe crear en el tarifario_viaje_especial
    let idTarifarioViajeEspecial = null;
    if (tarifasIsChanged) {
      idTarifarioViajeEspecial = await tarifarioViajesEspecialesService.upsert({ 
        id: viaje.id_tarifario_viaje_especial,
        monto_cliente: tarifas.cliente, 
        monto_cliente_por_ayudante: tarifas.cliente_por_ayudante,
        monto_transporte: tarifas.transporte,
        monto_transporte_por_ayudante: tarifas.transporte_por_ayudante,
        userEmail,
        connection
      });
    } else {
      //en caso de que exista una tarifa cambiada y vuelva a su valor por default se borra la cambiada
      if (viaje.id_tarifario_viaje_especial) {
        await viajesService.update({
          id: viaje.id,
          id_tarifario_viaje_especial: null,
          userEmail,
          connection
        });
        await tarifarioViajesEspecialesService.hardDelete({
          id: viaje.id_tarifario_viaje_especial,
          connection
        });
        viaje.id_tarifario_viaje_especial = null;
      }
    }

    /**
     * @TODO: aprobar directamente en caso de tener permisos
     */
    let viajeEstado;
    viajeEstado = idTarifarioViajeEspecial 
      ? VIAJE_ESTADO.PENDIENTE
      : VIAJE_ESTADO.APROBADO;
    
    if (req.params.id) {
      viajeEstado = tarifasIsChanged
        ? VIAJE_ESTADO.PENDIENTE
        : VIAJE_ESTADO.APROBADO;
    }

    req.body.viaje = {
      id_cliente: viaje.id_cliente,
      id_vehiculo: viaje.id_vehiculo,
      id_zona_destino: viaje.id_zona,
      fecha_salida: viaje.fecha_salida,
      cantidad_ayudantes: viaje.cantidad_ayudantes,
      estado: viajeEstado,
      id_tarifario_cliente: tarifaCliente.tarifario_id,
      id_tarifario_transporte_general: tarifaTransporte.tipo_tarifario == 'Transporte General' 
        ? tarifaTransporte.tarifario_id
        : null,
      id_tarifario_transporte_especial: tarifaTransporte.tipo_tarifario == 'Transporte Especial'
        ? tarifaTransporte.tarifario_id
        : null,
      id_tarifario_viaje_especial: viaje.id_tarifario_viaje_especial || idTarifarioViajeEspecial,
    };

    req.body.remito = JSON.parse(req.body.remito);

    req.body.connection = connection;

    next();
  } catch (error) {
    connection?.rollback();
    res.status(500).json({ message: 'Error al validar tarifarios', error: error.message });
  }
}