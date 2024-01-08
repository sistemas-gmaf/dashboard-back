import * as chequesService from "../services/cheques.js";
import { createTransaction } from "../configs/dbConnection.js";

/**
 * @description Obtiene uno o varios cheques
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await chequesService.get({ id });

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener cheques', error });
  }
}

/**
 * @description Crear un cheque
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const create = async (req, res) => {
  let connection;

  try {
    connection = await createTransaction();

    const idCheque = await chequesService.create({ ...req.body, connection });

    await connection.commit();
    res.status(201).json({ message: 'Cheque creado exitosamente', idCheque });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al crear cheque', error: error.message });
  }
}

/**
 * @description Actualiza un cheque
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

    await chequesService.update({ ...req.body, userEmail, connection, id });

    await connection.commit();
    res.status(200).json({ message: 'Cheque actualizado correctamente' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al actualizar Cheque', error: error.message });
  }
}

/**
 * @description Borrado a nivel logico de un cheque
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

    await chequesService.softDelete({ id, userEmail, connection });

    connection.commit();
    res.status(200).json({ message: 'Cheque borrado' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al borrar cheque', error: error.message });
  }
}

export const getBancos = async (req, res) => {
  try {
    const result = await chequesService.getBancos();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener cheques', error });
  }
}

export const getReferencias = async (req, res) => {
  try {
    const result = await chequesService.getReferencias();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener cheques', error });
  }
}

export const getProveedores = async (req, res) => {
  try {
    const result = await chequesService.getProveedores();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener cheques', error });
  }
}

export const getEstados = async (req, res) => {
  try {
    const result = await chequesService.getEstados();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener cheques', error });
  }
}