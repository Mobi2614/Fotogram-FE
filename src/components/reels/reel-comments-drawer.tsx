import { useReelContext } from "@/contexts/reel-context";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Heart } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export default function ReelCommentsDrawer() {
  const { reelId, showComments, setCommentsVisibility, setReelId } =
    useReelContext();

  const handleCloseComments = () => {
    setReelId(null);
    setCommentsVisibility(false);
  };

  return (
    <Sheet
      key={`comments-${reelId}`}
      open={showComments}
      onOpenChange={handleCloseComments}
    >
      <SheetHeader>
        <SheetTitle></SheetTitle>
      </SheetHeader>
      <SheetDescription></SheetDescription>

      <SheetContent>
        <ScrollArea className="mt-5 pr-3 h-full">
          <div className=" flex flex-col gap-y-2">
            <Comment />
            <Comment />
            <Comment />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Comment() {
  return (
    <div className="flex gap-2">
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Card className="w-full group">
        <CardHeader className="p-2">
          <div className=" flex justify-between">
            <CardTitle className="text-sm">shadcn</CardTitle>
          </div>
          <CardDescription>Amazing Video 🔥🔥🔥</CardDescription>
        </CardHeader>

        <CardFooter className="p-2">
          <div className="px-2 flex gap-x-4 text-xs">
            <div>
              <span className="font-medium">2h</span>
            </div>
            <button>
              <Heart size={16} />
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
