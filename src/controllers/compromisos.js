import * as compromisosService from "../services/compromisos.js";
import { createTransaction } from "../configs/dbConnection.js";

/**
 * @description Obtiene uno o varios compromisos
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await compromisosService.get({ id });

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener compromisos', error });
  }
}

/**
 * @description Crear un compromiso
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const create = async (req, res) => {
  let connection;

  try {
    connection = await createTransaction();

    const idCompromiso = await compromisosService.create({ ...req.body, connection });

    await connection.commit();
    res.status(201).json({ message: 'Compromiso creado exitosamente', idCompromiso });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al crear compromiso', error: error.message });
  }
}

/**
 * @description Actualiza un compromiso
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

    await compromisosService.update({ ...req.body, userEmail, connection, id });

    await connection.commit();
    res.status(200).json({ message: 'Compromiso actualizado correctamente' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al actualizar Compromiso', error: error.message });
  }
}

/**
 * @description Borrado a nivel logico de un compromiso
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

    await compromisosService.softDelete({ id, userEmail, connection });

    connection.commit();
    res.status(200).json({ message: 'Compromiso borrado' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al borrar compromiso', error: error.message });
  }
}

export const getCategorias = async (req, res) => {
  try {
    const result = await compromisosService.getCategorias();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener compromisos', error: error.message });
  }
}

export const getRazonesSociales = async (req, res) => {
  try {
    const result = await compromisosService.getRazonesSociales();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener razones sociales', error: error.message });
  }
}

export const getReferencias = async (req, res) => {
  try {
    const result = await compromisosService.getReferencias();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener referencias', error: error.message });
  }
}

export const getEstados = async (req, res) => {
  try {
    const result = await compromisosService.getEstados();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener estados', error: error.message });
  }
}