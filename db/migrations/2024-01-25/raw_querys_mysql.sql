--cheques
SELECT 
	DATE_FORMAT(fecha_emision, '%Y%m%d') as fecha_emision, 
	DATE_FORMAT(fecha_pago, '%Y%m%d') as fecha_pago,
  nro_cheque as numero,
  UPPER(TRIM(banco)) as banco,
  importe,
  UPPER(TRIM(referencia)) as referencia,
  UPPER(TRIM(proveedor)) as proveedor,
  UPPER(TRIM(estado)) as estado
FROM `cheques`;

-- chofer
SELECT DISTINCT
	UPPER(TRIM(chofer)) as nombre,
    CASE
        WHEN UPPER(TRIM(telefono)) = 0 THEN NULL
        ELSE UPPER(TRIM(telefono))
    END AS celular,
    CASE
        WHEN UPPER(TRIM(dni)) = 0 THEN NULL
        ELSE UPPER(TRIM(dni))
    END AS dni,
	null as correo
FROM `choferes`
UNION
select DISTINCT
	UPPER(TRIM(v_name)) as nombre,
    null as celular,
    null as dni,
    null as correo
from vehicles;

-- chofer_vehiculo
-- para insertar la relacion se debe matchear la patente 
-- con id_vehiculo y el nombre y el dni con el id_chofer
SELECT 
	patente as match_vehiculo_patente, 
  chofer as match_chofer_nombre, 
  dni as match_chofer_dni
FROM `choferes`;

--cliente
SELECT 
	cuit,
  nombre as razon_social,
  abreviacion as abreviacion_razon_social,
  c_mobile as telefono,
  email as correo
FROM `clientes`;

--compromiso
SELECT 
	UPPER(TRIM(categoria)) as categoria,
	UPPER(TRIM(razon_social)) as razon_social,
	UPPER(TRIM(referencia)) as referencia,
	importe,
	DATE_FORMAT(fecha, '%Y%m%d') as fecha,
	UPPER(TRIM(estado)) as estado
FROM `compromisos`;

-- transporte
SELECT TRIM(t1.nombre), t1.descripcion FROM (select DISTINCT 
	UPPER(TRIM(transporte)) as nombre, '' as descripcion 
from choferes
UNION
select DISTINCT 
	UPPER(TRIM(v_transporte)) as nombre, '' as descripcion 
from vehicles) t1 group by t1.nombre order by t1.nombre;

-- transporte_vehiculo
-- para insertar la relacion se debe matchear la patente 
-- con id_vehiculo y el nombre el id_transporte
select distinct t1.patente, t1.nombre from (select DISTINCT 
	UPPER(TRIM(transporte)) as nombre, UPPER(TRIM(patente)) as patente
from choferes
UNION
select DISTINCT 
	UPPER(TRIM(v_transporte)) as nombre, UPPER(TRIM(v_patente)) as patente
from vehicles) t1;

-- vehiculo
-- para insertar la relacion de id_vehiculo_tipo se debe matchear
-- vehiculo_tipo_descripcion_match con descripcion de vehiculo_tipo
SELECT DISTINCT
    UPPER(patente) as patente,
    UPPER(unidad) as vehiculo_tipo_descripcion_match
FROM `choferes`
UNION
SELECT DISTINCT
	UPPER(v_patente) as patente, 
    UPPER(v_type) as vehiculo_tipo_descripcion_match 
FROM vehicles;

-- vehiculo_tipo
SELECT DISTINCT
    UPPER(unidad) as descripcion
FROM `choferes`;

-- zona
select distinct UPPER(TRIM(zona)) as descripcion
from tarifariogeneral
UNION
SELECT UPPER(TRIM(zona)) as descripcion FROM `zonas`;

-- tarifario_transporte_especial
-- tengo que hacer match con cliente transporte unidad y zona
select cliente, transporte, unidad, zona, vproveedor
from tarifariogeneral 
group by cliente, unidad, zona, vproveedor 
HAVING count(*) = 1
order by transporte, unidad, zona;


-- tarifario_transporte_general
-- tengo que hacer match con cliente, unidad y zona
select cliente, unidad, zona, vproveedor
from tarifariogeneral 
group by cliente, unidad, zona, vproveedor 
HAVING count(*) > 1
order by unidad, zona;

-- tarifario_cliente
-- tengo que hacer match con cliente unidad y zona
select cliente, unidad, zona, vcliente
from tarifariogeneral
GROUP by cliente, unidad, zona, vcliente
order by cliente, unidad, zona;