import * as choferesService from "../services/choferes.js";

export const get = async (req, res) => {
  try {
    const result = await choferesService.get();

    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener choferes', error });
  }
}