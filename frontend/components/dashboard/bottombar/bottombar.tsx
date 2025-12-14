import Link from "next/link";
import { getTodayName, getCurrentYear } from "@/utils/dateHelper";

export const BottomBar = () => {
    const todayName = getTodayName();
    const currentYear = getCurrentYear();
    return (
        <div className="flex flex-col flex-wrap justify-center items-center px-5 xl:px-10 h-[6%] xl:h-[8%] border-t overflow-hidden border-[#d6cece]">
            <p className="text-[10px] sm:text-xs lg:text-base font-normal text-center">Copyright © {currentYear} PNGPoint • All rights reserved • Enjoy the rest of your {todayName}!</p>
        </div>
    );
}