BEGIN;

INSERT INTO usuario(correo, fecha_creacion) VALUES
    ('sistemas@grupomaf.com.ar', current_timestamp);

INSERT INTO vehiculo_tipo (descripcion, fecha_creacion, activo) VALUES
    ('MEDIANO', current_timestamp, true),
    ('CHASIS FRIO', current_timestamp, true),
    ('UTILITARIO', current_timestamp, true),
    ('MEDIANO FRIO', current_timestamp, true),
    ('LIVIANO', current_timestamp, true),
    ('CHASIS', current_timestamp, true),
    ('LIVIANO FRIO', current_timestamp, true),
    ('SEMI', current_timestamp, true),
    ('BALANCIN', current_timestamp, true),
    ('COMBI', current_timestamp, true),
    ('UTILITARIO FRIO', current_timestamp, true),
    ('AUTO', current_timestamp, true),
    ('MEDIANA', current_timestamp, true);

INSERT INTO permiso (label, descripcion, fecha_creacion) VALUES
    ('VER_INICIO', 'Ver inicio', CURRENT_DATE),
    ('VER_TRANSPORTES', 'Ver transportes', CURRENT_DATE),
    ('VER_VEHICULOS', 'Ver vehículos', CURRENT_DATE),
    ('VER_CHOFERES', 'Ver choferes', CURRENT_DATE),
    ('VER_VIAJES', 'Ver viajes', CURRENT_DATE),
    ('VER_TARIFARIOS', 'Ver tarifarios', CURRENT_DATE),
    ('VER_CLIENTES', 'Ver clientes', CURRENT_DATE),
    ('VER_CHEQUES', 'Ver cheques', CURRENT_DATE),
    ('VER_COMPROMISOS', 'Ver compromisos', CURRENT_DATE),
    ('VER_RECORDATORIOS', 'Ver recordatorios', CURRENT_DATE),
    ('VER_GESTION_USUARIOS', 'Ver gestión de usuarios', CURRENT_DATE),
    ('VER_INICIO_VIAJES_FINALIZADOS', 'Ver inicio - Viajes finalizados', CURRENT_DATE),
    ('VER_INICIO_VIAJES_PENDIENTES_APROBACION', 'Ver inicio - Viajes pendientes aprobación', CURRENT_DATE),
    ('VER_INICIO_VEHICULOS_UTILIZADOS', 'Ver inicio - Vehículos utilizados', CURRENT_DATE),
    ('VER_INICIO_TOTAL_VENTAS', 'Ver inicio - Total ventas', CURRENT_DATE),
    ('VER_INICIO_TOTAL_COMPRAS', 'Ver inicio - Total compras', CURRENT_DATE),
    ('VER_INICIO_TOTAL_BENEFICIO', 'Ver inicio - Total beneficio', CURRENT_DATE),
    ('VER_INICIO_CHEQUES_PENDIENTES', 'Ver inicio - Cheques pendientes', CURRENT_DATE),
    ('VER_INICIO_COMPROMISOS_PENDIENTES', 'Ver inicio - Compromisos pendientes', CURRENT_DATE),
    ('CREAR_TRANSPORTE', 'Crear transporte', CURRENT_DATE),
    ('EDITAR_TRANSPORTE', 'Editar transporte', CURRENT_DATE),
    ('ELIMINAR_TRANSPORTE', 'Eliminar transporte', CURRENT_DATE),
    ('CREAR_VEHICULO', 'Crear vehículo', CURRENT_DATE),
    ('EDITAR_VEHICULO', 'Editar vehículo', CURRENT_DATE),
    ('ELIMINAR_VEHICULO', 'Eliminar vehículo', CURRENT_DATE),
    ('CREAR_CHOFER', 'Crear chofer', CURRENT_DATE),
    ('EDITAR_CHOFER', 'Editar chofer', CURRENT_DATE),
    ('ELIMINAR_CHOFER', 'Eliminar chofer', CURRENT_DATE),
    ('CREAR_VIAJE', 'Crear viaje', CURRENT_DATE),
    ('EDITAR_VIAJE', 'Editar viaje', CURRENT_DATE),
    ('ELIMINAR_VIAJE', 'Eliminar viaje', CURRENT_DATE),
    ('APROBAR_VIAJE', 'Aprobar tarifario excepcional', CURRENT_DATE),
    ('CREAR_TARIFARIO_CLIENTE', 'Crear tarifario cliente', CURRENT_DATE),
    ('EDITAR_TARIFARIO_CLIENTE', 'Editar tarifario cliente', CURRENT_DATE),
    ('ELIMINAR_TARIFARIO_CLIENTE', 'Eliminar tarifario cliente', CURRENT_DATE),
    ('CREAR_TARIFARIO_PROVEEDOR', 'Crear tarifario proveedor', CURRENT_DATE),
    ('EDITAR_TARIFARIO_PROVEEDOR', 'Editar tarifario proveedor', CURRENT_DATE),
    ('ELIMINAR_TARIFARIO_PROVEEDOR', 'Eliminar tarifario proveedor', CURRENT_DATE),
    ('CREAR_TARIFARIO_PROVEEDOR_ESPECIAL', 'Crear tarifario proveedor especial', CURRENT_DATE),
    ('EDITAR_TARIFARIO_PROVEEDOR_ESPECIAL', 'Editar tarifario proveedor especial', CURRENT_DATE),
    ('ELIMINAR_TARIFARIO_PROVEEDOR_ESPECIAL', 'Eliminar tarifario proveedor especial', CURRENT_DATE),
    ('IMPORTAR_TARIFARIOS_MASIVO', 'Importar tarifarios masivo', CURRENT_DATE),
    ('CREAR_CLIENTE', 'Crear cliente', CURRENT_DATE),
    ('EDITAR_CLIENTE', 'Editar cliente', CURRENT_DATE),
    ('ELIMINAR_CLIENTE', 'Eliminar cliente', CURRENT_DATE),
    ('CREAR_RECORDATORIO', 'Crear recordatorio', CURRENT_DATE),
    ('EDITAR_RECORDATORIO', 'Editar recordatorio', CURRENT_DATE),
    ('ELIMINAR_RECORDATORIO', 'Eliminar recordatorio', CURRENT_DATE),
    ('CREAR_CHEQUE', 'Crear cheque', CURRENT_DATE),
    ('EDITAR_CHEQUE', 'Editar cheque', CURRENT_DATE),
    ('ELIMINAR_CHEQUE', 'Eliminar cheque', CURRENT_DATE),
    ('CREAR_COMPROMISO', 'Crear compromiso', CURRENT_DATE),
    ('EDITAR_COMPROMISO', 'Editar compromiso', CURRENT_DATE),
    ('ELIMINAR_COMPROMISO', 'Eliminar compromiso', CURRENT_DATE),
    ('CREAR_USUARIO', 'Crear usuario', CURRENT_DATE),
    ('EDITAR_USUARIO', 'Editar usuario', CURRENT_DATE),
    ('ELIMINAR_USUARIO', 'Eliminar usuario', CURRENT_DATE),
    ('CREAR_ROL', 'Crear rol', CURRENT_DATE),
    ('EDITAR_ROL', 'Editar rol', CURRENT_DATE),
    ('ELIMINAR_ROL', 'Eliminar rol', CURRENT_DATE);

