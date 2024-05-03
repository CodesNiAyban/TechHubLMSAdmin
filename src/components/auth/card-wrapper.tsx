import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
    cardTitle?: string;
    cardDescription?: string;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonHref,
    backButtonLabel,
    showSocial,
    cardTitle,
    cardDescription
}: CardWrapperProps) => {
    return (
        <div className="flex flex-col items-center justify-center sm:flex-row">
            <Card className="w-full sm:w-[500px] p-3">
                <CardHeader>
                    <Header label={headerLabel} />
                </CardHeader>
                {cardTitle && <CardTitle>{cardTitle}</CardTitle>}
                {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
                <CardContent>
                    {children}
                </CardContent>
                {showSocial && (
                    <CardFooter>
                        <Social />
                    </CardFooter>
                )}
                <CardFooter>
                    <BackButton
                        label={backButtonLabel}
                        href={backButtonHref}
                    />
                </CardFooter>
            </Card>
        </div>
    );
};
