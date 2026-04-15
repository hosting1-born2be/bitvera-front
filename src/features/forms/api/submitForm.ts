import type {
  CustomSolutionRequestFormSchema,
  RequestFormSchema,
} from '../model/schemas';

const buildFullName = (firstName: string, lastName: string) => `${firstName} ${lastName}`.trim();

export async function submitForm(
  formType: 'request',
  data: RequestFormSchema & { name?: string }
): Promise<void> {
  const { name: serviceName, firstName, lastName, ...formData } = data;
  const body: Record<string, unknown> = {
    formType,
    data: {
      ...formData,
      service: serviceName ?? formData.service ?? '',
      fullName: buildFullName(firstName, lastName),
      companyName: '',
    },
  };

  const res = await fetch('/api/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(json?.message ?? 'Submission failed');
  }
}

export async function submitRequestForm(data: RequestFormSchema, name: string): Promise<void> {
  return submitForm('request', { ...data, name });
}

export async function submitCustomSolutionRequestForm(
  data: CustomSolutionRequestFormSchema,
  attachment?: File | null
): Promise<void> {
  const formData = new FormData();

  formData.append('formType', 'custom-solution');
  formData.append('fullName', data.fullName);
  formData.append('email', data.email);
  formData.append('phone', data.phone ?? '');
  formData.append('website', data.website ?? '');
  formData.append('projectTypeOther', data.projectTypeOther ?? '');
  formData.append('budget', data.budget ?? '');
  formData.append('goals', data.goals ?? '');
  formData.append('timeline', data.timeline ?? '');
  formData.append('recaptcha', data.recaptcha ?? '');

  data.projectTypes.forEach((projectType) => {
    formData.append('projectTypes', projectType);
  });

  data.communicationPreferences.forEach((preference) => {
    formData.append('communicationPreferences', preference);
  });

  if (attachment) {
    formData.append('attachments', attachment, attachment.name);
  }

  const res = await fetch('/api/forms', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(json?.message ?? 'Submission failed');
  }
}
