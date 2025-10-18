
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { machineData } from '@/lib/data';
import { teamData } from '@/lib/data';
import type { PMTask } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '../ui/textarea';

const scheduleSchema = z.object({
  machineId: z.string().nonempty('Machine ID is required.'),
  activity: z.string().nonempty('Activity is required.'),
  frequency: z.string().nonempty('Frequency is required.'),
  assignee: z.string().nonempty('Assignee is required.'),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
  checklist: z.array(z.object({ text: z.string().nonempty('Checklist item cannot be empty.') })).optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface PMScheduleFormProps {
  onSubmitSuccess: (data: Omit<PMTask, 'ticketId' | 'status'>) => void;
}

export function PMScheduleForm({ onSubmitSuccess }: PMScheduleFormProps) {
  const { toast } = useToast();
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      machineId: '',
      activity: '',
      frequency: 'Monthly',
      assignee: '',
      checklist: [{ text: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'checklist',
  });

  const onSubmit = (data: ScheduleFormValues) => {
    const machine = machineData.find(m => m.id === data.machineId);
    if (!machine) return;

    const submissionData = {
        ...data,
        dueDate: format(data.dueDate, 'yyyy-MM-dd'),
        machineName: machine.name,
        location: `Shop Floor ${machine.id.slice(-1)}`,
        checklist: data.checklist?.map(item => item.text).filter(text => text.trim() !== ''),
    };

    toast({
      title: 'PM Task Scheduled',
      description: `Successfully scheduled task for machine ${data.machineId}.`,
    });
    onSubmitSuccess(submissionData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="machineId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Machine</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a machine" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {machineData.map(machine => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.name} ({machine.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Monthly Lubrication" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
           <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Annually">Annually</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {teamData.map(member => (
                                <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Checklist</FormLabel>
          <div className="mt-2 space-y-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`checklist.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Textarea placeholder={`Checklist item ${index + 1}`} {...field} className="min-h-0 h-10 resize-none" />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1 && form.getValues('checklist.0.text') === ''}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ text: '' })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Checklist Item
          </Button>
        </div>

        <Button type="submit" className="w-full">
          Schedule Task
        </Button>
      </form>
    </Form>
  );
}
