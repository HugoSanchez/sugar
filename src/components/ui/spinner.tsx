export function Spinner() {
	return (
		<div className="flex items-center justify-center w-full h-[calc(100vh-64px)]">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-200"></div>
		</div>
	);
}
