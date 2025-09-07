// utils/form.utils.ts
export const resetForm = <T extends Record<string, unknown>>( // Fix any type
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  initialState: T
): void => {
  setFormData(initialState);
};

export const updateFormField = <T extends Record<string, unknown>>( // Fix any type
  setFormData: React.Dispatch<React.SetStateAction<T>>
) => (field: keyof T) => (value: unknown) => { // Fix any type
  setFormData(prev => ({ ...prev, [field]: value }));
};

export const handleInputChange = <T extends Record<string, unknown>>( // Fix any type
  setFormData: React.Dispatch<React.SetStateAction<T>>
) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};