import { createTransaction } from "../configs/dbConnection.js";
import * as zonasService from "../services/zonas.js";

export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await zonasService.get({ id });

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener zonas', error });
  }
}

export const getByTarifario = async (req, res) => {
  try {
    const { fecha_salida, cliente, vehiculo } = req.query;

    const result = await zonasService.getByTarifario({ fecha_salida, cliente, vehiculo });

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener zonas', error });
  }
}

export const create = async (req, res) => {
  let connection;

  try {
    connection = await createTransaction();

    const idZona = await zonasService.create({ ...req.body, connection });

    await connection.commit();
    res.status(201).json({ message: 'Zona creada exitosamente', idZona });
  } catch (error) {
    await connection?.rollback();
    res.status(error?.statusCode || 500).json({ message: 'Error al crear zona', error: error.message });
  }
}