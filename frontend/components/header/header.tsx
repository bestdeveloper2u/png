"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/PNGPOINT-White-logo.png";
import { useDispatch } from "react-redux";
import { setCategory, setKeyword, setTitle, setPage } from "@/redux/features/getImages/getImageSlice";

export const Header = () => {
    const dispatch = useDispatch();
    const handleLogo = () => {
        dispatch(setTitle(''));
        dispatch(setCategory(''))
        dispatch(setKeyword(''));
        setPage(1);
    }
    return (
        <header className="relative top-0 left-0 right-0 pt-2.5 md:pt-5 pb-1.5 w-full bg-[#0077a2] text-white">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap justify-center items-center w-full">
                    <Link className="block w-fit" href={"/"}>
                        <Image
                            className="w-40 md:w-56 h-auto"
                            src={Logo}
                            alt="pngpoint"
                            loading="eager"
                            priority
                            decoding="async"
                            onClick={() => handleLogo()}
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}
