
export const formatWhatsAppMessage = (data: {
  name?: string;
  plan?: string;
  status?: string;
  id?: string;
  address?: string;
}) => {
  const message = `Olá! Sou ${data.name || 'cliente'} e gostaria de mais informações sobre minha instalação.
ID: ${data.id || 'Não disponível'}
Plano: ${data.plan || 'Não informado'}
Status: ${data.status || 'Em análise'}
Endereço: ${data.address || 'Não informado'}`;

  return encodeURIComponent(message);
};

export const openWhatsApp = (phone: string, message: string) => {
  // Garantir que o número está no formato correto (com código do país)
  // Se não começa com +, adicionar +
  const formattedPhone = phone.startsWith('+') ? phone : phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};
