import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/PP-logo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/forms/registerForm";

export default function Register() {
    return (
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full h-full">
            <div className="flex flex-col flex-wrap justify-center items-center w-full h-full">
                <div className="flex flex-col flex-wrap justify-center items-center w-full h-[90%] overflow-hidden">
                    <Card className="w-full max-w-2xl h-full overflow-y-scroll overflow-x-hidden scrollbar-hidden">
                        <CardHeader>
                            <div className="flex flex-col flex-wrap justify-center items-center w-full">
                                <Link className="block w-fit" href={'/'}>
                                <Image
                                    src={Logo}
                                    alt="png-point"
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </Link>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Register to your account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RegisterForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
