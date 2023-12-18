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