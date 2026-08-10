import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { use } from "react";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileMenu({ sessionPromise }) {
  const userSession = use(sessionPromise);
  const getInitials = (name) => {
    if (!name) return "TD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  console.log(userSession);

  return (
    <div className="flex items-center space-x-4">
      {userSession ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 transition-all hover:scale-105 hover:shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="User menu"
            >
              <Avatar className="border-border/50 h-10 w-10 border shadow-sm">
                <AvatarImage
                  src={userSession?.image}
                  alt={userSession?.username || "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-sm font-medium">
                  {getInitials(userSession?.username)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-border/50 w-64 overflow-hidden p-0 shadow-lg"
            align="end"
            forceMount
            sideOffset={8}
          >
            {/* User Profile Section */}
            <div className="bg-muted/30 border-border/30 border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="border-background h-10 w-10 border-2 shadow-sm">
                  <AvatarImage
                    src={userSession?.image}
                    alt={userSession?.username || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/5 text-sm font-medium">
                    {getInitials(userSession?.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="truncate text-sm font-semibold">
                    {userSession?.username || "User"}
                  </p>
                  <p className="text-muted-foreground max-w-[180px] truncate text-xs">
                    {userSession?.email || ""}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/80 border-border/50 hover:bg-background h-8 w-full text-xs transition-colors"
                >
                  View Profile
                </Button>
              </div>
            </div>

            <div className="p-2">
              <DropdownMenuLabel className="text-muted-foreground px-2 text-xs font-medium">
                Account
              </DropdownMenuLabel>
              <ComingSoonWrapper enabled>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="hover:bg-muted focus:bg-muted cursor-pointer rounded-md px-2 py-1.5 transition-colors"
                  >
                    <Link href="/settings" className="flex w-full items-center">
                      <Settings className="text-muted-foreground mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </ComingSoonWrapper>
            </div>

            <DropdownMenuSeparator className="my-0.5" />

            <div className="p-2">
              <DropdownMenuItem
                className="hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer rounded-md px-2 py-1.5 transition-colors"
                onSelect={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button className="p-0">
            <Link className="px-4 py-2" href="/auth/signin">
              Sign In
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
