// src/components/js/crmLeads.js
// Fungsi untuk mengirim data ke CRM Leads API jika subject "Partnership / Collaboration"

// name diganti 'Partnership / Collaboration', message dikirim sebagai description
export async function sendToCrmLeads({ client, message }) {
  const API_URL = 'https://devel-api-erp.thinkshub.cloud/api/v1/crm/public/leads';
  const API_KEY = '7ntGUz21Kh0zLOOXJxgdAXUWlECKYlbMzbUnXtwcLzCRjXheV2voXdE0gjHlsMXfqh7OcddVj9dnzSKV03NmjjFxevMTsTCs';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        name: 'Partnership / Collaboration',
        client,
        description: message || ''
      }),
    });
    if (!response.ok) {
      await response.text();
      throw new Error('Failed to send to CRM leads');
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}
