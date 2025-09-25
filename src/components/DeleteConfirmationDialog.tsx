import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}
export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-black/80 border-magenta text-foreground backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-magenta">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400 text-lg">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              className="bg-magenta text-white hover:bg-magenta/80"
            >
              Confirm Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}