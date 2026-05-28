DO $$
DECLARE
  artesId      UUID := '2c4707a0-541d-4fc1-a4e9-b4f830114332';
  rolePregrad  UUID := '7cb5a57c-fe74-4600-841a-d8ee02dd1a6d';
  rolePosgrado UUID := '5e13ea33-23dd-4a35-8497-66647d68e79b';
  roleFuncion  UUID := 'ec04c721-45d6-4e35-bafa-e79e69951c0a';
  roleEgresado UUID := 'fa5067a3-ae1b-4c35-9c10-316201021cab';
  roleParticu  UUID := '275aaa4f-6990-40f4-b42b-f72f937e5cb8';
BEGIN

INSERT INTO "UserTypes" ("uid", "name", "updatedAt") VALUES
  ('77d188f7-b42e-4401-b6a2-bc8630e4700e', 'admin',     NOW()),
  ('0d85160a-c5fc-43af-a6d1-566ff6b5a6ec', 'professor', NOW()),
  ('afa0a8dc-9c60-4ec1-b20f-4276bcc4b91d', 'student',   NOW());

INSERT INTO "Roles" ("uid", "name", "slug", "updatedAt") VALUES
  (rolePregrad,  'Estudiante Pregrado', 'pregrado',    NOW()),
  (rolePosgrado, 'Estudiante Posgrado', 'posgrado',    NOW()),
  (roleFuncion,  'Funcionario',         'funcionario', NOW()),
  (roleEgresado, 'Egresado',            'egresado',    NOW()),
  (roleParticu,  'Profesor Particular', 'particular',  NOW());

INSERT INTO "Credentials" ("uid", "mail", "password", "isEmailVerified", "updatedAt") VALUES 
  ('40693052-0e35-4d3b-9366-3fe1ecc9ac3d', 'admin@usantoto.edu.co',     '$2a$12$q4NtQXiEuQ/CZbW6.krvLuNOgsaue7ZgUjzYMqYx602ZiymJkZJbS', true, NOW()),
  ('568c79c2-7bb8-4d1a-98d3-8d23205a6814', 'professor@usantoto.edu.co', '$2a$12$YncP2ZJ11hGu.8WnhZ.7aeUDMb/gOZi65BFSNneB4nYfYKLInHDHG', true, NOW());

INSERT INTO "Users" ("uid", "name", "lastName", "username", "description", "gender", "telNumber", "isActive", "userTypeId", "roleId", "roleData", "updatedAt") VALUES
  (
    '40693052-0e35-4d3b-9366-3fe1ecc9ac3d',
    'Admin', 'USTA Gallery', 'admin.usta',
    'Administrador principal de la plataforma USTA Gallery. Gestiona usuarios, grupos y contenido de la galería.',
    'O', '0000000000', true,
    '77d188f7-b42e-4401-b6a2-bc8630e4700e',
    NULL, NULL, NOW()
  ),
  (
    '568c79c2-7bb8-4d1a-98d3-8d23205a6814',
    'Profesor', 'USTA Gallery', 'professor.usta',
    'Docente coordinador del grupo de artes de la Universidad Santo Tomás sede Tunja. Gestiona obras y eventos del grupo.',
    'O', '0000000000', true,
    '0d85160a-c5fc-43af-a6d1-566ff6b5a6ec',
    roleParticu, '{}', NOW()
  );

INSERT INTO "Groups" ("uid", "name", "category", "profesorId", "updatedAt") VALUES 
  ('2c4707a0-541d-4fc1-a4e9-b4f830114332', 'Grupo de artes y fotografía', 'ARTES', '568c79c2-7bb8-4d1a-98d3-8d23205a6814', NOW());

