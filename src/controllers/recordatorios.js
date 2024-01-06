import * as recordatoriosService from "../services/recordatorios.js";
import { createTransaction } from "../configs/dbConnection.js";

/**
 * @description Obtiene uno o varios recordatorios
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await recordatoriosService.get({ id });

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener recordatorios', error });
  }
}

/**
 * @description Crear un cliente
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const create = async (req, res) => {
  let connection;

  try {
    connection = await createTransaction();

    const idRecordatorio = await recordatoriosService.create({ ...req.body, connection });

    await connection.commit();
    res.status(201).json({ message: 'Recordatorio creado exitosamente', idRecordatorio });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al crear cliente', error: error.message });
  }
}

/**
 * @description Actualiza un cliente
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

    await recordatoriosService.update({ ...req.body, userEmail, connection, id });

    await connection.commit();
    res.status(200).json({ message: 'Recordatorio actualizado correctamente' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al actualizar Recordatorio', error: error.message });
  }
}

/**
 * @description Borrado a nivel logico de un cliente
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

    await recordatoriosService.softDelete({ id, userEmail, connection });

    connection.commit();
    res.status(200).json({ message: 'Recordatorio borrado' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al borrar cliente', error: error.message });
  }
}