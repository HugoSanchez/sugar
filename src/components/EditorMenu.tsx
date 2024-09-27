import { useCallback } from 'react';
import * as Icons from 'lucide-react';
import classNames from 'classnames';
import { EditorContent, Editor, BubbleMenu } from "@tiptap/react";


export default function EditorMenu(props: { editor: Editor }) {


	// const router = useRouter();
	// const [modalIsOpen, setIsOpen] = useState(false);
	// const [loading, setLoading] = useState(false);
	// const [url, setUrl] = useState<string>("");

	// const openModal = useCallback(() => {
	// 	setUrl(editor.getAttributes("link").href);
	// 	setIsOpen(true);
	// }, [editor]);



	/**
	const closeModal = useCallback(() => {
		setIsOpen(false);
		setUrl("");
	}, []);

	const saveLink = useCallback(() => {
		console.log(url);
		if (url) {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url, target: "_blank" })
				.run();
		} else {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
		}
		editor.commands.blur();
		console.log(editor.getHTML());
		closeModal();
	}, [editor, url, closeModal]);

	const removeLink = useCallback(() => {
		editor.chain().focus().extendMarkRange("link").unsetLink().run();
		closeModal();
	}, [editor, closeModal]);

	const changeURL = useCallback((e: any) => {
		setUrl(e.target.value);
	}, []);
	*/

	const editor = props.editor;

	const toggleHeading = useCallback(
		(level: 1 | 2 | 3) => {
			editor.chain().focus().toggleHeading({ level }).run();
		},
		[editor]
	);

	const toggleBold = useCallback(() => {
		editor.chain().focus().toggleBold().run();
	}, [editor]);

	const toggleUnderline = useCallback(() => {
		editor.chain().focus().toggleUnderline().run();
	}, [editor]);

	const toggleItalic = useCallback(() => {
		editor.chain().focus().toggleItalic().run();
	}, [editor]);

	const toggleBlockquote = useCallback(() => {
		editor.chain().focus().toggleBlockquote().run();
	}, [editor]);

	const toggleCode = useCallback(() => {
		editor.chain().focus().toggleCode().run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	if (true) {
		return (
			<div className="relative">
				<div className="z-10 fixed bottom-0 left-0 right-0 bg-gray-50 border-t p-4 px-6 md:px-80 flex items-center justify-between">
					<button
						className="text-black hover:bg-zinc-100 rounded p-2"
						onClick={() => toggleHeading(1)}>
						<p className="text-sm font-mono font-medium text-black">H1</p>
					</button>
					<button
						className="text-black rounded p-2"
						onClick={() => toggleHeading(2)}>
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
						onClick={toggleBold}>
						<Icons.Bold size={16}/>
					</button>
					<button
						className={classNames("text-black hover:bg-zinc-100 rounded p-2", {
							"bg-zinc-100": editor.isActive("underline"),
						})}
						onClick={toggleUnderline}>
						<Icons.Underline size={16}/>
					</button>
					<button
						className={classNames("text-black hover:bg-zinc-100 rounded p-2", {
							"bg-zinc-100": editor.isActive("italic"),
						})}
						onClick={toggleItalic}>
						<Icons.Italic size={16}/>
					</button>
				</div>
			</div>
		);
	}

	if (false) {
		return (
			<>
				<div className="">
					<BubbleMenu
						pluginKey="bubbleMenuText"
						className="bg-zinc-800 flex items-center min-w-max gap-2 p-2 rounded-md"
						tippyOptions={{ duration: 150 }}
						editor={props.editor}
						shouldShow={({
							from,
							to,
						}) => {
						// only show if range is selected.
							return from !== to;
						}}>
						<button
							className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc700"
							onClick={() => toggleHeading(1)}>
							<p className="text-white text-sm font-mono">H1</p>
						</button>
						<button
							className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc700"
							onClick={() => toggleHeading(2)}>
							<p className="text-white text-xs font-mono">H2</p>
						</button>
						<button
							className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc700"
							onClick={() => toggleHeading(3)}>
							<p className="text-white text-xs font-mono">H3</p>
						</button>
						<button
							className={classNames(
								"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
								{
									"is-active": editor.isActive("link"),
								}
							)}
							onClick={() => console.log('open modal')}>
							<Icons.Link color="white" size={16}/>
						</button>
						<button
							className={classNames(
								"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
								{
									"is-active": editor.isActive("bold"),
								}
							)}
							onClick={toggleBold}>
							<Icons.Bold color="white" size={16}/>
						</button>
						<button
							className={classNames(
								"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
								{
									"is-active": editor.isActive("underline"),
								}
							)}
							onClick={toggleUnderline}>
							<Icons.Underline color="white" size={16}/>
						</button>
						<button
							className={classNames(
								"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
								{
									"is-active": editor.isActive("intalic"),
								}
							)}
							onClick={toggleItalic}>
							<Icons.Italic color="white" size={16}/>
						</button>
						<button
							className={classNames(
								"pointer-cursor flex justify-center items-center h-10 w-10 pt-4 rounded-md hover:bg-zinc700",
								{
									"is-active": editor.isActive("blockquote"),
								}
							)}
							onClick={toggleBlockquote}>
							<p className="text-white text-3xl font-extralight">
                            &apos;&apos;
							</p>
						</button>
						<button
							className={classNames(
								"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
								{
									"is-active": editor.isActive("code"),
								}
							)}
							onClick={toggleCode}>
							<Icons.Code color="white" size={16}/>
						</button>
					</BubbleMenu>

					<div className="mt-24 md:mt-0">
						<EditorContent editor={editor} />
					</div>
				</div>
			</>
		);
	}
}
