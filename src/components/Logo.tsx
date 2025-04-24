
import React from "react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link 
      to="/" 
      className="inline-flex items-center gap-2 text-brand-blue font-bold text-2xl transition-all hover:scale-105"
    >
      <img 
        src="https://westtelecom.net/wp-content/uploads/2019/11/logo-westAsset-1.svg" 
        alt="West Telecom" 
        className="h-12" 
      />
    </Link>
  );
}

export default Logo;
