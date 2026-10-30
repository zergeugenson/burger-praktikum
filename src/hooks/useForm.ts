import { useCallback, useState, type ChangeEvent } from 'react';

export function useForm<T extends Record<string, string | boolean>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  return { values, handleChange, setValues };
}
