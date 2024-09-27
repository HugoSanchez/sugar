'use client'

import { useState } from 'react'
import PostButton from '@/components/PostButton'
import { RevervEditor } from '../../components/Editor'
import Header from '@/components/Header'

// Simple page that serves as a wrapper for the editor and the post button
// This is basically the editor rendering plus a custom header with a post button
// The post button is passed the editor content as a prop

export default function Write() {
	const [editorContent, setEditorContent] = useState('');

	const handleEditorChange = (content: string) => {
		setEditorContent(content);
	};

	return (
		<>
			<Header>
				<PostButton editorContent={editorContent}/>
			</Header>
			<div className='flex flex-col py-20 md:py-32 px-8 md:px-80 '>
				<RevervEditor onEditorChange={handleEditorChange}/>
			</div>
		</>
	)
}
