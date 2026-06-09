export const CATEGORIAS = [
  'Literatura',
  'Ciencias',
  'Ingeniería',
  'Historia',
  'Derecho',
  'Medicina',
  'Economía',
  'Filosofía',
  'Arte',
  'Educación',
];

function coverUrl(isbn) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
}

export const books = [
  // ── Literatura ─────────────────────────────────────────────────
  {
    id: 1,
    isbn: '9780060883287',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    editorial: 'Harper Perennial',
    anio: 1967,
    categoria: 'Literatura',
    sinopsis:
      'La saga de la familia Buendía en el pueblo ficticio de Macondo, abarcando siete generaciones de pasiones, guerras y milagros. Una obra cumbre del realismo mágico latinoamericano que retrata la historia de un continente.',
    portadaUrl: coverUrl('9780060883287'),
    ubicacion: 'Estante A-1',
    ejemplares: [
      { id: 1, codigoBarras: 'UNI-1001', estado: 'Disponible' },
      { id: 2, codigoBarras: 'UNI-1002', estado: 'Prestado' },
      { id: 3, codigoBarras: 'UNI-1003', estado: 'Disponible' },
    ],
  },
  {
    id: 2,
    isbn: '9780802130303',
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    editorial: 'Grove Press',
    anio: 1944,
    categoria: 'Literatura',
    sinopsis:
      'Colección de cuentos que exploran laberintos, espejos, bibliotecas infinitas y las fronteras entre la realidad y la ficción. Borges construye universos filosóficos en cada relato breve.',
    portadaUrl: coverUrl('9780802130303'),
    ubicacion: 'Estante A-2',
    ejemplares: [
      { id: 4, codigoBarras: 'UNI-1004', estado: 'Disponible' },
      { id: 5, codigoBarras: 'UNI-1005', estado: 'Prestado' },
    ],
  },
  {
    id: 3,
    isbn: '9780553383805',
    titulo: 'La casa de los espíritus',
    autor: 'Isabel Allende',
    editorial: 'Bantam Books',
    anio: 1982,
    categoria: 'Literatura',
    sinopsis:
      'La historia de la familia Trueba a lo largo de cuatro generaciones en un país latinoamericano. Una novela que mezcla realismo mágico con la turbulenta historia política de Chile.',
    portadaUrl: coverUrl('9780553383805'),
    ubicacion: 'Estante A-3',
    ejemplares: [
      { id: 6, codigoBarras: 'UNI-1006', estado: 'Disponible' },
      { id: 7, codigoBarras: 'UNI-1007', estado: 'Disponible' },
      { id: 8, codigoBarras: 'UNI-1008', estado: 'Reservado' },
      { id: 9, codigoBarras: 'UNI-1009', estado: 'Prestado' },
    ],
  },
  {
    id: 4,
    isbn: '9780802133908',
    titulo: 'Pedro Páramo',
    autor: 'Juan Rulfo',
    editorial: 'Grove Press',
    anio: 1955,
    categoria: 'Literatura',
    sinopsis:
      'Juan Preciado viaja a Comala en busca de su padre, Pedro Páramo, y se encuentra con un pueblo habitado por murmullos y fantasmas. Novela fundacional del realismo mágico mexicano.',
    portadaUrl: coverUrl('9780802133908'),
    ubicacion: 'Estante A-4',
    ejemplares: [
      { id: 10, codigoBarras: 'UNI-1010', estado: 'Prestado' },
      { id: 11, codigoBarras: 'UNI-1011', estado: 'Prestado' },
    ],
  },
  {
    id: 5,
    isbn: '9780679720201',
    titulo: 'El extranjero',
    autor: 'Albert Camus',
    editorial: 'Vintage International',
    anio: 1942,
    categoria: 'Literatura',
    sinopsis:
      'Meursault, un empleado francés en Argelia, narra con indiferencia los eventos que lo llevan a cometer un crimen absurdo. Obra emblemática del existencialismo y el absurdismo literario.',
    portadaUrl: coverUrl('9780679720201'),
    ubicacion: 'Estante A-5',
    ejemplares: [
      { id: 12, codigoBarras: 'UNI-1012', estado: 'Disponible' },
      { id: 13, codigoBarras: 'UNI-1013', estado: 'Disponible' },
    ],
  },
  {
    id: 6,
    isbn: '9780811215473',
    titulo: 'Nocturno de Chile',
    autor: 'Roberto Bolaño',
    editorial: 'New Directions',
    anio: 2000,
    categoria: 'Literatura',
    sinopsis:
      'En su lecho de muerte, el sacerdote y crítico literario Sebastián Urrutia Lacroix revisa su vida y su complicidad con la dictadura chilena en un monólogo febril e hipnótico.',
    portadaUrl: coverUrl('9780811215473'),
    ubicacion: 'Estante A-6',
    ejemplares: [
      { id: 14, codigoBarras: 'UNI-1014', estado: 'Disponible' },
    ],
  },

  // ── Ingeniería y textos académicos ──────────────────────────────
  {
    id: 7,
    isbn: '9780262033848',
    titulo: 'Introduction to Algorithms',
    autor: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
    editorial: 'MIT Press',
    anio: 2009,
    categoria: 'Ingeniería',
    sinopsis:
      'Texto de referencia en ciencias de la computación que cubre estructuras de datos, algoritmos de ordenamiento, grafos y complejidad computacional. Utilizado en universidades de todo el mundo.',
    portadaUrl: coverUrl('9780262033848'),
    ubicacion: 'Estante C-1',
    ejemplares: [
      { id: 15, codigoBarras: 'UNI-2001', estado: 'Disponible' },
      { id: 16, codigoBarras: 'UNI-2002', estado: 'Prestado' },
      { id: 17, codigoBarras: 'UNI-2003', estado: 'Disponible' },
      { id: 18, codigoBarras: 'UNI-2004', estado: 'Reservado' },
    ],
  },
  {
    id: 8,
    isbn: '9780073523323',
    titulo: 'Database System Concepts',
    autor: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    editorial: 'McGraw-Hill',
    anio: 2014,
    categoria: 'Ingeniería',
    sinopsis:
      'Manual completo sobre diseño, implementación y administración de bases de datos relacionales y NoSQL. Incluye modelo entidad-relación, SQL avanzado y procesamiento de transacciones.',
    portadaUrl: coverUrl('9780073523323'),
    ubicacion: 'Estante C-2',
    ejemplares: [
      { id: 19, codigoBarras: 'UNI-2005', estado: 'Prestado' },
      { id: 20, codigoBarras: 'UNI-2006', estado: 'Prestado' },
      { id: 21, codigoBarras: 'UNI-2007', estado: 'Prestado' },
    ],
  },
  {
    id: 9,
    isbn: '9780538497909',
    titulo: 'Calculus: Early Transcendentals',
    autor: 'James Stewart',
    editorial: 'Cengage Learning',
    anio: 2011,
    categoria: 'Ciencias',
    sinopsis:
      'Texto fundamental de cálculo diferencial e integral para carreras de ingeniería y ciencias. Cubre límites, derivadas, integrales, series y ecuaciones diferenciales con abundantes ejercicios.',
    portadaUrl: coverUrl('9780538497909'),
    ubicacion: 'Estante C-3',
    ejemplares: [
      { id: 22, codigoBarras: 'UNI-2008', estado: 'Disponible' },
      { id: 23, codigoBarras: 'UNI-2009', estado: 'Prestado' },
      { id: 24, codigoBarras: 'UNI-2010', estado: 'Disponible' },
    ],
  },
  {
    id: 10,
    isbn: '9780321973610',
    titulo: 'University Physics with Modern Physics',
    autor: 'Hugh D. Young, Roger A. Freedman',
    editorial: 'Pearson',
    anio: 2015,
    categoria: 'Ciencias',
    sinopsis:
      'Texto clásico de física que abarca mecánica, termodinámica, electromagnetismo, óptica y física moderna. Incluye problemas resueltos y aplicaciones prácticas para estudiantes de ingeniería.',
    portadaUrl: coverUrl('9780321973610'),
    ubicacion: 'Estante C-4',
    ejemplares: [
      { id: 25, codigoBarras: 'UNI-2011', estado: 'Disponible' },
      { id: 26, codigoBarras: 'UNI-2012', estado: 'Disponible' },
    ],
  },
  {
    id: 11,
    isbn: '9780133943030',
    titulo: 'Software Engineering',
    autor: 'Ian Sommerville',
    editorial: 'Pearson',
    anio: 2015,
    categoria: 'Ingeniería',
    sinopsis:
      'Guía completa sobre metodologías de desarrollo de software, desde el modelo en cascada hasta metodologías ágiles. Cubre requisitos, diseño, pruebas, gestión de proyectos y calidad de software.',
    portadaUrl: coverUrl('9780133943030'),
    ubicacion: 'Estante C-5',
    ejemplares: [
      { id: 27, codigoBarras: 'UNI-2013', estado: 'Disponible' },
      { id: 28, codigoBarras: 'UNI-2014', estado: 'Reservado' },
    ],
  },
  {
    id: 12,
    isbn: '9780132126953',
    titulo: 'Computer Networks',
    autor: 'Andrew S. Tanenbaum, David J. Wetherall',
    editorial: 'Pearson',
    anio: 2012,
    categoria: 'Ingeniería',
    sinopsis:
      'Referencia esencial sobre arquitectura de redes, protocolos TCP/IP, seguridad en redes y comunicaciones inalámbricas. Texto ampliamente usado en programas de ingeniería informática.',
    portadaUrl: coverUrl('9780132126953'),
    ubicacion: 'Estante C-6',
    ejemplares: [
      { id: 29, codigoBarras: 'UNI-2015', estado: 'Disponible' },
      { id: 30, codigoBarras: 'UNI-2016', estado: 'Dado de baja' },
    ],
  },
  {
    id: 13,
    isbn: '9780073383095',
    titulo: 'Discrete Mathematics and Its Applications',
    autor: 'Kenneth H. Rosen',
    editorial: 'McGraw-Hill',
    anio: 2012,
    categoria: 'Ingeniería',
    sinopsis:
      'Texto introductorio de matemáticas discretas que cubre lógica, conjuntos, relaciones, grafos, árboles y combinatoria. Fundamental para ciencias de la computación.',
    portadaUrl: coverUrl('9780073383095'),
    ubicacion: 'Estante C-7',
    ejemplares: [
      { id: 31, codigoBarras: 'UNI-2017', estado: 'Disponible' },
      { id: 32, codigoBarras: 'UNI-2018', estado: 'Disponible' },
    ],
  },

  // ── Historia ────────────────────────────────────────────────────
  {
    id: 14,
    isbn: '9780393317558',
    titulo: 'Guns, Germs, and Steel',
    autor: 'Jared Diamond',
    editorial: 'W.W. Norton',
    anio: 1997,
    categoria: 'Historia',
    sinopsis:
      'Análisis multidisciplinario de por qué ciertas civilizaciones dominaron a otras. Diamond examina factores geográficos, biológicos y ambientales que moldearon el destino de los pueblos.',
    portadaUrl: coverUrl('9780393317558'),
    ubicacion: 'Estante D-1',
    ejemplares: [
      { id: 33, codigoBarras: 'UNI-3001', estado: 'Disponible' },
      { id: 34, codigoBarras: 'UNI-3002', estado: 'Disponible' },
    ],
  },
  {
    id: 15,
    isbn: '9780393972207',
    titulo: 'Western Civilizations',
    autor: 'Judith G. Coffin, Robert C. Stacey',
    editorial: 'W.W. Norton',
    anio: 2005,
    categoria: 'Historia',
    sinopsis:
      'Recorrido exhaustivo por la historia de la civilización occidental desde la Antigüedad hasta el mundo contemporáneo. Texto académico de referencia para estudios históricos universitarios.',
    portadaUrl: coverUrl('9780393972207'),
    ubicacion: 'Estante D-2',
    ejemplares: [
      { id: 35, codigoBarras: 'UNI-3003', estado: 'Disponible' },
      { id: 36, codigoBarras: 'UNI-3004', estado: 'Prestado' },
      { id: 37, codigoBarras: 'UNI-3005', estado: 'Disponible' },
    ],
  },
  {
    id: 16,
    isbn: '9780226458083',
    titulo: 'The Structure of Scientific Revolutions',
    autor: 'Thomas S. Kuhn',
    editorial: 'University of Chicago Press',
    anio: 1962,
    categoria: 'Historia',
    sinopsis:
      'Obra fundamental que introdujo el concepto de "paradigma" en la filosofía de la ciencia. Kuhn analiza cómo las revoluciones científicas transforman nuestra comprensión del mundo.',
    portadaUrl: coverUrl('9780226458083'),
    ubicacion: 'Estante D-3',
    ejemplares: [
      { id: 38, codigoBarras: 'UNI-3006', estado: 'Disponible' },
    ],
  },
  {
    id: 17,
    isbn: '9780143039433',
    titulo: 'The Grapes of Wrath',
    autor: 'John Steinbeck',
    editorial: 'Penguin Classics',
    anio: 1939,
    categoria: 'Historia',
    sinopsis:
      'La familia Joad abandona Oklahoma durante la Gran Depresión buscando una vida mejor en California. Retrato desgarrador de la desigualdad social y la lucha de los desposeídos en Estados Unidos.',
    portadaUrl: coverUrl('9780143039433'),
    ubicacion: 'Estante D-4',
    ejemplares: [
      { id: 39, codigoBarras: 'UNI-3007', estado: 'Prestado' },
      { id: 40, codigoBarras: 'UNI-3008', estado: 'Prestado' },
    ],
  },

  // ── Filosofía ───────────────────────────────────────────────────
  {
    id: 18,
    isbn: '9780872204645',
    titulo: 'Nicomachean Ethics',
    autor: 'Aristóteles',
    editorial: 'Hackett Publishing',
    anio: 1999,
    categoria: 'Filosofía',
    sinopsis:
      'Tratado fundamental de la filosofía moral occidental que examina la virtud, la felicidad y el bien supremo del ser humano. Edición traducida y comentada para el estudio académico.',
    portadaUrl: coverUrl('9780872204645'),
    ubicacion: 'Estante E-1',
    ejemplares: [
      { id: 41, codigoBarras: 'UNI-4001', estado: 'Disponible' },
      { id: 42, codigoBarras: 'UNI-4002', estado: 'Disponible' },
    ],
  },
  {
    id: 19,
    isbn: '9780140449334',
    titulo: 'Meditations',
    autor: 'Marco Aurelio',
    editorial: 'Penguin Classics',
    anio: 2006,
    categoria: 'Filosofía',
    sinopsis:
      'Reflexiones personales del emperador romano Marco Aurelio sobre el estoicismo, el deber, la muerte y la naturaleza humana. Una de las obras más influyentes de la filosofía antigua.',
    portadaUrl: coverUrl('9780140449334'),
    ubicacion: 'Estante E-2',
    ejemplares: [
      { id: 43, codigoBarras: 'UNI-4003', estado: 'Disponible' },
      { id: 44, codigoBarras: 'UNI-4004', estado: 'Prestado' },
      { id: 45, codigoBarras: 'UNI-4005', estado: 'Disponible' },
    ],
  },
  {
    id: 20,
    isbn: '9780140449235',
    titulo: 'Beyond Good and Evil',
    autor: 'Friedrich Nietzsche',
    editorial: 'Penguin Classics',
    anio: 2003,
    categoria: 'Filosofía',
    sinopsis:
      'Nietzsche cuestiona los fundamentos de la moral occidental y propone una nueva forma de entender la voluntad de poder, la verdad y los valores en la sociedad moderna.',
    portadaUrl: coverUrl('9780140449235'),
    ubicacion: 'Estante E-3',
    ejemplares: [
      { id: 46, codigoBarras: 'UNI-4006', estado: 'Disponible' },
    ],
  },

  // ── Derecho y Economía ──────────────────────────────────────────
  {
    id: 21,
    isbn: '9780199535569',
    titulo: 'Pride and Prejudice',
    autor: 'Jane Austen',
    editorial: 'Oxford World\'s Classics',
    anio: 2008,
    categoria: 'Literatura',
    sinopsis:
      'Elizabeth Bennet y el orgulloso Mr. Darcy superan malentendidos y prejuicios sociales en la Inglaterra de Regencia. Una de las novelas más queridas de la literatura universal.',
    portadaUrl: coverUrl('9780199535569'),
    ubicacion: 'Estante A-7',
    ejemplares: [
      { id: 47, codigoBarras: 'UNI-5001', estado: 'Disponible' },
      { id: 48, codigoBarras: 'UNI-5002', estado: 'Prestado' },
      { id: 49, codigoBarras: 'UNI-5003', estado: 'Disponible' },
    ],
  },
  {
    id: 22,
    isbn: '9780393929584',
    titulo: 'Hamlet',
    autor: 'William Shakespeare',
    editorial: 'W.W. Norton',
    anio: 2010,
    categoria: 'Literatura',
    sinopsis:
      'El príncipe Hamlet busca venganza por el asesinato de su padre mientras enfrenta dilemas morales sobre la acción, la locura y la muerte. La tragedia más célebre de la literatura occidental.',
    portadaUrl: coverUrl('9780393929584'),
    ubicacion: 'Estante A-8',
    ejemplares: [
      { id: 50, codigoBarras: 'UNI-5004', estado: 'Prestado' },
      { id: 51, codigoBarras: 'UNI-5005', estado: 'Prestado' },
      { id: 52, codigoBarras: 'UNI-5006', estado: 'Prestado' },
      { id: 53, codigoBarras: 'UNI-5007', estado: 'Prestado' },
    ],
  },

  // ── Ciencias y Medicina ─────────────────────────────────────────
  {
    id: 23,
    isbn: '9781429234139',
    titulo: 'Molecular Cell Biology',
    autor: 'Harvey Lodish, Arnold Berk, Chris A. Kaiser',
    editorial: 'W.H. Freeman',
    anio: 2012,
    categoria: 'Medicina',
    sinopsis:
      'Texto de referencia en biología molecular que cubre estructura celular, genética, señalización y biotecnología. Esencial para estudiantes de medicina y ciencias biológicas.',
    portadaUrl: coverUrl('9781429234139'),
    ubicacion: 'Estante G-1',
    ejemplares: [
      { id: 54, codigoBarras: 'UNI-6001', estado: 'Disponible' },
      { id: 55, codigoBarras: 'UNI-6002', estado: 'Prestado' },
    ],
  },
  {
    id: 24,
    isbn: '9780321927040',
    titulo: 'Human Anatomy & Physiology',
    autor: 'Elaine N. Marieb, Katja N. Hoehn',
    editorial: 'Pearson',
    anio: 2015,
    categoria: 'Medicina',
    sinopsis:
      'Texto integral de anatomía y fisiología humana con ilustraciones detalladas. Cubre todos los sistemas del cuerpo humano para estudiantes de ciencias de la salud.',
    portadaUrl: coverUrl('9780321927040'),
    ubicacion: 'Estante G-2',
    ejemplares: [
      { id: 56, codigoBarras: 'UNI-6003', estado: 'Disponible' },
      { id: 57, codigoBarras: 'UNI-6004', estado: 'Dado de baja' },
      { id: 58, codigoBarras: 'UNI-6005', estado: 'Disponible' },
    ],
  },

  // ── Biología ────────────────────────────────────────────────────
  {
    id: 25,
    isbn: '9780321696816',
    titulo: 'Campbell Biology: Concepts & Connections',
    autor: 'Jane B. Reece, Martha R. Taylor, Eric J. Simon',
    editorial: 'Pearson',
    anio: 2014,
    categoria: 'Ciencias',
    sinopsis:
      'Introducción completa a la biología que conecta conceptos fundamentales con aplicaciones del mundo real. Cubre evolución, ecología, genética y biología celular.',
    portadaUrl: coverUrl('9780321696816'),
    ubicacion: 'Estante G-3',
    ejemplares: [
      { id: 59, codigoBarras: 'UNI-7001', estado: 'Disponible' },
      { id: 60, codigoBarras: 'UNI-7002', estado: 'Disponible' },
    ],
  },
];
