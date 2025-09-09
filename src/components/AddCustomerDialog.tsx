import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddCustomerDialogProps {
  onCustomerAdded: () => void;
}

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({ onCustomerAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Bank',
    country: 'India',
    city: '',
    description: '',
    hierarchyLevels: ['zone', 'branch'] // Default hierarchy
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Insert customer entity
      const { data: customerData, error: customerError } = await supabase
        .from('entities')
        .insert({
          entity_name: formData.name.trim(),
          entity_type: 'customer',
          parent_id: null,
          metadata: {
            type: formData.type,
            country: formData.country,
            city: formData.city,
            description: formData.description
          }
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Insert hierarchy configuration
      const { error: hierarchyError } = await supabase
        .from('hierarchy_configs')
        .insert({
          customer_id: customerData.id,
          hierarchy_levels: formData.hierarchyLevels
        });

      if (hierarchyError) throw hierarchyError;

      toast({
        title: "Success",
        description: "Customer added successfully",
      });

      setOpen(false);
      setFormData({
        name: '',
        type: 'Bank',
        country: 'India',
        city: '',
        description: '',
        hierarchyLevels: ['zone', 'branch']
      });
      onCustomerAdded();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHierarchyChange = (value: string) => {
    const hierarchyOptions = {
      'zone-branch': ['zone', 'branch'],
      'zone-nbg-ro-branch': ['zone', 'nbg', 'ro', 'branch'],
      'region-branch': ['region', 'branch'],
      'division-region-branch': ['division', 'region', 'branch']
    };
    setFormData({ ...formData, hierarchyLevels: hierarchyOptions[value as keyof typeof hierarchyOptions] || ['zone', 'branch'] });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Building2 className="w-4 h-4 mr-2" />
          Add New Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Add New Customer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Customer Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., State Bank of India"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="type">Customer Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank">Bank</SelectItem>
                <SelectItem value="Credit Union">Credit Union</SelectItem>
                <SelectItem value="Financial Institution">Financial Institution</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="India"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hierarchy">Hierarchy Structure</Label>
            <Select defaultValue="zone-branch" onValueChange={handleHierarchyChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zone-branch">Zone → Branch</SelectItem>
                <SelectItem value="zone-nbg-ro-branch">Zone → NBG → RO → Branch</SelectItem>
                <SelectItem value="region-branch">Region → Branch</SelectItem>
                <SelectItem value="division-region-branch">Division → Region → Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description about the customer"
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;