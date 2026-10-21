
export const setTokens = (accessToken, refreshToken) => {
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (accessToken, refreshToken) => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
};