INSERT INTO "Styles" ("uid", "name", "description", "category", "groupId", "updatedAt") VALUES
 
  -- PINTURA
  (gen_random_uuid(), 'Óleo en Lienzo',         'Técnica pictórica que utiliza pigmentos aglutinados en aceite aplicados sobre lienzo tensado, permitiendo veladuras, mezclas ricas y una amplia gama tonal con gran durabilidad.',                                      'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Óleo en Madera',         'Pintura al óleo ejecutada sobre tabla de madera preparada con gesso, soporte tradicional del Renacimiento que otorga firmeza y permite acabados de alta precisión y detalle.',                                          'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Acuarela',               'Técnica que diluye pigmentos en agua sobre papel, aprovechando la transparencia y fluidez del medio para crear efectos luminosos, degradados suaves y texturas espontáneas.',                                           'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Acrílico',               'Pintura de secado rápido a base de polímeros acrílicos, versátil sobre múltiples superficies; admite texturas empastadas similares al óleo o veladuras transparentes como la acuarela.',                               'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Gouache',                'Pintura opaca a base de agua similar a la acuarela pero con mayor cuerpo y cubrimiento; produce colores sólidos y mates sobre papel o cartón, muy usada en ilustración y diseño.',                                     'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Fresco',                 'Técnica mural que aplica pigmentos sobre mortero húmedo, integrándose al soporte al secar; exige rapidez y precisión, y produce obras de extraordinaria permanencia en paredes y techos.',                             'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Muralismo',              'Creación de grandes composiciones pictóricas directamente sobre superficies arquitectónicas mediante óleo, acrílico o fresco, con narrativa cultural o social de carácter público.',                                   'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Encáustica',             'Antigua técnica egipcia y griega que mezcla pigmentos con cera de abeja fundida; se aplica caliente sobre madera o tela y se fija con calor, creando superficies translúcidas y de gran riqueza táctil.',              'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Aerografía',             'Técnica que proyecta pintura atomizada mediante un aerógrafo de aire comprimido; permite degradados suaves, efectos fotorrealistas y grandes formatos con transiciones de color imperceptibles.',                       'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Pastel',                 'Técnica que emplea barras de pigmento puro aglutinado sobre papel de grano, logrando colores intensos, texturas aterciopeladas y transiciones suaves mediante difuminado.',                                            'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Batik',                  'Técnica textil de origen indonesio que aplica cera caliente sobre tela para reservar zonas antes de teñirla; al retirar la cera emergen patrones de gran riqueza cromática y detalle.',                               'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Tempera',                'Pintura de secado rápido que aglutina pigmentos con yema de huevo u otros emulsionantes; produce colores brillantes y precisos, fue el medio dominante en la pintura de tabla medieval y renacentista.',              'ARTES', artesId, NOW()),
 
  -- DIBUJO Y TRAZO
  (gen_random_uuid(), 'Tinta China',            'Técnica de dibujo y pintura que utiliza tinta negra o de color sobre papel o seda, logrando trazos precisos, lavados expresivos y contrastes de valor mediante diluciones variables.',                                 'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Carboncillo',            'Medio de dibujo que emplea varillas de carbón vegetal sobre papel, permitiendo trazos expresivos, difuminados amplios y correcciones fáciles; ideal para estudios de figura y composición.',                           'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Sanguina',               'Técnica de dibujo con lápiz o barrita de óxido de hierro rojizo sobre papel; permite líneas precisas y difuminados cálidos, muy empleada en el Renacimiento para estudios anatómicos.',                               'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Lápiz Grafito',          'Técnica de dibujo con lápices de grafito de distintas durezas sobre papel; permite desde trazos finos y precisos hasta sombreados amplios, siendo el medio de dibujo más universal y accesible.',                     'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Lápices de Colores',     'Técnica que superpone capas de lápices de colores sobre papel para construir tonos, texturas y gradientes; admite técnicas como el bruñido, el esgrafiado y la mezcla óptica de colores.',                            'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Punta de Plata',         'Técnica de dibujo renacentista que traza líneas delicadas con un estilete de plata sobre papel preparado con base de carbonato; produce líneas finas e irreversibles que se oxidan levemente con el tiempo.',          'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Rotulador Artístico',    'Técnica contemporánea que emplea marcadores de punta fina o gruesa con tintas de alcohol o base acuosa; permite trazos precisos, rellenos planos y gradientes sobre papel, cartón o superficies no porosas.',          'ARTES', artesId, NOW()),
 
  -- GRABADO E IMPRESIÓN
  (gen_random_uuid(), 'Grabado',                'Proceso que incide diseños sobre una matriz de metal, madera o piedra para entintar y transferir la imagen al papel mediante presión, permitiendo la reproducción múltiple de la obra.',                                'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Aguafuerte',             'Técnica de grabado calcográfico que muerde el metal con ácido nítrico para crear surcos donde se aloja la tinta; produce líneas de gran expresividad y variedad tonal según el tiempo de mordida.',                   'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Litografía',             'Técnica de impresión planográfica basada en la repulsión entre grasa y agua sobre piedra caliza o plancha metálica; permite reproducir dibujos con gran fidelidad tonal y textura.',                                  'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Serigrafía',             'Proceso de impresión que fuerza tinta a través de una malla tensada con áreas bloqueadas por una emulsión fotosensible; permite tiradas largas con colores planos y vibrantes sobre tela, papel o cartón.',           'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Xilografía',             'Grabado en relieve que talla la imagen en un bloque de madera eliminando las zonas que no se imprimirán; la superficie entintada se presiona sobre papel para obtener estampas de trazo expresivo.',                  'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Linóleo',                'Variante del grabado en relieve que talla sobre plancha de linóleo en lugar de madera; el material más blando facilita cortes curvos y detallados, muy usado en arte educativo y carteles.',                          'ARTES', artesId, NOW()),
 
  -- ESCULTURA
  (gen_random_uuid(), 'Escultura en Arcilla',   'Modelado tridimensional con arcilla natural o cerámica; material maleable que permite construir formas orgánicas y geométricas, fijadas mediante cocción en horno a altas temperaturas.',                              'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Escultura en Piedra',    'Técnica sustractiva que talla y cincela bloques de mármol, granito u otras rocas para revelar formas tridimensionales; requiere precisión técnica y herramientas especializadas.',                                     'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Escultura en Bronce',    'Técnica de fundición que vierte metal líquido en moldes para obtener piezas tridimensionales de gran durabilidad; el proceso de cera perdida permite reproducir detalles finos con alta fidelidad.',                   'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Escultura en Madera',    'Talla directa sobre bloques de madera usando gubias, formones y mazos para revelar la forma tridimensional; cada especie de madera aporta textura, veta y resistencia distintas a la obra final.',                    'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Escultura en Yeso',      'Modelado o vaciado de formas tridimensionales con yeso fraguado; material económico y de fraguado rápido, muy usado para maquetas, estudios preparatorios y obras de acabado liso o texturizado.',                    'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Escultura en Resina',    'Técnica que vierte resina poliéster o epoxi en moldes para obtener piezas translúcidas o pigmentadas de gran resistencia; permite incluir objetos en su interior y lograr efectos de vidrio o cristal.',              'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Instalación Artística',  'Práctica que interviene un espacio tridimensional con objetos, luz, sonido o medios digitales para crear una experiencia inmersiva; la obra existe en relación directa con el entorno y el espectador.',              'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Cerámica Esmaltada',     'Técnica que modela arcilla y la recubre con esmaltes vítreos antes de la cocción; el horno funde el esmalte creando superficies brillantes, coloridas e impermeables de gran valor decorativo y funcional.',          'ARTES', artesId, NOW()),
 
  -- TEXTIL Y MATERIA
  (gen_random_uuid(), 'Tapicería Artística',    'Arte textil que entrelaza hilos de urdimbre y trama a mano en telar para crear composiciones pictóricas o abstractas; admite lana, seda, algodón y fibras mixtas con gran riqueza de textura y color.',              'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Bordado Artístico',      'Técnica que decora tela con hilos de colores usando aguja; mediante puntos como el satén, el nudo francés o el relleno, construye imágenes detalladas con relieve y textura sobre el soporte textil.',               'ARTES', artesId, NOW()),
 
  -- TÉCNICAS MIXTAS Y OTRAS
  (gen_random_uuid(), 'Collage',                'Procedimiento que construye imágenes pegando fragmentos de papel, tela, fotografías u otros materiales sobre una superficie; combina texturas y significados para crear composiciones visuales originales.',            'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Técnica Mixta',          'Enfoque que combina libremente materiales y procedimientos —óleo, acrílico, collage, tinta, objetos— en una misma obra, expandiendo las posibilidades expresivas más allá de un solo medio.',                         'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Mosaico',                'Arte de componer imágenes o patrones ensamblando pequeñas piezas de vidrio, cerámica o piedra (teselas) sobre una superficie con mortero; muy practicado en el arte romano y bizantino.',                             'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Vitral',                 'Arte de ensamblar piezas de vidrio coloreado unidas con plomo para formar composiciones luminosas; la luz que atraviesa el vidrio es parte esencial de la obra, muy presente en arquitectura religiosa.',              'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Arte en Papel',          'Disciplina que transforma el papel en escultura tridimensional mediante doblado, corte y modelado; abarca desde el origami japonés hasta construcciones arquitectónicas de gran complejidad estructural.',             'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Land Art',               'Práctica que interviene paisajes naturales usando tierra, rocas, ramas u otros elementos del entorno como material escultórico; la obra existe en el territorio y se documenta mediante fotografía o video.',           'ARTES', artesId, NOW()),
 
  -- FOTOGRAFÍA Y DIGITAL
  (gen_random_uuid(), 'Fotografía Artística',   'Disciplina que utiliza la cámara y la luz como herramientas creativas, explorando composición, encuadre y edición para construir imágenes con intención estética y narrativa visual.',                                 'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Fotografía Análoga',     'Proceso fotográfico que registra imágenes en película sensible a la luz y las revela mediante baño químico en cuarto oscuro; el grano, el contraste y los virajes dan a cada imagen un carácter único e irrepetible.', 'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Ilustración Digital',    'Creación de imágenes mediante software de dibujo y tableta gráfica; replica técnicas tradicionales como acuarela o óleo en entorno digital, ofreciendo capas, deshacido ilimitado y paleta infinita.',                'ARTES', artesId, NOW()),
  (gen_random_uuid(), 'Arte Generativo',        'Disciplina que emplea algoritmos, código y sistemas computacionales para producir obras visuales; el artista diseña las reglas del proceso y el sistema genera formas, patrones o composiciones autónomamente.',       'ARTES', artesId, NOW());
 
END $$;
