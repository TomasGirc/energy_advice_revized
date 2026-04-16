export function deleteUrlParams(keys: string[]) {
	const urlParams = new URLSearchParams(window.location.search);
	keys.forEach((key) => urlParams.delete(key));
	window.history.replaceState(
		{},
		"",
		`${window.location.pathname}?${urlParams.toString()}`
	);
}
export function setUrlParams(params: Record<string, string | undefined>) {
	const urlParams = new URLSearchParams(window.location.search);
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined) {
			urlParams.set(key, value);
		}
	});
	window.history.replaceState(
		{},
		"",
		`${window.location.pathname}?${urlParams.toString()}`
	);
}

export const paramsURL = new URLSearchParams(window.location.search);