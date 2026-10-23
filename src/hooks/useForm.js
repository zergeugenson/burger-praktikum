import { useState } from "react";
import { useCallback } from 'react';

export function useForm(initialValues) {
	const [values, setValues] = useState(initialValues);

	const handleChange = useCallback((event)=> {
		const { name, type, value, checked } = e.target;
		setValues((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	}, []);

	return { values, handleChange, setValues };
}
