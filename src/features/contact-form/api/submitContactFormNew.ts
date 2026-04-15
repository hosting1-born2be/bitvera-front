import type { ContactFormNewSchema } from '../model/ContactForm.schema';

export const submitContactFormNew = async (data: ContactFormNewSchema) => {
  const formData = new FormData();
  
  formData.append('fullName', data.fullName);
  formData.append('email', data.email);
  if (data.phone) {
    formData.append('phone', data.phone);
  }
  formData.append('message', data.message || '');
  formData.append('recaptcha', data.recaptcha || 'disabled');
  
  const res = await fetch(`/api/contact-new`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Submission failed');
  }
};
