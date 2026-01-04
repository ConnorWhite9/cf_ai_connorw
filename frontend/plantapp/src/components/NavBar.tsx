import React, {useState, useEffect} from "react";
import { BonsaiLogo } from "./BonsaiLogo";
import { Link } from "react-router-dom";


const NavBar: React.FC = () => {

    return (<>
        <div className="bg-gray-800/50 border-t border-green-900/30 backdrop-blur-sm sticky ">
            <div className="w-full flex justify-center py-4">
                <Link to="/" className="w-30 h-24 rounded-full bg-emerald-900 flex items-center justify-center">
                    <BonsaiLogo className="w-16 h-16" />
                </Link>
            </div>
        </div>
        
    </>);
}


export default NavBar;