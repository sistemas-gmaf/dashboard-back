import { dbConnection } from "../configs/dbConnection.js";
import { getTimestamp } from "../utils/time.js";

export const get = async ({ id }) => {
  try {
    let query = `
      SELECT 
        id,
        correo,
        fecha_creacion,
        TO_CHAR(fecha_creacion, 'DD/MM/YYYY') as fecha_creacion_formateada,
        CASE activo
          WHEN true THEN 'ACTIVO'
          ELSE 'INACTIVO'
        END as activo
      FROM usuario WHERE activo=TRUE
    `;

    const queryPermisos = `
      SELECT 
        p.id,
        p.label,
        p.descripcion,
        COALESCE(up.activo, false) AS habilitado
      FROM 
        permiso p
        LEFT JOIN usuario_permiso up
          ON p.id=up.id_permiso
        LEFT JOIN usuario u
          ON up.id_usuario=u.id
      WHERE 
        p.activo=TRUE
        AND u.id=$1
      ORDER BY p.id ASC
    `;

    if (id) {
      query += ' AND id=$1';
    }

    let usuarios, permisos;
    
    if (id) {
      usuarios = await dbConnection.query(query, [id]);
      permisos = await dbConnection.query(queryPermisos, [id]);
      return {
        usuario: usuarios.rows[0],
        permisos: permisos.rows
      };
    } else {
      usuarios = await dbConnection.query(query);
      return usuarios.rows;
    }

  } catch (error) {
    throw error;
  }
}

export const create = async ({ correo, permisos: permisosString, connection }) => {
  try {
    const permisos = JSON.parse(permisosString);
    const timestamp = getTimestamp();

    const query = `
      INSERT INTO usuario(
        correo, fecha_creacion, activo
      )
      VALUES (LOWER($1), $2, true)
      RETURNING id
    `;

    const result = await connection.queryWithParameters(query, [correo, timestamp]);
    const idUsuario = result.rows[0].id;

    const queryPermisos = `
      INSERT INTO usuario_permiso (id_usuario, id_permiso, fecha_creacion, activo)
      VALUES ($1, $2, $3, $4)
    `;

    // Obtener las claves y valores de permisos
    const permisoEntries = Object.entries(permisos);

    // Ejecutar la query de upsert para cada permiso
    for (const [id_permiso, activo] of permisoEntries) {
      await connection.queryWithParameters(queryPermisos, [idUsuario, id_permiso, timestamp, activo]);
    }

    return idUsuario;
  } catch (error) {
    throw error;
  }
}

export const update = async ({ id, userEmail, permisos: permisosString, connection }) => {
  try {
    const permisos = JSON.parse(permisosString);
    const timestamp = getTimestamp();

    // Obtener las claves y valores de permisos
    const permisoEntries = Object.entries(permisos);

    // Crear la query de upsert con parámetros
    const upsertQuery = `
      INSERT INTO usuario_permiso (id_usuario, id_permiso, fecha_creacion, activo)
      VALUES 
        ($1, $2, $3, $4)
      ON CONFLICT (id_usuario, id_permiso) DO UPDATE
      SET activo = $4, correo_ultima_edicion = $5, fecha_ultima_edicion = $3
      RETURNING *;
    `;

    // Ejecutar la query de upsert para cada permiso
    for (const [id_permiso, activo] of permisoEntries) {
      await connection.queryWithParameters(upsertQuery, [id, id_permiso, timestamp, activo, userEmail]);
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export const softDelete = async ({ id, userEmail, connection }) => {
  try {
    const timestamp = getTimestamp();
    let query = `
      UPDATE usuario SET
        activo=false, 
        fecha_ultima_edicion=$1, 
        correo_ultima_edicion=$2
      WHERE
        id=$3
    `;

    await connection.queryWithParameters(query, [timestamp, userEmail, id]);

    return true;
  } catch (error) {
    throw error;
  }
}

export const getRolesPermisos = async () => {
  try {
    const query = `
      SELECT 
        p.id,
        r.label rol,
        p.label,
        p.descripcion,
        COALESCE(rp.id IS NOT NULL, FALSE) AS habilitado
      FROM 
        permiso p
        LEFT JOIN rol_permiso rp
          ON rp.id_permiso=p.id
        LEFT JOIN rol r
          ON rp.id_rol=r.id
      WHERE 
        p.activo=TRUE
      ORDER BY r.label ASC
    `;

    const result = await dbConnection.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}