import React, { useEffect } from "react";
import { useState } from "react";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Share2,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteFolderMutation,
  useGetFoldersQuery,
} from "@/hooks/api/use-folder";
import { CreateFolderModal } from "./new-folder-modal";

const FoldersContainer = () => {
  const [isFoldersVisible, setIsFoldersVisible] = useState(true);
  const foldersQuery = useGetFoldersQuery();
  const deleteFolderMutation = useDeleteFolderMutation();

  useEffect(() => {
    foldersQuery?.data &&
      foldersQuery?.data?.length === 0 &&
      setIsFoldersVisible(false);
  }, [foldersQuery]);

  const handleToggleFoldersVisiblity = () => {
    setIsFoldersVisible((prev) => !prev);
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteFolderMutation.mutate(folderId);
  };

  return (
    <>
      <div className="space-y-1 ">
        <header className="px-4 z-10 flex justify-between pb-2 sticky top-0 left-0 right-0 bg-background">
          <h2 className="font-bold text-sm text-muted-foreground">Folders</h2>

          <div className="flex items-center gap-1">
            <CreateFolderModal onCreateFolder={() => {}}>
              <Plus className="w-4 " />
            </CreateFolderModal>
            <span onClick={handleToggleFoldersVisiblity}>
              {isFoldersVisible ? (
                <ChevronDown className="w-4 " />
              ) : (
                <ChevronRight className="w-4 " />
              )}
            </span>
          </div>
        </header>

        {isFoldersVisible &&
          (foldersQuery.isPending ? (
            <div className="flex flex-col gap-2  px-4 ">
              <Skeleton className="rounded-sm h-[55px] hover:bg-accent" />
              <Skeleton className="rounded-sm h-[55px] hover:bg-accent" />
              <Skeleton className="rounded-sm h-[55px] hover:bg-accent" />
            </div>
          ) : foldersQuery.data && foldersQuery?.data.length === 0 ? (
            <div className="text-center py-8  px-4 ">
              <p className="text-sm text-muted-foreground">No Folders found</p>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-1  px-4 ">
              {foldersQuery?.data?.map((folder) => (
                <div
                  key={folder.id}
                  className={cn(
                    "relative overflow-hidden group flex items-center justify-between rounded-md px-3 h-[55px] hover:bg-accent cursor-pointer transition-colors"
                  )}
                >
                  <span
                    className={cn(
                      `w-[3px] absolute top-0 left-0 bottom-0 h-full ${folder.theme}`
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">
                      {folder.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {folder._count.chats} chats
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-80"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ))}
      </div>
    </>
  );
};

export default FoldersContainer;



"use client";

import { type ReactNode, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateNewFolderMutation } from "@/hooks/api/use-folder";
import { useGetChatsForSelectQuery } from "@/hooks/api/use-chat";

interface Chat {
  id: string;
  title: string;
  timestamp: string;
}

interface CreateFolderModalProps {
  children: ReactNode;
  onCreateFolder: (data: {
    title: string;
    selectedChats: string[];
    color: string;
  }) => void;
}

const colorOptions = [
  {
    name: "Ocean Blue",
    value: "bg-gradient-to-br from-blue-500 to-cyan-400",
    border: "border-blue-500",
  },
  {
    name: "Sunset Orange",
    value: "bg-gradient-to-br from-orange-500 to-pink-400",
    border: "border-orange-500",
  },
  {
    name: "Forest Green",
    value: "bg-gradient-to-br from-green-500 to-emerald-400",
    border: "border-green-500",
  },
  {
    name: "Royal Purple",
    value: "bg-gradient-to-br from-purple-500 to-indigo-400",
    border: "border-purple-500",
  },
  {
    name: "Rose Pink",
    value: "bg-gradient-to-br from-pink-500 to-rose-400",
    border: "border-pink-500",
  },
  {
    name: "Golden Yellow",
    value: "bg-gradient-to-br from-yellow-500 to-amber-400",
    border: "border-yellow-500",
  },
  {
    name: "Crimson Red",
    value: "bg-gradient-to-br from-red-500 to-pink-400",
    border: "border-red-500",
  },
  {
    name: "Slate Gray",
    value: "bg-gradient-to-br from-slate-500 to-gray-400",
    border: "border-slate-500",
  },
];

export function CreateFolderModal({
  onCreateFolder,
  children,
}: CreateFolderModalProps) {
  const [title, setTitle] = useState("");
  const [selectedChats, setSelectedChatIds] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const createNewFolderMutation = useCreateNewFolderMutation();
  const chatsQuery = useGetChatsForSelectQuery();

  const handleChatToggle = (chatId: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const handleSubmit = () => {
    if (title.trim()) {
      createNewFolderMutation.mutate({
        chatIds: selectedChats,
        theme: selectedColor,
        title: title,
      });
      // Reset form
      setTitle("");
      setSelectedChatIds([]);
      setSelectedColor(colorOptions[0].value);
    }
  };

  const selectedColorOption = colorOptions.find(
    (option) => option.value === selectedColor
  );

  return (
    <div className="z-40">
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="z-[1000] sm:max-w-[600px] backdrop-blur-md max-h-[500px] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                Create New Folder
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Folder Title */}
              <div className="space-y-2">
                <Label htmlFor="folder-title" className="text-sm font-medium">
                  Folder Name
                </Label>
                <Input
                  id="folder-title"
                  placeholder="Enter folder name..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Choose Theme Color
                </Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`
                    relative w-8 h-8 rounded-full transition-all duration-200 hover:scale-110
                    ${color.value}
                    ${
                      selectedColor === color.value
                        ? `ring-2 ring-offset-2 ${color.border.replace(
                            "border-",
                            "ring-"
                          )}`
                        : ""
                    }
                  `}
                      title={color.name}
                    >
                      {selectedColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedColorOption?.name}
                </p>
              </div>

              {/* Chat Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Select Chats ({selectedChats.length} selected)
                </Label>
                <ScrollArea className="max-h-64 overflow-y-scroll rounded-lg border p-3 space-y-2">
                  {chatsQuery.isPending || chatsQuery.isFetching ? (
                    <div className="h-[100px] w-full grid place-content-center">
                      Loading...
                    </div>
                  ) : chatsQuery.data?.length === 0 ? (
                    <div className="h-[100px] w-full grid place-content-center">
                      0 chat found!
                    </div>
                  ) : (
                    chatsQuery?.data?.map((chat) => (
                      <div
                        key={chat.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={chat.id}
                          checked={selectedChats.includes(chat.id)}
                          onCheckedChange={() => handleChatToggle(chat.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={chat.id}
                            className="text-sm font-medium cursor-pointer block"
                          >
                            {chat.title}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1"></p>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* Footer */}
            <div className="py-4 border-t flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={!title.trim() || createNewFolderMutation.isPending}
              >
                Create Folder
              </Button>
            </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
