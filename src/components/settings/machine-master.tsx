
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { machineData } from '@/lib/data';

const machineSchema = z.object({
  id: z.string().nonempty("Machine ID is required"),
  name: z.string().nonempty("Name is required"),
  type: z.string().nonempty("Type is required"),
  location: z.string().nonempty("Location is required"),
});

const mockMachines = machineData.map(m => ({ id: m.id, name: m.name, type: m.model, location: `Shop Floor ${m.id.slice(-1)}`}))

export function MachineMaster() {
  const [machines, setMachines] = useState(mockMachines);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<z.infer<typeof machineSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof machineSchema>>({
    resolver: zodResolver(machineSchema),
  });

  const onSubmit = (data: z.infer<typeof machineSchema>) => {
    if (editingMachine) {
      setMachines(machines.map(m => m.id === editingMachine.id ? data : m));
      toast({ title: "Machine Updated", description: `${data.name} has been updated.` });
    } else {
      setMachines([...machines, data]);
      toast({ title: "Machine Added", description: `${data.name} has been added.` });
    }
    setIsDialogOpen(false);
    setEditingMachine(null);
  };

  const handleEdit = (machine: z.infer<typeof machineSchema>) => {
    setEditingMachine(machine);
    form.reset(machine);
    setIsDialogOpen(true);
  }
  
  const handleDelete = (id: string) => {
    setMachines(machines.filter(m => m.id !== id));
    toast({ title: "Machine Deleted", description: `Machine ${id} has been deleted.` });
  }
  
  const openNewMachineDialog = () => {
    setEditingMachine(null);
    form.reset({ id: '', name: '', type: '', location: '' });
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>Machine Master</CardTitle>
                <CardDescription>Manage all machines in the system.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openNewMachineDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Machine
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingMachine ? 'Edit Machine' : 'Add New Machine'}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormField control={form.control} name="id" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Machine ID</FormLabel>
                                    <FormControl><Input {...field} disabled={!!editingMachine} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit">{editingMachine ? 'Save Changes' : 'Add Machine'}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map(machine => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.id}</TableCell>
                    <TableCell>{machine.name}</TableCell>
                    <TableCell>{machine.type}</TableCell>
                    <TableCell>{machine.location}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(machine)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                         <Button variant="ghost" size="icon" onClick={() => handleDelete(machine.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
