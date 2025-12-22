import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { Visitor } from "@/types/visitor";
import { useVisitorForm } from "@/hooks/useVisitorForm";

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitorToEdit?: Visitor | null;
}

export default function VisitorModal({
  isOpen,
  onClose,
  visitorToEdit,
}: VisitorModalProps) {
  const {
    formData,
    isLoading,
    selectedFile,
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
  } = useVisitorForm({ visitorToEdit, onClose, isOpen });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={visitorToEdit ? "Edit Visitor" : "Add Visitor"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border">
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : visitorToEdit?.profileImgUri ? (
              <img
                src={visitorToEdit.profileImgUri}
                alt={visitorToEdit.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-xs">No Image</span>
            )}
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full max-w-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              name="companyNameFallback"
              value={formData.companyNameFallback}
              onChange={handleChange}
              placeholder="Company Name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes..."
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              name="isVip"
              checked={formData.isVip}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            VIP Visitor
          </label>
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-destructive">
            <input
              type="checkbox"
              name="isBlocked"
              checked={formData.isBlocked}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-destructive focus:ring-destructive"
            />
            Block Visitor
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : visitorToEdit ? "Save Changes" : "Add Visitor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
