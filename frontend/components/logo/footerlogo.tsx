"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/PNGPOINT-White-logo.png";
import { useDispatch } from "react-redux";
import { setCategory, setTitle, setKeyword, setPage } from "@/redux/features/getImages/getImageSlice";

export const FooterLogo: React.FC = () => {
    const dispatch = useDispatch();
    const handleLogo = () => {
        dispatch(setTitle(''));
        dispatch(setCategory(''))
        dispatch(setKeyword(''));
        dispatch(setPage(1));
    }

    return (
        <Link className="block w-fit" href={"/"}>
            <Image
                className="w-40 lg:w-44 xl:w-52 h-auto"
                src={Logo}
                alt="pngpoint"
                loading="lazy"
                decoding="async"
                onClick={() => handleLogo()}
            />
        </Link>
    );
}
