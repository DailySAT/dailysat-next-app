import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeaderProps {
  name: string;
  question: string | undefined
}

const Header: React.FC<HeaderProps> = ({ name, question }) => {

  const router = useRouter()

  const linkedInShare = `https://www.linkedin.com/feed/?shareActive=true&text=${question} https://dailysat.org %23DailySAT`
  const googleClassroomShare = `https://classroom.google.com/u/0/share?url=https://mywebsite.com&title=${question}&text=${question}resource%20on%20interserver%20communications!`
 
  const shareRedirect = (link: string) => {
    router.push(link)
  }

  return (
    <div className="text-center mb-16">
      <h1 className="text-3xl font-semibold">{name}</h1>
      <div className="mt-2 flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <Image
            src="https://cdn.kastatic.org/images/google_classroom_color.png"
            alt="Google Classroom"
            width={16}
            height={16}
          />
          <p className="cursor-pointer text-blue-600 hover:underline" onClick={() => shareRedirect(googleClassroomShare)}>
            Google Classroom
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Image
            src="https://yt3.ggpht.com/ytc/AKedOLQUW9FJ6oz2WOkfU_2SbFanfDvOXrYVfE4SuaDyrz0=s900-c-k-c0x00ffffff-no-rj"
            alt="LinkedIn"
            width={25}
            height={25}
          />
          <p className="cursor-pointer text-blue-600 hover:underline" onClick={() => shareRedirect(linkedInShare)}>LinkedIn</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
