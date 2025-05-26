import Link from 'next/link';

const Topbar = ({ isScrolled }) => {
  return (
    <div className={`w-full bg-[#0c2540] text-white py-2 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
    <div className="container mx-auto flex justify-between items-center px-4">
      <p className="text-sm">Welcome to GenieZy Online Shopping Store !</p>
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center cursor-pointer">
          <span>English</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex items-center cursor-pointer">
          <span>INR</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <Link href="/track" className="hover:text-gray-300">Track Your Order</Link>
        <Link href="/" className="whitespace-nowrap flex items-center text-sm font-medium hover:text-red-500 mr-8">
          <span className="text-sm font-medium">Become a Seller</span>
        </Link>

      </div>
    </div>
  </div>
  );
};

export default Topbar;
