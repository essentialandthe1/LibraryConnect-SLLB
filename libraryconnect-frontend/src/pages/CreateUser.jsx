'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

/* ------------------ ZOD SCHEMA ------------------ */

const userSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Phone is required'),
    role: z.string().min(1, 'Role is required'),
    branch: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }

    if (data.role !== 'Admin/HR' && !data.branch) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Branch is required for this role',
        path: ['branch'],
      });
    }
  });


/* ------------------ COMPONENT ------------------ */

const CreateUser = () => {
  const navigate = useNavigate();

  const roles = [
    'Admin/HR',
    'Chief Librarian',
    'Deputy Chief Librarian',
    'Principal Librarian',
    'Branch Librarian',
    'Staff',
  ];

  const branches = [
    'HQ - Cataloguing Department',
    'HQ - Reference Department',
    'HQ - Adult Lending Department',
    'HQ - Children Department',
    'Regional Library South (Bo)',
    'Regional Library East (Kenema)',
    'Regional Library North (Makeni)',
    'City Library Bo',
    'City Library Kenema',
    'City Library Makeni',
    'Kailahun District Library',
    'Koidu District Library',
    'Segbuma Branch Library',
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      branch: '',
      status: 'active',
      password: '',
      confirmPassword: '',
    },
  });

  /* ------------------ PASSWORD STRENGTH ------------------ */

  const password = useWatch({ control, name: 'password' });

  const getStrength = (pwd = '') => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = [
    'Very Weak',
    'Weak',
    'Moderate',
    'Strong',
    'Very Strong',
  ];

  /* ------------------ MUTATION ------------------ */

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async (data) => {
      return api.post('/users/admin-create', {
        username: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        branch: data.branch,
        password: data.password,
        status: data.status,
      });
    },
    onSuccess: () => {
      toast({
        title: 'User Created',
        description: 'User successfully added.',
      });
      navigate('/manage-users');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create user',
        variant: 'destructive',
      });
    },
  });

  const selectedRole = useWatch({ control, name: 'role' });

  const onSubmit = (data) => {
    createUser(data);
  };

  /* ------------------ JSX ------------------ */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>
              Add a new system user with role-based access.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 md:p-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {/* NAME */}
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input {...field} />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* EMAIL */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" {...field} />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* PHONE */}
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input {...field} />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* ROLE */}
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Role *</Label>
                      <Select.Root
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-white dark:bg-gray-700">
                          <Select.Value placeholder="Select Role" />
                          <ChevronDown size={16} />
                        </Select.Trigger>

                        <Select.Portal>
                          <Select.Content
                            position="popper"
                            sideOffset={6}
                            className="z-[999] w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 border rounded-lg shadow-xl max-h-60 overflow-hidden"
                          >
                            <Select.Viewport className="p-1">
                              {roles.map((role) => (
                                <Select.Item
                                  key={role}
                                  value={role}
                                  className="px-3 py-2 rounded-md text-sm cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                >
                                  <Select.ItemText>
                                    {role}
                                  </Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>

                      {errors.role && (
                        <p className="text-sm text-red-500">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* CONDITIONAL BRANCH */}
                {selectedRole !== 'Admin/HR' && (
                  <Controller
                    name="branch"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label>Branch *</Label>
                        <Select.Root
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-white dark:bg-gray-700">
                            <Select.Value placeholder="Select Branch" />
                            <ChevronDown size={16} />
                          </Select.Trigger>

                          <Select.Portal>
                            <Select.Content
                              position="popper"
                              sideOffset={6}
                              className="z-[999] w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 border rounded-lg shadow-xl max-h-60 overflow-hidden"
                            >
                              <Select.Viewport className="p-1">
                                {branches.map((branch) => (
                                  <Select.Item
                                    key={branch}
                                    value={branch}
                                    className="px-3 py-2 rounded-md text-sm cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                                  >
                                    <Select.ItemText>
                                      {branch}
                                    </Select.ItemText>
                                  </Select.Item>
                                ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>

                        {errors.branch && (
                          <p className="text-sm text-red-500">
                            {errors.branch.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}

                {/* PASSWORD */}
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Password *</Label>
                      <Input type="password" {...field} />

                      {/* Strength Meter */}
                      {password && (
                        <>
                          <div className="h-2 w-full bg-gray-200 rounded">
                            <div
                              className="h-2 rounded transition-all bg-blue-600"
                              style={{
                                width: `${(strength / 4) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            {strengthLabels[strength]}
                          </p>
                        </>
                      )}

                      {errors.password && (
                        <p className="text-sm text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* CONFIRM PASSWORD */}
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Confirm Password *</Label>
                      <Input type="password" {...field} />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPending ? 'Creating...' : 'Create User'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  className="w-full md:w-auto"
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUser;
