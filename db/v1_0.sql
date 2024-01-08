BEGIN;

--tabla para la sesion con la extension express-session
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Crear tabla usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla rol
CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla permiso
CREATE TABLE permiso (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla usuario_rol
CREATE TABLE usuario_rol (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario (id),
    FOREIGN KEY (id_rol) REFERENCES rol (id)
);

-- Crear tabla rol_permiso
CREATE TABLE rol_permiso (
    id SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL,
    id_permiso INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES rol (id),
    FOREIGN KEY (id_permiso) REFERENCES permiso (id)
);

-- Crear tabla recordatorio
CREATE TABLE recordatorio (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50),
    descripcion TEXT,
    fecha_limite CHAR(8) NOT NULL,
    cantidad_dias_aviso INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla documentacion
CREATE TABLE documentacion (
    id SERIAL PRIMARY KEY,
    tipo_poseedor VARCHAR(150) NOT NULL,
    id_poseedor INTEGER NOT NULL,
    tipo_documentacion VARCHAR(50) NOT NULL,
    drive_id_onedrive VARCHAR(200) NOT NULL,
    item_id_onedrive varchar(200) NOT NULL,
    tipo_archivo VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

ALTER TABLE documentacion
ADD CONSTRAINT unique_constraint_name UNIQUE (tipo_documentacion, tipo_poseedor, id_poseedor);

-- Crear tabla estado_cheque
CREATE TABLE estado_cheque (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla cheque
CREATE TABLE cheque (
    id SERIAL PRIMARY KEY,
    fecha_emision CHAR(8),
    fecha_pago CHAR(8),
    numero VARCHAR(50),
    banco VARCHAR(100),
    importe NUMERIC(12, 2),
    referencia VARCHAR(100),
    proveedor VARCHAR(100),
    estado VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla compromiso
CREATE TABLE compromiso (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    razon_social VARCHAR(100) NOT NULL,
    referencia VARCHAR(100),
    importe NUMERIC(12, 2),
    fecha CHAR(8) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla transporte
CREATE TABLE transporte (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla vehiculo_tipo
CREATE TABLE vehiculo_tipo (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(30) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla vehiculo
CREATE TABLE vehiculo (
    id SERIAL PRIMARY KEY,
    patente VARCHAR(15) NOT NULL,
    id_vehiculo_tipo INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_vehiculo_tipo) REFERENCES vehiculo_tipo (id)
);

-- Crear tabla chofer
CREATE TABLE chofer (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    celular VARCHAR(30),
    dni VARCHAR(15),
    correo VARCHAR(100),
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla chofer_vehiculo
CREATE TABLE chofer_vehiculo (
    id SERIAL PRIMARY KEY,
    id_chofer INTEGER NOT NULL,
    id_vehiculo INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_chofer) REFERENCES chofer (id),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo (id)
);

-- Crear tabla zona
CREATE TABLE zona (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(150) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla cliente
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    cuit VARCHAR(20) NOT NULL,
    razon_social VARCHAR(100) NOT NULL,
    abreviacion_razon_social VARCHAR(15),
    telefono VARCHAR(50),
    correo VARCHAR(100),
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla vehiculo_tipo_zona
CREATE TABLE vehiculo_tipo_zona (
    id SERIAL PRIMARY KEY,
    id_vehiculo_tipo INTEGER NOT NULL,
    id_zona INTEGER NOT NULL,
    fecha_desde TIMESTAMP NOT NULL,
    fecha_hasta TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_vehiculo_tipo) REFERENCES vehiculo (id),
    FOREIGN KEY (id_zona) REFERENCES vehiculo_tipo (id)
);

-- Crear tabla tarifario_cliente
CREATE TABLE tarifario_cliente (
    id SERIAL PRIMARY KEY,
    id_vehiculo_tipo_zona INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
    monto NUMERIC NOT NULL,
    monto_por_ayudante NUMERIC NOT NULL,
    fecha_desde TIMESTAMP NOT NULL,
    fecha_hasta TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_vehiculo_tipo_zona) REFERENCES vehiculo_tipo_zona (id),
    FOREIGN KEY (id_cliente) REFERENCES cliente (id)
);

-- Crear tabla tarifario_transporte_general
CREATE TABLE tarifario_transporte_general (
    id SERIAL PRIMARY KEY,
    id_vehiculo_tipo_zona INTEGER NOT NULL,
    monto NUMERIC NOT NULL,
    monto_por_ayudante NUMERIC NOT NULL,
    fecha_desde TIMESTAMP NOT NULL,
    fecha_hasta TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_vehiculo_tipo_zona) REFERENCES vehiculo_tipo_zona (id)
);

-- Crear tabla tarifario_transporte_especial
CREATE TABLE tarifario_transporte_especial (
    id SERIAL PRIMARY KEY,
    id_vehiculo_tipo_zona INTEGER NOT NULL,
    id_transporte INTEGER NOT NULL,
    monto NUMERIC NOT NULL,
    monto_por_ayudante NUMERIC NOT NULL,
    fecha_desde TIMESTAMP NOT NULL,
    fecha_hasta TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_vehiculo_tipo_zona) REFERENCES vehiculo_tipo_zona (id),
    FOREIGN KEY (id_transporte) REFERENCES transporte (id)
);

-- Crear tabla viaje_estado
CREATE TABLE viaje_estado (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla viaje_remito_tipo
CREATE TABLE viaje_remito_tipo (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL
);

-- Crear tabla viaje
CREATE TABLE viaje (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_vehiculo INTEGER NOT NULL,
    id_zona_destino INTEGER NOT NULL,
    fecha_salida CHAR(8),
    id_viaje_estado INTEGER NOT NULL,
    segundo_viaje_porcentaje INTEGER,
    cantidad_ayudantes INTEGER DEFAULT 0 NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente (id),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo (id),
    FOREIGN KEY (id_zona_destino) REFERENCES zona (id),
    FOREIGN KEY (id_viaje_estado) REFERENCES viaje_estado (id)
);

-- Crear tabla viaje_remito
CREATE TABLE viaje_remito (
    id SERIAL PRIMARY KEY,
    id_viaje INTEGER NOT NULL,
    id_viaje_remito_tipo INTEGER NOT NULL,
    referencia VARCHAR(100),
    observacion TEXT,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_viaje) REFERENCES viaje (id),
    FOREIGN KEY (id_viaje_remito_tipo) REFERENCES viaje_remito_tipo (id)
);

-- Crear tabla viaje_bitacora
CREATE TABLE viaje_bitacora (
    id SERIAL PRIMARY KEY,
    id_viaje INTEGER NOT NULL,
    observacion TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_viaje) REFERENCES viaje (id)
);

--Crear tabla viaje_tarifario
CREATE TABLE viaje_tarifario (
    id SERIAL PRIMARY KEY,
    id_viaje INTEGER NOT NULL,
    id_tarifario_cliente INTEGER NOT NULL,
    id_tarifario_transporte_general INTEGER,
    id_tarifario_transporte_especial INTEGER,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_viaje) REFERENCES viaje (id),
    FOREIGN KEY (id_tarifario_cliente) REFERENCES tarifario_cliente (id),
    FOREIGN KEY (id_tarifario_transporte_general) REFERENCES tarifario_transporte_general (id),
    FOREIGN KEY (id_tarifario_transporte_especial) REFERENCES tarifario_transporte_especial (id)
);

-- Crear tabla tarifario_viaje_especial
CREATE TABLE tarifario_viaje_especial (
    id SERIAL PRIMARY KEY,
    id_viaje INTEGER NOT NULL,
    monto_cliente NUMERIC NOT NULL,
    monto_cliente_por_ayudante NUMERIC NOT NULL,
    monto_transporte NUMERIC NOT NULL,
    monto_transporte_por_ayudante NUMERIC NOT NULL,
    aprobado BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_viaje) REFERENCES viaje (id)
);

-- Crear tabla transporte_vehiculo
CREATE TABLE transporte_vehiculo (
    id SERIAL PRIMARY KEY,
    id_transporte INTEGER NOT NULL,
    id_vehiculo INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_edicion TIMESTAMP NULL,
    correo_ultima_edicion VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT true NOT NULL,
    FOREIGN KEY (id_transporte) REFERENCES transporte (id),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo (id)
);

COMMIT;
