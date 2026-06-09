// Monthly loan counts for the last 12 months (for BarChart)
export const loansByMonth = [
  { mes: 'Jul 2024', prestamos: 45, devoluciones: 42 },
  { mes: 'Ago 2024', prestamos: 62, devoluciones: 58 },
  { mes: 'Sep 2024', prestamos: 78, devoluciones: 71 },
  { mes: 'Oct 2024', prestamos: 85, devoluciones: 80 },
  { mes: 'Nov 2024', prestamos: 92, devoluciones: 88 },
  { mes: 'Dic 2024', prestamos: 35, devoluciones: 40 },
  { mes: 'Ene 2025', prestamos: 28, devoluciones: 30 },
  { mes: 'Feb 2025', prestamos: 40, devoluciones: 38 },
  { mes: 'Mar 2025', prestamos: 95, devoluciones: 85 },
  { mes: 'Abr 2025', prestamos: 110, devoluciones: 100 },
  { mes: 'May 2025', prestamos: 98, devoluciones: 92 },
  { mes: 'Jun 2025', prestamos: 72, devoluciones: 65 },
]

// Category distribution (for PieChart)
export const loansByCategory = [
  { categoria: 'Literatura', cantidad: 245, fill: '#2D6A4F' },
  { categoria: 'Ingeniería', cantidad: 198, fill: '#1B4332' },
  { categoria: 'Ciencias', cantidad: 156, fill: '#40916C' },
  { categoria: 'Historia', cantidad: 120, fill: '#D4A373' },
  { categoria: 'Derecho', cantidad: 95, fill: '#E9C46A' },
  { categoria: 'Economía', cantidad: 88, fill: '#457B9D' },
  { categoria: 'Filosofía', cantidad: 65, fill: '#E76F51' },
  { categoria: 'Medicina', cantidad: 52, fill: '#BC8A5F' },
  { categoria: 'Arte', cantidad: 38, fill: '#6C6C80' },
  { categoria: 'Educación', cantidad: 30, fill: '#9C9CAF' },
]

// Daily activity for current week (for LineChart)
export const dailyActivity = [
  { dia: 'Lun', prestamos: 18, devoluciones: 15, consultas: 45 },
  { dia: 'Mar', prestamos: 22, devoluciones: 20, consultas: 52 },
  { dia: 'Mié', prestamos: 15, devoluciones: 18, consultas: 38 },
  { dia: 'Jue', prestamos: 25, devoluciones: 22, consultas: 60 },
  { dia: 'Vie', prestamos: 30, devoluciones: 28, consultas: 70 },
  { dia: 'Sáb', prestamos: 8, devoluciones: 10, consultas: 20 },
]

// Top 5 most requested books (for horizontal BarChart)
export const topBooks = [
  { titulo: 'Cien años de soledad', prestamos: 45 },
  { titulo: 'Introduction to Algorithms', prestamos: 38 },
  { titulo: 'Ficciones', prestamos: 32 },
  { titulo: 'La casa de los espíritus', prestamos: 28 },
  { titulo: 'Calculus: Early Transcendentals', prestamos: 25 },
]

// Delinquency patterns
export const delinquencyByMonth = [
  { mes: 'Ene', vencidos: 3, multasGeneradas: 2 },
  { mes: 'Feb', vencidos: 5, multasGeneradas: 4 },
  { mes: 'Mar', vencidos: 8, multasGeneradas: 6 },
  { mes: 'Abr', vencidos: 12, multasGeneradas: 10 },
  { mes: 'May', vencidos: 7, multasGeneradas: 5 },
  { mes: 'Jun', vencidos: 5, multasGeneradas: 4 },
]

// KPIs for dashboard
export const dashboardKPIs = {
  prestamosActivos: 15,
  librosDisponibles: 142,
  usuariosMorosos: 5,
  multasPendientes: 4500,
  totalLibros: 180,
  totalUsuarios: 18,
  totalPrestamosDelMes: 72,
  tasaDevolucion: 91.2,
}
