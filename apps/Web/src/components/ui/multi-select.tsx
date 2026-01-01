import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (currentValue: string) => {
    const newValue = value.includes(currentValue)
      ? value.filter((v) => v !== currentValue)
      : [...value, currentValue];
    onChange(newValue);
  };

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full justify-between"
      >
        <div className="flex flex-wrap gap-1">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center text-white gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
              >
                {label}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-2 shadow-md">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
                onClick={() => handleSelect(option.value)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => {}}
                  className="h-4 w-4"
                />
                <label className="text-sm">{option.label}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}