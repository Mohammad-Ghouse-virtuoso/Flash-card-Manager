import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { insertCardSchema, type Card } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface EditCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card;
  deckId: number;
}

const editCardSchema = insertCardSchema.partial().extend({
  front: z.string().min(1, "Front text is required"),
  back: z.string().min(1, "Back text is required"),
});

type EditCardData = z.infer<typeof editCardSchema>;

export function EditCardModal({ open, onOpenChange, card, deckId }: EditCardModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<EditCardData>({
    resolver: zodResolver(editCardSchema),
    defaultValues: {
      front: card.front,
      back: card.back,
      difficulty: card.difficulty || "Medium",
      tags: card.tags || "",
    },
  });

  const editCardMutation = useMutation({
    mutationFn: (data: EditCardData) => apiRequest("PUT", `/api/cards/${card.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/decks", deckId, "cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      toast({ title: "Card updated successfully!" });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Failed to update card",
        description: "Please try again.",
        variant: "destructive"
      });
    },
  });

  const onSubmit = (data: EditCardData) => {
    editCardMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="front"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Front (Question)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your question or prompt"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="back"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Back (Answer)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the answer or explanation"
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., functions, syntax" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={editCardMutation.isPending}
              >
                {editCardMutation.isPending ? "Updating..." : "Update Card"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}