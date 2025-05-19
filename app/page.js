import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#fcfcf9] text-[#13343b]">
      {/* <img
        src="https://videos.openai.com/vg-assets/assets%2Ftask_01jvketddgf2kr8qtc8jv37cgf%2F1747631087_img_0.webp?st=2025-05-19T03%3A24%3A26Z&se=2025-05-25T04%3A24%3A26Z&sks=b&skt=2025-05-19T03%3A24%3A26Z&ske=2025-05-25T04%3A24%3A26Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=jarESJPnU685jdFSk0eAFjYP%2BxwssHU18eBja1MLxdU%3D&az=oaivgprodscus" // Replace with your logo path or remove if not needed
        alt="GenieZy logo"
        width={120}
        height={120}
        className="mb-6"
      /> */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">GenieZy</h1>
      <p className="text-xl sm:text-2xl text-center mb-8">
        Fast Delivery eCommerce Experience
      </p>
      <p className="text-base sm:text-lg text-center text-[#13343b]/80">
        We're launching soon. Stay tuned!
      </p>
    </div>
  );
}
