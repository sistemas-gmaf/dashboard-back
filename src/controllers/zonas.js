import * as zonasService from "../services/zonas.js";

export const get = async (req, res) => {
  try {
    const result = await zonasService.get();

    res.json({ data: result });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: 'Error al obtener vehiculos', error });
  }
}