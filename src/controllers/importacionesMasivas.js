import { createTransaction } from "../configs/dbConnection.js";
import * as vehiculosService from "../services/vehiculos.js";
import * as clientesService from "../services/clientes.js";
import * as zonasService from "../services/zonas.js";
import * as tarifarioClientesService from "../services/tarifarioClientes.js";
import * as tarifarioTransportesService from "../services/tarifarioTransportes.js";

import { getDate } from "../utils/time.js";

export const importarTarifarios = async (req, res) => {
  let connection;
  let mapClientes = {};
  let mapVehiculoTipos = {};
  let mapZonas = {};
  let errors = [];
  const { mail: userEmail } = req.user.profile;
  try {
    connection = await createTransaction();

    const tarifarios = JSON.parse(req.body.tarifarios);
    const clientes = new Set(tarifarios.map(tarifario => tarifario.CLIENTE));
    const tiposVehiculo = new Set(tarifarios.map(tarifario => tarifario.UNIDAD));
    const zonas = new Set(tarifarios.map(tarifario => tarifario.ZONA));
    const date = getDate();

    for (const razon_social of clientes) {
      const idCliente = await clientesService.getByRazonSocial({ razon_social });
      mapClientes[razon_social] = idCliente;

      if (!idCliente) {
        errors.push(`El cliente ${razon_social} no existe en la base de datos, verifique que se encuentre disponible`);
      }
    }

    if (errors.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Importación fallida', errors });
    }

    for (const descripcion of tiposVehiculo) {
      const idTipoVehiculo = await vehiculosService.upsertTipos({ descripcion, connection });
      mapVehiculoTipos[descripcion] = idTipoVehiculo;
    }

    for (const descripcion of zonas) {
      const idZona = await zonasService.upsert({ descripcion, connection });
      mapZonas[descripcion] = idZona;
    }

    const insertTarifarioCliente = tarifarios.map(tarifario => 
      tarifarioClientesService.massiveUpsert({
        vehiculo_tipo: mapVehiculoTipos[tarifario.UNIDAD],
        zona: mapZonas[tarifario.ZONA],
        cliente: mapClientes[tarifario.CLIENTE],
        monto: tarifario.VCLIENTE || 0,
        monto_por_ayudante: tarifario.VCLIENTEAYUDANTE || 0,
        fecha_desde: date,
        connection,
        userEmail
      })
    );

    const insertTarifarioTransporteGeneral = tarifarios.map(tarifario => 
      tarifarioTransportesService.massiveUpsert({
        vehiculo_tipo: mapVehiculoTipos[tarifario.UNIDAD],
        zona: mapZonas[tarifario.ZONA],
        cliente: mapClientes[tarifario.CLIENTE],
        monto: tarifario.VPROVEEDOR || 0, 
        monto_por_ayudante: tarifario.VPROVEEDORAYUDANTE || 0,
        fecha_desde: date,
        connection,
        userEmail
      })
    );

    await Promise.all([...insertTarifarioCliente, ...insertTarifarioTransporteGeneral]);

    await connection.commit();
    res.status(200).json({ message: 'Importacion masiva realizada con exito' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error al hacer la importacion masiva de tarifarios', error: error.message });
  }
}