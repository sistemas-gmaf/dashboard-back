import * as usuariosService from "../services/usuarios.js";
import { createTransaction } from "../configs/dbConnection.js";

export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await usuariosService.get({ id });

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener usuarios', error });
  }
}

export const create = async (req, res) => {
  let connection;

  try {
    connection = await createTransaction();

    const idUsuario = await usuariosService.create({ ...req.body, connection });

    await connection.commit();
    res.status(201).json({ message: 'Usuario creado exitosamente', idUsuario });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al crear Usuario', error: error.message });
  }
}

export const update = async (req, res) => {
  let connection;
  
  try {
    const { id } = req.params;
    const { mail: userEmail } = req.user.profile;
    connection = await createTransaction();

    await usuariosService.update({ ...req.body, userEmail, connection, id });

    await connection.commit();
    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al actualizar Usuario', error: error.message });
  }
}

export const softDelete = async (req, res) => {
  const { mail: userEmail } = req.user.profile;
  let connection;

  try {
    connection = await createTransaction();
    const { id } = req.params;

    await usuariosService.softDelete({ id, userEmail, connection });

    connection.commit();
    res.status(200).json({ message: 'Usuario borrado' });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al borrar Usuario', error: error.message });
  }
}

export const getRolesPermisos = async (req, res) => {
  try {
    const result = await usuariosService.getRolesPermisos();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener roles-permisos', error });
  }
}