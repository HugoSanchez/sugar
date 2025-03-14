import { useCallback } from 'react';
import * as Icons from 'lucide-react';
import classNames from 'classnames';
import { EditorContent, Editor, BubbleMenu } from "@tiptap/react";

export default function EditorMenu(props: { editor: Editor }) {
	const { editor } = props;

	if (!editor || !editor.isEditable) {
		return null;
	}

	return (
		<div className="relative">
			<div className="z-10 fixed bottom-0 left-0 right-0 bg-gray-50 border-t p-4 px-6 md:px-80 flex items-center justify-between">
				<button
					className="text-black hover:bg-zinc-100 rounded p-2"
					onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
					<p className="text-sm font-mono font-medium text-black">H1</p>
				</button>
				<button
					className="text-black rounded p-2"
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
					<p className="text-sm font-mono font-medium text-black">H2</p>
				</button>
				<button
					className={classNames("text-black hover:bg-zinc-100 rounded p-2", {
						"bg-zinc-100": editor.isActive("link"),
					})}
					onClick={() => console.log('open modal')}>
					<Icons.Link size={16}/>
				</button>
				<button
					className={classNames("text-black hover:bg-zinc-100 rounded p-2", {
						"bg-zinc-100": editor.isActive("bold"),
					})}
					onClick={() => editor.chain().focus().toggleBold().run()}>
					<Icons.Bold size={16}/>
				</button>
				<button
					className={classNames("text-black hover:bg-zinc-100 rounded p-2", {
						"bg-zinc-100": editor.isActive("underline"),
					})}
					onClick={() => editor.chain().focus().toggleUnderline().run()}>
					<Icons.Underline size={16}/>
				</button>
				<button
					className={classNames("text-black hover:bg-zinc-100 rounded p-2", {
						"bg-zinc-100": editor.isActive("italic"),
					})}
					onClick={() => editor.chain().focus().toggleItalic().run()}>
					<Icons.Italic size={16}/>
				</button>
			</div>
		</div>
	);
}
