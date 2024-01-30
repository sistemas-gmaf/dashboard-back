import { dbConnection } from "../configs/dbConnection.js";

export const validar = (permiso) => {
  return async (req, res, next) => {
    try {
      const { mail: userEmail } = req.user.profile;
      const query = `
        SELECT p.label FROM permiso p
        LEFT JOIN usuario_permiso up ON p.id=up.id_permiso
        LEFT JOIN usuario u ON up.id_usuario=u.id
        WHERE p.activo=TRUE AND u.correo=$1
        AND u.activo = true AND COALESCE(up.activo, FALSE) = true
        ORDER BY p.id ASC
      `;
      const result = await dbConnection.query(query, [userEmail]);
      const permisos = result.rows.map(permiso => permiso.label);
      // Verificar si el usuario tiene el permiso necesario
      if (req.user && req.user.profile && req.user.profile.permisos && permisos.includes(permiso)) {
        // El usuario tiene el permiso, continúa con la siguiente middleware/controlador
        next();
      } else {
        // El usuario no tiene el permiso, devuelve un error
        res.status(403).json({ error: 'Acceso no autorizado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al validar permiso', error: error.message });
    }
  }; 
};