import Link from "next/link";

import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CommonAvatarProps {
  link?: string;
  name: string;
  image: string;
}

// common avatar
export const CommonAvatar: React.FC<CommonAvatarProps> = ({
  link,
  name,
  image,
}) => {
  const content = (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={image} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      {name}
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
};

export const CommonTableAvater: React.FC<{
  name: string;
  image: string;
}> = ({ image, name }) => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={image} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

// table div
export const CommonTableDiv: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("overflow-x-auto rounded-xl border", className)}>
      {children}
    </div>
  );
};

// common tooltip
export const CommonTooltip: React.FC<{
  children: React.ReactNode;
  message: string;
  duration?: number;
}> = ({ children, message, duration }) => {
  return (
    <TooltipProvider delayDuration={duration}>
      <Tooltip>
        <TooltipTrigger className="cursor-pointer select-none" asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p> {message} </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Spinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderIcon className="h-12 w-12 animate-spin" />
    </div>
  );
};
export const TableSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <LoaderIcon className="h-12 w-12 animate-spin" />
    </div>
  );
};
