import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#fcfcf9] text-[#13343b]">

      <h1 className="text-4xl sm:text-5xl font-bold mb-4">GenieZy</h1>
      <p className="text-xl sm:text-2xl text-center mb-8">
        Fast Delivery eCommerce Experience
      </p>
      <p className="text-base sm:text-lg text-center text-[#13343b]/80">
        We&apos;re launching soon. Stay tuned!
      </p>
    </div>
  );
}