INSERT INTO rol(label, descripcion, fecha_creacion) VALUES
	('ADMINISTRADOR', 'Administrador general del sistema', CURRENT_DATE),
	('EMPLEADO', 'Empleado de la empresa', CURRENT_DATE),
	('ADMINISTRATIVO', 'Administrativo de la empresa', CURRENT_DATE);

INSERT INTO rol_permiso(id_permiso, id_rol, fecha_creacion) VALUES
	(1, 1, CURRENT_DATE),
	(1, 2, CURRENT_DATE),
	(1, 3, CURRENT_DATE),

	(2, 1, CURRENT_DATE),
	(2, 2, CURRENT_DATE),
	(2, 3, CURRENT_DATE),

	(3, 1, CURRENT_DATE),
	(3, 2, CURRENT_DATE),
	(3, 3, CURRENT_DATE),

	(4, 1, CURRENT_DATE),
	(4, 2, CURRENT_DATE),
	(4, 3, CURRENT_DATE),

	(5, 1, CURRENT_DATE),
	(5, 2, CURRENT_DATE),
	(5, 3, CURRENT_DATE),

	(6, 1, CURRENT_DATE),
	(6, 3, CURRENT_DATE),

	(7, 1, CURRENT_DATE),
	(7, 3, CURRENT_DATE),

	(8, 1, CURRENT_DATE),

	(9, 1, CURRENT_DATE),

	(10, 1, CURRENT_DATE),
	(10, 2, CURRENT_DATE),
	(10, 3, CURRENT_DATE),

	(11, 1, CURRENT_DATE),

	(12, 1, CURRENT_DATE),
	(12, 2, CURRENT_DATE),
	(12, 3, CURRENT_DATE),

	(13, 1, CURRENT_DATE),

	(14, 1, CURRENT_DATE),
	(14, 2, CURRENT_DATE),
	(14, 3, CURRENT_DATE),

	(15, 1, CURRENT_DATE),
	(15, 2, CURRENT_DATE),
	(15, 3, CURRENT_DATE),

	(16, 1, CURRENT_DATE),

	(17, 1, CURRENT_DATE),

	(18, 1, CURRENT_DATE),

	(19, 1, CURRENT_DATE),

	(20, 1, CURRENT_DATE),
	(20, 2, CURRENT_DATE),
	(20, 3, CURRENT_DATE),

	(21, 1, CURRENT_DATE),
	(21, 2, CURRENT_DATE),
	(21, 3, CURRENT_DATE),

	(22, 1, CURRENT_DATE),
	(22, 2, CURRENT_DATE),
	(22, 3, CURRENT_DATE),

	(23, 1, CURRENT_DATE),
	(23, 2, CURRENT_DATE),
	(23, 3, CURRENT_DATE),

	(24, 1, CURRENT_DATE),
	(24, 2, CURRENT_DATE),
	(24, 3, CURRENT_DATE),

	(25, 1, CURRENT_DATE),
	(25, 2, CURRENT_DATE),
	(25, 3, CURRENT_DATE),

	(26, 1, CURRENT_DATE),
	(26, 2, CURRENT_DATE),
	(26, 3, CURRENT_DATE),

	(27, 1, CURRENT_DATE),
	(27, 2, CURRENT_DATE),
	(27, 3, CURRENT_DATE),

	(28, 1, CURRENT_DATE),
	(28, 2, CURRENT_DATE),
	(28, 3, CURRENT_DATE),

	(29, 1, CURRENT_DATE),
	(29, 2, CURRENT_DATE),
	(29, 3, CURRENT_DATE),

	(30, 1, CURRENT_DATE),
	(30, 2, CURRENT_DATE),
	(30, 3, CURRENT_DATE),

	(31, 1, CURRENT_DATE),
	(31, 2, CURRENT_DATE),
	(31, 3, CURRENT_DATE),

	(32, 1, CURRENT_DATE),

	(33, 1, CURRENT_DATE),
	(33, 3, CURRENT_DATE),

	(34, 1, CURRENT_DATE),
	(34, 3, CURRENT_DATE),

	(35, 1, CURRENT_DATE),

	(36, 1, CURRENT_DATE),
	(36, 3, CURRENT_DATE),

	(37, 1, CURRENT_DATE),
	(37, 3, CURRENT_DATE),

	(38, 1, CURRENT_DATE),

	(39, 1, CURRENT_DATE),
	(39, 3, CURRENT_DATE),

	(40, 1, CURRENT_DATE),
	(40, 3, CURRENT_DATE),

	(41, 1, CURRENT_DATE),

	(42, 1, CURRENT_DATE),
	(42, 3, CURRENT_DATE),

	(43, 1, CURRENT_DATE),
	(43, 3, CURRENT_DATE),

	(44, 1, CURRENT_DATE),
	(44, 3, CURRENT_DATE),

	(45, 1, CURRENT_DATE),
	(45, 3, CURRENT_DATE),

	(46, 1, CURRENT_DATE),
	(46, 3, CURRENT_DATE),

	(47, 1, CURRENT_DATE),
	(47, 3, CURRENT_DATE),

	(48, 1, CURRENT_DATE),
	(48, 3, CURRENT_DATE),

	(49, 1, CURRENT_DATE),

	(50, 1, CURRENT_DATE),

	(51, 1, CURRENT_DATE),

	(52, 1, CURRENT_DATE),

	(53, 1, CURRENT_DATE),

	(54, 1, CURRENT_DATE),

	(55, 1, CURRENT_DATE),

	(56, 1, CURRENT_DATE),

	(57, 1, CURRENT_DATE),

	(58, 1, CURRENT_DATE),

	(59, 1, CURRENT_DATE),

	(60, 1, CURRENT_DATE);

COMMIT;