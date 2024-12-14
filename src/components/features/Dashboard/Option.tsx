import React from 'react';
import { useRouter } from 'next/navigation';

interface OptionProps {
  svg: React.ReactNode; // Use React.ReactNode for flexibility
  header: string;
  redirect: "/math" | "/reading"
}

const Option: React.FC<OptionProps> = ({ svg, header, redirect }) => {
  const router = useRouter()
  
  const handleRedirect = () => {
      router.push(redirect)
  }
  return (
    <div 
        className="flex border-gray-400 border bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow space-x-4 w-full cursor-pointer"
        onClick={handleRedirect} 
    >
      <div className="icon">{svg}</div>
      <div>
        <h1 className="text-lg text-gray-600 font-semibold">{header}</h1>
      </div>
    </div>
  );
};

export default Option;
