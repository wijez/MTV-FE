import React, { use } from 'react';
import { useNavigate } from 'react-router-dom';
export default function ProposeButton({ Icon, label, link }) {

    const navigate = useNavigate();
    const handleClick = () => {
        if(link){
            navigate(link);
        }
    }
  return (
    <button className="border-2 w-full h-36 bg-white flex flex-col 
    items-center justify-center rounded-2xl border-dotted md:h-40 lg:h-48 shadow-md"
    onClick={handleClick}>
        {Icon && <Icon className="w-12 h-12 mb-2" />}
      <span className="text-sm md:text-base lg:text-lg" >{label}</span>
    </button>
  );
}