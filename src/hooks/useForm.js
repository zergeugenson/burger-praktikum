import { useState } from "react";

export function useForm(initialValues) {
	const [values, setValues] = useState(initialValues);

	function handleChange(e) {
		const { name, type, value, checked } = e.target;
		setValues((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	}

	return { values, handleChange, setValues };
}
