import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hsl(variable: string) {
  return `hsl(var(--${variable}))`
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "Sem telefone"
  
  // Remove tudo que não for número
  const numbers = phone.replace(/\D/g, "")
  
  // Verifica se é celular (9 dígitos) ou fixo (8 dígitos)
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }
  
  return phone
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "Sem data"
  
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
