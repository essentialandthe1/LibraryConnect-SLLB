'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { ArrowLeft } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';

const CreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    branch: '',
    password: '',
    confirmPassword: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.role.trim()) newErrors.role = 'Role is required';
    if (!form.branch.trim()) newErrors.branch = 'Branch is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        username: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        branch: form.branch,
        password: form.password,
        status: form.status || 'active',
      };

      return await api.post('/users/admin-create', payload);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `User "${form.name}" created successfully!`,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) createUser();
  };

  const handleClear = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      role: '',
      branch: '',
      password: '',
      confirmPassword: '',
      status: 'active',
    });
    setErrors({});
  };

  const renderSelect = (label, value, onChange, options, error) => (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          className={clsx(
            'w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-left',
            error ? 'border-red-500' : 'border-gray-300'
          )}
        >
          <Select.Value placeholder={`Select ${label.toLowerCase()}`} />
        </Select.Trigger>

        <Select.Content className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto z-50 mt-1">
          {options.map((opt) => (
            <Select.Item
              key={opt}
              value={opt}
              className="px-3 py-2 cursor-pointer select-none text-gray-800 dark:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
            >
              <Select.ItemText>{opt}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>Add a new user to the system</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Kamara"
                  className={clsx(errors.name && 'border-red-500')}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@sllb.gov.sl"
                  className={clsx(errors.email && 'border-red-500')}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+232 XX XXX XXXX"
                  className={clsx(errors.phone && 'border-red-500')}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              {/* Selects */}
              {renderSelect('Role', form.role, (val) => setForm({ ...form, role: val }), roles, errors.role)}
              {renderSelect('Branch/Department', form.branch, (val) => setForm({ ...form, branch: val }), branches, errors.branch)}
              {renderSelect('Status', form.status, (val) => setForm({ ...form, status: val }), ['active', 'inactive'])}

              {/* Password */}
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={clsx(errors.password && 'border-red-500')}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={clsx(errors.confirmPassword && 'border-red-500')}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isPending} className= "rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 justify-center">
                {isPending ? 'Creating...' : 'Create User'}
              </Button>

              <Button type="button" variant="outline" onClick={handleClear} className= "rounded flex items-center gap-2 justify-center">
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUser;
