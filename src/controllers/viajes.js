import * as viajesService from "../services/viajes.js";
import * as clienteService from "../services/clientes.js";
import * as vehiculosService from "../services/vehiculos.js";
import { createTransaction } from "../configs/dbConnection.js";
import { VIAJE_ESTADO } from "../utils/constants.js";

/**
 * @description Obtiene uno o varios viajes
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await viajesService.get({ id });

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viajes', error });
  }
}

export const getDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const viaje = await viajesService.get({ id });
    const cliente = await clienteService.get({ id: viaje.cliente_id });
    const vehiculo = await vehiculosService.getById(viaje.vehiculo_id);
    const tarifasViaje = await viajesService.getTarifasByViajeId(viaje.id);
    const tarifas = await viajesService.getTarifarios({ ...viaje });
    const remito = await viajesService.getRemitoByViajeId(viaje.id);

    /**
     * @TODO: Mejorar estructura de envio y recibimiento de datos
     */
    const detail = {
      bitacoras: remito.observaciones,
      tarifasViaje: tarifasViaje,
      nroRemito: remito.numero,
      tarifas,
      viaje: {
        fecha_salida: viaje.fecha_salida,
        cantidad_ayudantes: viaje.cantidad_ayudantes,
        clienteData: { id: cliente.id, razon_social: cliente.razon_social },
        id_tarifario_cliente: viaje.id_tarifario_cliente,
        id_tarifario_transporte_general: viaje.id_tarifario_transporte_general,
        id_tarifario_transporte_especial: viaje.id_tarifario_transporte_especial,
        id_tarifario_viaje_especial: viaje.id_tarifario_viaje_especial,
        vehiculoData: { 
          id: vehiculo.id,
          id_vehiculo: vehiculo.id,
          transporte_id: vehiculo.transporte_id,
          vehiculo_tipo_id: vehiculo.id_vehiculo_tipo,
          transporte_nombre: vehiculo.transporte_nombre,
          vehiculo_tipo_descripcion: vehiculo.vehiculo_tipo_descripcion,
          vehiculo_patente: vehiculo.patente 
        },
        zonaData: {
          id: viaje.zona_id,
          descripcion: viaje.zona
        },
      },
    };

    res.json({ data: detail });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viajes', error });
  }
}

/**
 * @description Crear un viaje
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const create = async (req, res) => {
  const { connection: previousConnection } = req.body;
  let connection;

  try {
    connection = previousConnection || await createTransaction();

    const id_viaje = await viajesService.create({ ...req.body.viaje, connection });

    await viajesService.createViajeRemito({ ...req.body.remito, id_viaje, connection });

    await connection.commit();
    res.status(201).json({ message: 'viaje creado exitosamente', id_viaje });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al crear viaje', error: error.message });
  }
}

/**
 * @description Actualiza un viaje
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const update = async (req, res) => {
  let connection;
  
  try {
    const { id } = req.params;
    const { mail: userEmail } = req.user.profile;
    const { connection: previousConnection } = req.body;
    connection = previousConnection || await createTransaction();

    await viajesService.update({ ...req.body.viaje, userEmail, connection, id });

    await viajesService.updateViajeRemito({ ...req.body.remito, id_viaje: id, connection });

    await connection.commit();
    res.status(200).json({ message: 'viaje actualizado correctamente' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al actualizar viaje', error: error.message });
  }
}

/**
 * @description Borrado a nivel logico de un viaje
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const softDelete = async (req, res) => {
  const { mail: userEmail } = req.user.profile;
  let connection;

  try {
    connection = await createTransaction();
    const { id } = req.params;

    await viajesService.softDelete({ id, userEmail, connection });

    connection.commit();
    res.status(200).json({ message: 'viaje borrado' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al borrar viaje', error: error.message });
  }
}

export const getBancos = async (req, res) => {
  try {
    const result = await viajesService.getBancos();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viajes', error });
  }
}

export const getReferencias = async (req, res) => {
  try {
    const result = await viajesService.getReferencias();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viajes', error });
  }
}

export const getProveedores = async (req, res) => {
  try {
    const result = await viajesService.getProveedores();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viajes', error });
  }
}

export const getEstados = async (req, res) => {
  try {
    const result = await viajesService.getEstados();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viajes', error });
  }
}

export const calculateTarifas = async (req, res) => {
  try {
    const tarifaTransporte = await viajesService.calculateTarifaTransporte({ ...req.query });
    const tarifaCliente = await viajesService.calculateTarifaCliente({ ...req.query });

    res.json({ data: [ tarifaCliente, tarifaTransporte ] });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viajes', error });
  }
}

export const getEspecial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await viajesService.get({ id, estado: 'PENDIENTE' });
    
    if (id) {
      const tarifas = await viajesService.getTarifasByViajeId(id);
      res.json({ 
        data: { 
          ...result, 
          monto_cliente: tarifas.cliente_monto,
          monto_cliente_por_ayudante: tarifas.cliente_monto_por_ayudante,
          monto_transporte: tarifas.transporte_monto,
          monto_transporte_por_ayudante: tarifas.transporte_monto_por_ayudante
        } 
      });
    } else {
      res.json({ data: result });
    }
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viaje especial', error });
  }
}

export const updateEspecial = async (req, res) => {
  const { mail: userEmail } = req.user.profile;
  let connection;

  try {
    connection = await createTransaction();

    const { 
      id,
      action,
      id_tarifario_viaje_especial,
      monto_cliente,
      monto_cliente_por_ayudante,
      monto_transporte,
      monto_transporte_por_ayudante,
      cantidad_ayudantes,
    } = req.body;

    let viajeEstado;

    if (action === 'borrador') {
      viajeEstado = VIAJE_ESTADO.PENDIENTE;
    } else {
      viajeEstado = VIAJE_ESTADO.APROBADO;
    }

    await viajesService.updateEspecial({
      id_viaje: id,
      id_tarifario_viaje_especial,
      monto_cliente,
      monto_cliente_por_ayudante,
      monto_transporte,
      monto_transporte_por_ayudante,
      cantidad_ayudantes,
      estado: viajeEstado,
      userEmail,
      connection
    });

    await connection.commit();
    res.status(200).json({ message: 'Actualizado con exito' })
  } catch (error) {
    await connection?.rollback();
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
}