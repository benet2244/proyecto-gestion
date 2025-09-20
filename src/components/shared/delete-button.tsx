'use client';

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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { deleteItem } from '@/lib/actions';

interface DeleteButtonProps {
    id: string;
    type: 'incident' | 'detection';
    asDropdownMenuItem?: boolean;
}

export default function DeleteButton({ id, type, asDropdownMenuItem = false }: DeleteButtonProps) {
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            await deleteItem(id, type);
            toast({
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} Deleted`,
                description: `The ${type} with ID ${id} has been deleted.`,
            });
        } catch (error) {
            toast({
                title: 'Error Deleting Item',
                description: `Could not delete ${type} ${id}. Please try again.`,
                variant: 'destructive',
            });
        }
    };

    const TriggerComponent = asDropdownMenuItem ? DropdownMenuItem : Button;
    const triggerProps = asDropdownMenuItem
        ? { className: "text-destructive", onSelect: (e: Event) => e.preventDefault() }
        : { variant: "destructive" as "destructive", size: "sm" as "sm" };


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <TriggerComponent {...triggerProps}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </TriggerComponent>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the {type}
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
