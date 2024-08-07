import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languageOptions } from "@/constants/languages";

const LanguageDropdown = ({ selectedLanguage, onSelectChange }) => {
  return (
    <Select
      value={selectedLanguage.value}
      onValueChange={(value) =>
        onSelectChange(languageOptions.find((option) => option.value === value))
      }
    >
      <SelectTrigger className="w-[250px] bg-zinc-700 border-none text-white">
        <SelectValue placeholder="Select Language">
          {selectedLanguage.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-zinc-700 border-none text-white">
        <SelectGroup>
          {languageOptions.map((option) => (
            <SelectItem key={option.id} value={option.value} className="text-white">
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageDropdown;
