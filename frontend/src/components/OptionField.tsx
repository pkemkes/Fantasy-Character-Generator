import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

interface OptionFieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const filter = createFilterOptions<string>();

export default function OptionField({
  label,
  options,
  value,
  onChange,
}: OptionFieldProps) {
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      onChange={(_e, newValue) => onChange(newValue ?? "")}
      onInputChange={(_e, newValue) => onChange(newValue ?? "")}
      filterOptions={(opts, params) => {
        const filtered = filter(opts, params);
        return filtered;
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" fullWidth />
      )}
    />
  );
}
