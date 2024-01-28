INSERT INTO cliente (cuit, razon_social, abreviacion_razon_social, telefono, correo, fecha_creacion) VALUES
('30716842149', 'GAPP LOGISTICA S.R.L.', 'GAPP LOGISTICA', '', 'mgiordano@gapplogistica.com.ar', current_date),
('30715121839', 'INTRAPAL SA', 'INTRAPAL', '', 'cvieites@intralog.com.ar', current_date),
('30712311033', 'INTRALOG ARGENTINA SA', 'INTRALOG', '', 'cvieites@intralog.com.ar', current_date),
('30715239007', 'WEB PACK SRL', 'WEBPACK', '', 'administracion@webpack.com.ar', current_date),
('30692307301', 'SURMARKET SA', 'SURMARKET', '', 'dsaldias@surmarket.com.ar', current_date),
('30715213083', 'ENVIOPACK S.A.', 'ENVIOPACK', '', 'matias.f@enviopack.com', current_date),
('30717087468', 'LOGISPACK SRL.', 'LOGISPACK', '', 'matias.f@enviopack.com', current_date),
('30707338977', 'IMPORTADORA SUDAMERICANA S.R.L.', 'IMPORTADORA', '', 'jlorenzo@imposudamericana.com.ar', current_date),
('30629145458', 'TASA LOGISTICA SA', 'TASA LOGISTICA', '', 'mfayo@dpd.com.ar', current_date),
('33708162219', 'EDITORIAL GUADAL SA', 'GUADAL', '', 'vbustos@editorialguadal.com.ar', current_date),
('30541053863', 'SA ANGEL BARALDO CIA', 'BARALDO', '', 'gustavo.araoz@angelbaraldo.com.ar', current_date),
('20309300433', 'GRUPO MAF', 'GRUPO MAF', '1166933480', 'arufas@grupomaf.com.ar', current_date),
('30682543155', 'AGRO DE CUYO S.A.', 'AGRO DE CUYO', '1150610442', 'rmartinez@probattery.com.ar', current_date),
('30715005332', 'HOLLYBAR S.A.', 'HOLLYBAR', NULL, 'dsaldias@surmarket.com.ar', current_date),
('20203335553', 'VULCANO', 'VULCANO', '44555888', 'arirufas@gmail.com', current_date),
('20335546663', 'TLM', 'TLM', '11554558', 'asdasfas@gmail.com', current_date),
('30709834491', 'TRANSLOG', 'TRANSLOG', '', '@translog.com', current_date),
('30709752118', 'FAG SISTEMS S.A', 'FAGSISTEM', '1135651780', 'mrecagno@fagsistems.com.ar', current_date),
('30696881711', 'SODIMAC S A', 'SODIMAC', '1166933408', 'arias5465@gmail.com', current_date),
('2030541653', 'LIMANSKY', 'LIMANSKY', '1166844280', 'ass@gmail.com', current_date),
('2035468416', 'VF', 'VF', '11234567899', 'aris@gmail.com', current_date);

UPDATE cliente SET 
  cuit=UPPER(TRIM(cuit)), 
  razon_social=UPPER(TRIM(razon_social)), 
  abreviacion_razon_social=UPPER(TRIM(abreviacion_razon_social)), 
  telefono=UPPER(TRIM(telefono)), 
  correo=LOWER(TRIM(correo));