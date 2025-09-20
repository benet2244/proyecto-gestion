'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteItem } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteButtonProps {
  id: string;
  type: 'incident' | 'threat-log';
  asDropdownMenuItem?: boolean;
}

export default function DeleteButton({ id, type, asDropdownMenuItem = false }: DeleteButtonProps) {
  const { toast } = useToast();

  const formattedType = type.replace('-', ' ');

  const handleDelete = async () => {
    try {
      await deleteItem(id, type);
      toast({
        title: `${formattedType.charAt(0).toUpperCase() + formattedType.slice(1)} Deleted`,
        description: `The ${formattedType} with ID ${id} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Error Deleting Item',
        description: `Could not delete ${formattedType} ${id}. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const TriggerContent = () => (
    <>
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {asDropdownMenuItem ? (
          <DropdownMenuItem
            className="text-destructive"
            onSelect={(e) => e.preventDefault()}
          >
            <TriggerContent />
          </DropdownMenuItem>
        ) : (
          <Button variant="destructive" size="sm">
            <TriggerContent />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {formattedType}
            <span className="font-bold"> {id}</span> from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={handleDelete}
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
