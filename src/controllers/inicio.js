import * as inicioService from '../services/inicio.js';

export const get = async (req, res) => {
  try {
    const result = await inicioService.get();

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos', error: error.message });
  }
}