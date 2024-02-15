import * as tarifarioClientesService from "../services/tarifarioClientes.js";
import { createTransaction } from "../configs/dbConnection.js";

export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await tarifarioClientesService.get({ id });

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener tarifarios de clientes', error });
  }
}

export const create = async (req, res) => {
  const { connection } = req.body;

  try {
    const idTarifario = await tarifarioClientesService.create({ ...req.body, connection });

    await connection.commit();
    res.status(201).json({ message: 'Tarifario de cliente creado exitosamente', idTarifario });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al crear tarifario de cliente', error: error.message });
  }
}

export const update = async (req, res) => {
  const { connection: connectionFromBody } = req.body;
  
  let connection = connectionFromBody || await createTransaction();
  try {
    const { id } = req.params;
    const { mail: userEmail } = req.user.profile;

    await tarifarioClientesService.update({ ...req.body, userEmail, connection, id });

    await connection.commit();
    res.status(200).json({ message: 'Tarifario actualizado correctamente' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al actualizar Tarifario', error: error.message });
  }
}

export const softDelete = async (req, res) => {
  const { mail: userEmail } = req.user.profile;
  let connection;

  try {
    connection = await createTransaction();
    const { id } = req.params;

    await tarifarioClientesService.softDelete({ id, userEmail, connection });

    connection.commit();
    res.status(200).json({ message: 'Tarifario borrado' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al borrar tarifario', error: error.message });
  }
}