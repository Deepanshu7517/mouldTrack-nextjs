
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
  DialogDescription,
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

const mouldSchema = z.object({
  id: z.string().nonempty("Mould ID is required"),
  model: z.string().nonempty("Model is required"),
  oem: z.string().nonempty("OEM is required"),
  strokeLife: z.coerce.number().positive("Stroke life must be a positive number"),
  utilizationThreshold: z.coerce.number().positive("Threshold must be a positive number"),
});

const mockMoulds = [
    { id: 'MLD-45B-01', model: 'M-100A', oem: 'Global Moulds Inc.', strokeLife: 500000, utilizationThreshold: 100000 },
    { id: 'MLD-45B-02', model: 'M-100B', oem: 'Global Moulds Inc.', strokeLife: 500000, utilizationThreshold: 100000 },
    { id: 'MLD-C2-01', model: 'M-200X', oem: 'Advanced Tooling', strokeLife: 1000000, utilizationThreshold: 200000 },
];

export function MouldMaster() {
  const [moulds, setMoulds] = useState(mockMoulds);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMould, setEditingMould] = useState<z.infer<typeof mouldSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof mouldSchema>>({
    resolver: zodResolver(mouldSchema),
  });

  const onSubmit = (data: z.infer<typeof mouldSchema>) => {
    if (editingMould) {
      setMoulds(moulds.map(m => m.id === editingMould.id ? data : m));
      toast({ title: "Mould Updated", description: `${data.id} has been updated.` });
    } else {
      setMoulds([...moulds, data]);
      toast({ title: "Mould Added", description: `${data.id} has been added.` });
    }
    setIsDialogOpen(false);
    setEditingMould(null);
  };

  const handleEdit = (mould: z.infer<typeof mouldSchema>) => {
    setEditingMould(mould);
    form.reset(mould);
    setIsDialogOpen(true);
  }
  
  const handleDelete = (id: string) => {
    setMoulds(moulds.filter(m => m.id !== id));
    toast({ title: "Mould Deleted", description: `Mould ${id} has been deleted.` });
  }

  const openNewMouldDialog = () => {
    setEditingMould(null);
    form.reset({ id: '', model: '', oem: '', strokeLife: 0, utilizationThreshold: 0 });
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>Mould Master</CardTitle>
                <CardDescription>Manage all moulds in the system.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openNewMouldDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Mould
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingMould ? 'Edit Mould' : 'Add New Mould'}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="id" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mould ID</FormLabel>
                                    <FormControl><Input {...field} disabled={!!editingMould} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="model" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="oem" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OEM</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="strokeLife" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stroke Life</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="utilizationThreshold" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Utilization Threshold</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit">{editingMould ? 'Save Changes' : 'Add Mould'}</Button>
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
                  <TableHead>Mould ID</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>OEM</TableHead>
                  <TableHead>Stroke Life</TableHead>
                  <TableHead>Util. Threshold</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moulds.map(mould => (
                  <TableRow key={mould.id}>
                    <TableCell className="font-medium">{mould.id}</TableCell>
                    <TableCell>{mould.model}</TableCell>
                    <TableCell>{mould.oem}</TableCell>
                    <TableCell>{mould.strokeLife.toLocaleString()}</TableCell>
                    <TableCell>{mould.utilizationThreshold.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(mould)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(mould.id)}>
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
