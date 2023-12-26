import { createTransaction } from "../configs/dbConnection.js";
import * as transportesService from "../services/transportes.js";

/**
 * @description Obtener una o varias empresas de transportes
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await transportesService.get({ id });

    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener transportes', error });
  }
}

/**
 * @description Crear nuevo registro de empresa de transporte
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const create = async (req, res) => {
  let connection;

  try {
    connection = await createTransaction();
    const { nombre, descripcion } = req.body;

    const idTransporte = await transportesService.create({ nombre, descripcion, connection });

    await connection.commit();
    res.status(201).json({ message: 'Transporte creado correctamente', idTransporte });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error en la creacion de un transporte', error });
  }
}

/**
 * @description Actualizar registro de transporte
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const update = async (req, res) => {
  let connection;

  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const { mail: userEmail } = req.user.profile;
    connection = await createTransaction();

    const idTransporte = await transportesService.update({ id, nombre, descripcion, connection, userEmail });

    await connection.commit();
    res.status(201).json({ message: 'Transporte creado correctamente', idTransporte });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error en la creacion de un transporte', error });
  }
}

/**
 * @description Eliminar registro de transporte de manera logica
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const softDelete = async (req, res) => {
  let connection;

  try {
    const { id } = req.params;
    const { mail: userEmail } = req.user.profile;
    connection = await createTransaction();

    await transportesService.softDelete({ id, connection, userEmail });

    await connection.commit();
    res.status(201).json({ message: 'Transporte borrado correctamente' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error en el borrado de un transporte', error });
  }
}