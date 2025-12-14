import Link from "next/link";
import { ReactIcons } from "@/utils/reactIcons";
import { FooterLogo } from "../logo/footerlogo";
import { getTodayName, getCurrentYear } from "@/utils/dateHelper";

export default function Footer() {
    const todayName = getTodayName();
    const currentYear = getCurrentYear();
    const { FaXTwitter, FaFacebook, FaPinterest, FaInstagram } = ReactIcons;
    return (
        <footer className="relative top-0 left-0 right-0 py-10 lg:pt-16 pb-10 w-full text-white bg-[#0077a2]">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
                    <div className="flex flex-col flex-wrap gap-y-4 md:gap-y-2 w-full">
                        <FooterLogo />
                        <p className="text-xs xl:text-sm font-medium uppercase">free download transparent<br />png files no copyright</p>
                        <div className="flex flex-row flex-wrap items-center gap-x-3.5 md:gap-x-8 mt-2.5">
                            <Link href={"https://x.com/pngpoint"} target="_blank">
                                <FaXTwitter className="text-xl xl:text-[22px]" />
                            </Link>
                            <Link href={"https://www.facebook.com/people/Pngpoint/61578723218217/"} target="_blank">
                                <FaFacebook className="text-xl xl:text-[22px]" />
                            </Link>
                            <Link href={"https://www.pinterest.com/Pngpoints/"} target="_blank">
                                <FaPinterest className="text-xl xl:text-[22px]" />
                            </Link>
                            <Link href={"https://www.instagram.com/pngpoint/"} target="_blank">
                                <FaInstagram className="text-xl xl:text-[22px]" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col flex-wrap w-full">
                        <h4 className="text-base lg:text-lg xl:text-xl font-semibold uppercase">Resources</h4>
                        <ul className="flex flex-col flex-wrap gap-y-2.5 md:gap-y-3 mt-2.5 md:mt-5 ml-4.5">
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/categories/"}>categories</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/sub-categories/"}>sub categories</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/user/login/"}>contributor login</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/user/register/"}>contributor register</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col flex-wrap w-full">
                        <h4 className="text-base lg:text-lg xl:text-xl font-semibold uppercase">Company</h4>
                        <ul className="flex flex-col flex-wrap gap-y-2.5 md:gap-y-3 mt-2.5 md:mt-5 ml-4.5">
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/about/"}>about us</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/contact/"}>contact</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/terms/"}>terms</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/privacy/"}>privacy</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"/license/"}>license</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col flex-wrap w-full">
                        <h4 className="text-base lg:text-lg xl:text-xl font-semibold uppercase">Community</h4>
                        <ul className="flex flex-col flex-wrap gap-y-2.5 md:gap-y-3 mt-2.5 md:mt-5 ml-4.5">
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"https://x.com/pngpoint"} target="_blank">x</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"https://www.pinterest.com/Pngpoints/"} target="_blank">pinterest</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"https://www.instagram.com/pngpoint/"} target="_blank">instagram</Link>
                            </li>
                            <li className=" list-disc">
                                <Link className="block w-fit text-sm xl:text-base font-normal uppercase" href={"https://www.facebook.com/people/Pngpoint/61578723218217/"} target="_blank">facebook</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-wrap items-center justify-center pt-5">
                <p className="text-sm md:text-base">Copyright © {currentYear} PNGPoint • All rights reserved • Enjoy the rest of your {todayName}!</p>
            </div>
        </footer>
    );
}