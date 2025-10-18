
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const memberSchema = z.object({
  id: z.string().nonempty("ID is required"),
  name: z.string().nonempty("Name is required"),
  role: z.enum(["Operator", "Maintenance Engineer", "Supervisor", "QA"]),
  department: z.string().nonempty("Department is required"),
});

const mockTeam = [
    { id: 'EMP-001', name: 'John Doe', role: 'Maintenance Engineer', department: 'Maintenance' },
    { id: 'EMP-002', name: 'Jane Smith', role: 'Operator', department: 'Production' },
    { id: 'EMP-003', name: 'Mike Brown', role: 'Supervisor', department: 'Production' },
    { id: 'EMP-004', name: 'Sara Wilson', role: 'QA', department: 'Quality' },
];

export function TeamMaster() {
  const [team, setTeam] = useState(mockTeam);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<z.infer<typeof memberSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
  });

  const onSubmit = (data: z.infer<typeof memberSchema>) => {
    if (editingMember) {
      setTeam(team.map(m => m.id === editingMember.id ? data : m));
      toast({ title: "Team Member Updated", description: `${data.name} has been updated.` });
    } else {
      setTeam([...team, data]);
      toast({ title: "Team Member Added", description: `${data.name} has been added.` });
    }
    setIsDialogOpen(false);
    setEditingMember(null);
  };

  const handleEdit = (member: z.infer<typeof memberSchema>) => {
    setEditingMember(member);
    form.reset(member);
    setIsDialogOpen(true);
  }
  
  const handleDelete = (id: string) => {
    setTeam(team.filter(m => m.id !== id));
    toast({ title: "Team Member Deleted", description: `Member ${id} has been deleted.` });
  }

  const openNewMemberDialog = () => {
    setEditingMember(null);
    form.reset({ id: '', name: '', role: 'Operator', department: '' });
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>Operator &amp; Maintenance Team Master</CardTitle>
                <CardDescription>Manage all team members and their roles.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openNewMemberDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Member
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="id" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee ID</FormLabel>
                                    <FormControl><Input {...field} disabled={!!editingMember} /></FormControl>
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
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Operator">Operator</SelectItem>
                                            <SelectItem value="Maintenance Engineer">Maintenance Engineer</SelectItem>
                                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                                            <SelectItem value="QA">QA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="department" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit">{editingMember ? 'Save Changes' : 'Add Member'}</Button>
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
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map(member => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell><Badge variant="secondary">{member.role}</Badge></TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(member as any)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                         <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
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