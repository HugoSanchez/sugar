interface ButtonProps {
	onClick?: () => void;
	text: string;
	className?: string;
  }

export function Button({ text, onClick, className = '' }: ButtonProps) {
	return (
	  <button
			onClick={onClick}
			className={`bg-gray-200 px-4 py-2 rounded-full text-sm text-gray-700 hover:opacity-100 opacity-90 ${className}`}
	  >
			{text}
	  </button>
	);
}
