import * as viajesService from "../services/viajes.js";
import { createTransaction } from "../configs/dbConnection.js";

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
    connection = await createTransaction();

    await viajesService.update({ ...req.body, userEmail, connection, id });

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

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener viaje especial', error });
  }
}