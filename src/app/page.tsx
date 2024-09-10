import Particles from "@/components/magicui/particles";
import BlurFade from "@/components/magicui/blur-fade";

export default function Home() {
	return (
		<div className="flex flex-col bg-gray-50 py-20 md:py-52 px-8 md:px-80 ">
			<BlurFade delay={0.1} inView>
				<h1 className="text-5xl md:text-7xl font-medium font-serif text-black">
					Read, Write, <br/>Mint - <span className="italic">Literally</span><span className="text-emerald-500">.</span>
				</h1>
				<h2 className="text-2xl md:text-3xl text-gray-700 font-light mt-8 md:mt-12 !leading-normal">
					Introducing sugar.xyz, a minimal onchain publishing platform.
				</h2>
			</BlurFade>
			<BlurFade delay={0.4} inView>
			<p className="text-lg md:text-xl text-black font-light mt-8 md:mt-12 !leading-loose">
				It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
				<br/><br/>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
			</p>
			</BlurFade>
			<div className="flex flex-row gap-4 mt-8 md:mt-12">
				<button className="text-black font-light text-lg hover:opacity-60 border border-black mr-4 py-2 px-4">
					Read.
				</button>
				<button className="text-black font-light text-lg hover:opacity-60  border border-black mr-4 py-2 px-4">
					Write.
				</button>
				<button className="text-emerald-500 text-lg hover:opacity-60  border border-emerald-500 mr-4 py-2 px-4">
					Mint.
				</button>
			</div>
			<Particles
				className="absolute inset-0"
				quantity={100}
				ease={80}
				color="#000"
				refresh
			/>
		</div>
	);
}
