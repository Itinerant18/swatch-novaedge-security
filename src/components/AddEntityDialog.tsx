import React, { useState, useEffect } from 'react';
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
import { Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Entity, EntityType } from '@/types/hierarchy';
import EntityIcon from './EntityIcon';

interface AddEntityDialogProps {
  entityType: EntityType;
  parentEntity: Entity;
  onEntityAdded: () => void;
  children?: React.ReactNode;
}

const AddEntityDialog: React.FC<AddEntityDialogProps> = ({ 
  entityType, 
  parentEntity, 
  onEntityAdded,
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    manager: '',
    address: '',
    description: '',
    location: '',
    deviceType: 'ATM',
    status: 'online'
  });
  const { toast } = useToast();

  const getEntityLabel = (type: EntityType) => {
    const labels = {
      customer: 'Customer',
      zone: 'Zone',
      nbg: 'NBG',
      ro: 'RO',
      branch: 'Branch',
      device: 'Device'
    };
    return labels[type];
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      manager: '',
      address: '',
      description: '',
      location: '',
      deviceType: 'ATM',
      status: 'online'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: `${getEntityLabel(entityType)} name is required`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const metadata: any = {};
      
      // Add type-specific metadata
      if (entityType === 'device') {
        metadata.type = formData.deviceType;
        metadata.status = formData.status;
        metadata.last_active = new Date().toISOString();
        if (formData.location) metadata.location = formData.location;
      } else {
        if (formData.code) metadata.code = formData.code;
        if (formData.manager) metadata.manager = formData.manager;
        if (formData.address) metadata.address = formData.address;
      }
      
      if (formData.description) metadata.description = formData.description;

      const { error } = await supabase
        .from('entities')
        .insert({
          entity_name: formData.name.trim(),
          entity_type: entityType,
          parent_id: parentEntity.id,
          metadata
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${getEntityLabel(entityType)} added successfully`,
      });

      setOpen(false);
      resetForm();
      onEntityAdded();
    } catch (error) {
      console.error(`Error adding ${entityType}:`, error);
      toast({
        title: "Error",
        description: `Failed to add ${entityType}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerElement = children || (
    <Button variant="outline" size="sm">
      <Plus className="w-4 h-4 mr-2" />
      Add {getEntityLabel(entityType)}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EntityIcon type={entityType} className="w-5 h-5" />
            Add New {getEntityLabel(entityType)}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{getEntityLabel(entityType)} Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`e.g., ${entityType === 'device' ? 'ATM Terminal 1' : `Mumbai ${getEntityLabel(entityType)}`}`}
              className="mt-1"
            />
          </div>

          {entityType === 'device' ? (
            <>
              <div>
                <Label htmlFor="deviceType">Device Type</Label>
                <Select value={formData.deviceType} onValueChange={(value) => setFormData({ ...formData, deviceType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATM">ATM</SelectItem>
                    <SelectItem value="POS">POS Terminal</SelectItem>
                    <SelectItem value="Security Camera">Security Camera</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Router">Router</SelectItem>
                    <SelectItem value="Printer">Printer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Main Entrance, Counter 1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder={`e.g., ${entityType === 'branch' ? 'SBIN0001234' : 'MZ'}`}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  placeholder="Manager name"
                  className="mt-1"
                />
              </div>

              {entityType === 'branch' && (
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Branch address"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Brief description about the ${entityType}`}
              rows={2}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add {getEntityLabel(entityType)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntityDialog;