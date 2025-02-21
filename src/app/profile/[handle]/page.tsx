'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface Section {
  title: string;
  content: React.ReactNode;
}

export default function ProfilePage() {
	const { handle } = useParams();

	const sections: Section[] = [
		{
			title: 'About me',
			content: (
				<p className="text-gray-700 text-sm leading-relaxed">
          I build products & companies in financial services, data infrastructure, crypto,
          and various mixes of the three. Currently, I lead growth at Goldsky.
          More about me <a href="#" className="underline">here</a>.
				</p>
			)
		},
		{
			title: 'Writings',
			content: (
				<div className="space-y-3">
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900 hover:underline">
            ↗ On building a blockchain
					</a>
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900">
            ↗ On crypto startup ideas for 2024
					</a>
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900">
            ↗ On crypto startup ideas for 2023
					</a>
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900">
            ↗ On the future of pensions in Canada
					</a>
					<a href="#" className="text-sm block text-gray-700 font-light hover:text-gray-900">
            ↗ On Uber&apos;s surge pricing
					</a>
					<a href="#" className="text-xs block text-gray-500 hover:text-gray-700">
            View all
					</a>
				</div>
			)
		},
		{
			title: 'Reading',
			content: (
				<div className="space-y-3">
					<div className="flex items-center space-x-2">
						<a href="#" className="text-gray-700 hover:text-gray-900">
              The Power Broker ↗
						</a>
						<span className="text-gray-500">by Robert A. Caro</span>
						<span className="text-xs bg-gray-100 px-2 py-0.5 rounded">READING</span>
					</div>
					<div className="flex items-center space-x-2">
						<a href="#" className="text-gray-700 hover:text-gray-900">
              A Gentleman in Moscow ↗
						</a>
						<span className="text-gray-500">by Amor Towles</span>
						<span className="text-xs bg-gray-100 px-2 py-0.5 rounded">READING</span>
					</div>
					<div className="flex items-center space-x-2">
						<a href="#" className="text-gray-700 hover:text-gray-900">
              The Housemaid ↗
						</a>
						<span className="text-gray-500">by Freida McFadden</span>
						<span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-500">DONE</span>
					</div>
				</div>
			)
		}
	];

	return (
		<div className="w-full px-4 md:px-72 py-24">
			<div className="mb-6 flex flex-row">
				<div className='flex flex-col w-1/4'>
					<h1 className="text-lg font-medium leading-tight">Woj.eth</h1>
					<h3 className="text-sm font-light text-gray-700">@{decodeURIComponent(handle as string)}</h3>
					<p className="text-sm text-gray-400">0x2844..938h</p>

				</div>
				<div className='flex w-3/4 justify-end items-center'>
					<Button text="Subscribe" />
				</div>
			</div>
			<div className="space-y-16">
				{sections.map((section) => (
					<section key={section.title} className="grid grid-cols-4 gap-8 border-t border-gray-300 pt-8">
						<p className="text-gray-800 text-sm font-medium">{section.title}</p>
						<div className="col-span-3">
							{section.content}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}

