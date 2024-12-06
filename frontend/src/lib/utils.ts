import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hsl(variable: string) {
  return `hsl(var(--${variable}))`
}

export function formatPhone(phone: string | null | undefined) {
  if (!phone) return ""
  
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, "")
  
  // Aplica a máscara (xx) xxxxx-xxxx
  return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "Sem data"
  
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
