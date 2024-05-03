import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import styles from "./Header.module.css";

const font = Poppins({
    subsets: ["latin"],
    weight: ["200"]
});

interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
            <h1 className={cn("text-3xl flex items-center", font.className)}>
                <Image src="/assets/Tech-Hub.svg" alt="Logo" width={145} height={145} className={`${styles.logo} rounded-md`} priority={true} />
            </h1>
            <p className="text-muted-foreground text-sm">{label}</p>
        </div>
    );
};
