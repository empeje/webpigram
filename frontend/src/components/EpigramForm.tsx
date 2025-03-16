import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Epigram } from "@/types/epigram";

const formSchema = z.object({
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  topics: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EpigramFormProps {
  onSubmit: (epigram: Omit<Epigram, "id" | "upvotes" | "downvotes" | "createdAt">) => void;
}

export function EpigramForm({ onSubmit }: EpigramFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      author: "",
      topics: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    
    // Process topics from comma-separated string to array
    const topicsArray = values.topics 
      ? values.topics.split(',').map(topic => topic.trim()).filter(Boolean)
      : [];
    
    // Create a new epigram object
    const newEpigram = {
      content: values.content,
      author: values.author,
      topics: topicsArray,
    };
    
    // Call the onSubmit callback
    onSubmit(newEpigram);
    
    // Reset the form
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Epigram</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your epigram..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topics</FormLabel>
              <FormControl>
                <Input placeholder="Programming, Variables, etc. (comma-separated)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Epigram"}
        </Button>
      </form>
    </Form>
  );
} 