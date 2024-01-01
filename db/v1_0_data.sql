BEGIN;

INSERT INTO usuario(correo, fecha_creacion)
VALUES('sistemas@grupomaf.com.ar', current_timestamp)

INSERT INTO vehiculo_tipo (descripcion, fecha_creacion, activo)
VALUES
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
COMMIT;