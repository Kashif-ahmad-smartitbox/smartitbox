"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getPage,
  getPageWithContent,
  updatePage,
  PageItem2,
  PageWithContentResponse,
  deletePage,
} from "@/services/modules/pageModule";
import {
  updateModule,
  createModule,
  getModules,
} from "@/services/modules/module";
import {
  Save,
  Edit3,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Settings,
  Layers,
  Calendar,
  Link,
  FileText,
  Eye,
  Code,
  RefreshCw,
  Search,
  ArrowLeft,
  Info,
  Globe,
  Type,
  Hash,
  FileCode,
  Text,
  List,
  ToggleLeft,
  Image,
  Plus,
  Trash2,
  Braces,
  Copy,
  Package,
  GripVertical,
  ArrowUp,
  ArrowDown,
  LinkIcon,
  FilePlus,
} from "lucide-react";
import { FaClone } from "react-icons/fa";

// ────────────────────────────────
// Constants & Types
// ────────────────────────────────

type PageStatus = "draft" | "published" | "scheduled";

interface PageFields {
  title: string;
  slug: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: PageStatus;
  publishedAt?: string;
}

interface Module {
  _id: string;
  title: string;
  type: string;
  content: any;
}

interface PageLayoutItem {
  moduleId: string;
  order: number;
  module?: Module;
}

interface PageData {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  type?: "default" | "solutions" | "services" | "policies";
  canonicalUrl?: string;
  status: PageStatus;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  layout?: PageLayoutItem[];
}

interface UpdateMessage {
  type: "success" | "error";
  text: string;
}

type ContentFieldType =
  | "text"
  | "number"
  | "boolean"
  | "array"
  | "object"
  | "rich-text"
  | "image";

interface ContentField {
  key: string;
  type: ContentFieldType;
  value: any;
}

type EditMode = "form" | "json";
type AddModuleMode = "existing" | "clone" | "create";

// ────────────────────────────────
// Utility Functions
// ────────────────────────────────

const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

const formatDisplayDate = (dateString?: string): string => {
  if (!dateString) return "Unknown";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug);
};

const isValidJSON = (
  jsonString: string
): { valid: boolean; error?: string } => {
  try {
    if (!jsonString.trim()) {
      return { valid: false, error: "JSON cannot be empty" };
    }
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "textarea" | "datetime-local";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  icon,
  fullWidth = false,
  helperText,
  error,
  disabled = false,
  readOnly = false, // Add this line
}) => {
  const baseClasses = `
    w-full border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary-500 
    transition-all duration-200 bg-white placeholder-gray-400
    ${
      error
        ? "border-primary-300 focus:ring-primary-500 focus:border-primary-500"
        : "border-gray-300"
    }
    ${disabled || readOnly ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}
    ${icon ? "pl-11" : "pl-4"}
    ${readOnly ? "select-all bg-blue-50 border-blue-200" : ""} // Add this line
  `;

  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
        {required && <span className="text-primary-500 ml-1">*</span>}
        {readOnly && ( // Add this section
          <span className="ml-2 text-xs text-blue-600 font-normal">
            (read-only)
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className={`${baseClasses} resize-none`}
            disabled={disabled || readOnly} // Update this line
            readOnly={readOnly} // Add this line
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={baseClasses}
            disabled={disabled || readOnly}
            readOnly={readOnly}
          />
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-primary-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary-500 
            focus:border-primary-500 transition-all duration-200 bg-white appearance-none
            ${disabled ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}
            ${icon ? "pl-11" : "pl-4"}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────
// Module Content Editor Components
// ────────────────────────────────

interface ArrayFieldEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
}

const ArrayFieldEditor: React.FC<ArrayFieldEditorProps> = ({
  value,
  onChange,
}) => {
  const [items, setItems] = useState<any[]>(value || []);
  const [newItem, setNewItem] = useState("");

  const parseItemValue = (itemValue: string): any => {
    if (!itemValue.trim()) return itemValue;

    try {
      const parsed = JSON.parse(itemValue);
      return parsed;
    } catch {
      return itemValue;
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      const parsedValue = parseItemValue(newItem);
      const updatedItems = [...items, parsedValue];
      setItems(updatedItems);
      onChange(updatedItems);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onChange(updatedItems);
  };

  const updateItem = (index: number, newValue: string) => {
    const parsedValue = parseItemValue(newValue);
    const updatedItems = [...items];
    updatedItems[index] = parsedValue;
    setItems(updatedItems);
    onChange(updatedItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const formatItemForDisplay = (item: any): string => {
    if (typeof item === "object" && item !== null) {
      return JSON.stringify(item);
    }
    return String(item);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={formatItemForDisplay(item)}
            onChange={(e) => updateItem(index, e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none font-mono"
            placeholder="Enter value..."
          />
          <button
            onClick={() => removeItem(index)}
            className="p-2 text-primary-500 hover:text-primary-700 rounded transition-colors"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder='Enter value (use JSON for objects: {"key": "value"})'
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none font-mono"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
          type="button"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
        <strong>Tip:</strong> Use JSON format for objects and arrays. Example:{" "}
        {"{"}&quot;title&quot;: &quot;Example&quot;{"}"}
      </div>
    </div>
  );
};

interface ObjectFieldEditorProps {
  value: any;
  onChange: (value: any) => void;
}

const ObjectFieldEditor: React.FC<ObjectFieldEditorProps> = ({
  value,
  onChange,
}) => {
  const [objectValue, setObjectValue] = useState(() => {
    try {
      return typeof value === "object" && value !== null
        ? JSON.stringify(value, null, 2)
        : "{}";
    } catch {
      return "{}";
    }
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newValue: string) => {
    setObjectValue(newValue);
    setError(null);

    try {
      if (newValue.trim()) {
        const parsed = JSON.parse(newValue);
        onChange(parsed);
      } else {
        onChange({});
      }
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={objectValue}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono outline-none ${
          error ? "border-primary-300" : "border-gray-300"
        }`}
        placeholder='{"key": "value"}'
      />
      {error && <p className="text-sm text-primary-600">{error}</p>}
    </div>
  );
};

interface JSONEditorProps {
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [jsonValue, setJsonValue] = useState(() => {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "{}";
    }
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newValue: string) => {
    setJsonValue(newValue);

    if (disabled) return;

    const validation = isValidJSON(newValue);
    if (validation.valid) {
      setError(null);
      onChange(JSON.parse(newValue));
    } else {
      setError(validation.error || "Invalid JSON");
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonValue(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-800">
          JSON Editor
        </label>
        <button
          onClick={formatJSON}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <Braces className="w-3 h-3" />
          Format JSON
        </button>
      </div>

      <textarea
        value={jsonValue}
        onChange={(e) => handleChange(e.target.value)}
        rows={12}
        disabled={disabled}
        className={`w-full border rounded-lg px-3 py-2 text-sm font-mono outline-none ${
          error ? "border-primary-300 bg-primary-50" : "border-gray-300"
        } ${disabled ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}`}
        placeholder="Enter valid JSON..."
      />

      {error && (
        <div className="flex items-center gap-2 text-sm text-primary-600 bg-primary-50 p-3 rounded border border-primary-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
        <strong>Note:</strong> Changes are validated in real-time. Invalid JSON
        will be highlighted.
      </div>
    </div>
  );
};

interface ModuleContentEditorProps {
  content: any;
  onChange: (content: any) => void;
  editMode: EditMode;
  onEditModeChange: (mode: EditMode) => void;
  disabled?: boolean;
}

const ModuleContentEditor: React.FC<ModuleContentEditorProps> = ({
  content,
  onChange,
  editMode,
  onEditModeChange,
  disabled = false,
}) => {
  const [fields, setFields] = useState<ContentField[]>([]);
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldType, setNewFieldType] = useState<ContentFieldType>("text");

  // Initialize fields from content
  useEffect(() => {
    if (content && typeof content === "object") {
      const initialFields: ContentField[] = Object.entries(content).map(
        ([key, value]) => {
          let type: ContentFieldType = "text";

          if (typeof value === "boolean") type = "boolean";
          else if (typeof value === "number") type = "number";
          else if (Array.isArray(value)) type = "array";
          else if (typeof value === "object" && value !== null) type = "object";
          else type = "text";

          return {
            key,
            type,
            value,
          };
        }
      );
      setFields(initialFields);
    } else {
      setFields([]);
    }
  }, [content]);

  const updateFieldValue = useCallback(
    (index: number, newValue: any) => {
      if (disabled) return;

      setFields((prev) => {
        const updatedFields = [...prev];
        updatedFields[index].value = newValue;

        const newContent: any = {};
        updatedFields.forEach((field) => {
          newContent[field.key] = field.value;
        });
        onChange(newContent);

        return updatedFields;
      });
    },
    [onChange, disabled]
  );

  const addField = () => {
    if (disabled || !newFieldKey.trim()) return;

    const key = newFieldKey.trim();

    if (fields.some((field) => field.key === key)) {
      alert("Field key must be unique");
      return;
    }

    let defaultValue: any = "";
    switch (newFieldType) {
      case "number":
        defaultValue = 0;
        break;
      case "boolean":
        defaultValue = false;
        break;
      case "array":
        defaultValue = [];
        break;
      case "object":
        defaultValue = {};
        break;
      default:
        defaultValue = "";
    }

    const newField: ContentField = {
      key,
      type: newFieldType,
      value: defaultValue,
    };

    const updatedFields = [...fields, newField];
    setFields(updatedFields);

    const newContent: any = { ...content, [key]: defaultValue };
    onChange(newContent);

    setNewFieldKey("");
  };

  const removeField = (index: number) => {
    if (disabled) return;

    const fieldToRemove = fields[index];
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);

    const newContent = { ...content };
    delete newContent[fieldToRemove.key];
    onChange(newContent);
  };

  const getFieldIcon = (type: ContentFieldType) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case "text":
        return <Text {...iconProps} />;
      case "number":
        return <Hash {...iconProps} />;
      case "boolean":
        return <ToggleLeft {...iconProps} />;
      case "array":
        return <List {...iconProps} />;
      case "object":
        return <FileCode {...iconProps} />;
      case "rich-text":
        return <FileText {...iconProps} />;
      case "image":
        return <Image {...iconProps} />;
      default:
        return <Text {...iconProps} />;
    }
  };

  const renderFieldInput = (field: ContentField, index: number) => {
    const baseInputClasses = `w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none ${
      disabled ? "bg-gray-50 cursor-not-allowed opacity-70" : ""
    }`;

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={field.value || ""}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            className={baseInputClasses}
            placeholder={`Enter ${field.key}...`}
            disabled={disabled}
          />
        );

      case "rich-text":
        return (
          <textarea
            value={field.value || ""}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            rows={4}
            className={baseInputClasses}
            placeholder={`Enter ${field.key}...`}
            disabled={disabled}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={field.value || 0}
            onChange={(e) =>
              updateFieldValue(index, parseFloat(e.target.value) || 0)
            }
            className={baseInputClasses}
            disabled={disabled}
          />
        );

      case "boolean":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.value || false}
              onChange={(e) => updateFieldValue(index, e.target.checked)}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={disabled}
            />
            <span className="text-sm text-gray-700">
              {field.value ? "True" : "False"}
            </span>
          </label>
        );

      case "array":
        return (
          <ArrayFieldEditor
            value={Array.isArray(field.value) ? field.value : []}
            onChange={(newValue) => updateFieldValue(index, newValue)}
          />
        );

      case "object":
        return (
          <ObjectFieldEditor
            value={field.value}
            onChange={(newValue) => updateFieldValue(index, newValue)}
          />
        );

      case "image":
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={field.value || ""}
              onChange={(e) => updateFieldValue(index, e.target.value)}
              placeholder="Enter image URL..."
              className={baseInputClasses}
              disabled={disabled}
            />
            {field.value && (
              <div className="mt-2">
                <img
                  src={field.value}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={field.value || ""}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            className={baseInputClasses}
            disabled={disabled}
          />
        );
    }
  };

  const handleAddFieldKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addField();
    }
  };

  return (
    <div className="space-y-6">
      {/* Edit Mode Toggle */}
      {!disabled && (
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => onEditModeChange("form")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
              editMode === "form"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            type="button"
          >
            <Settings className="w-4 h-4" />
            Form Editor
          </button>
          <button
            onClick={() => onEditModeChange("json")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
              editMode === "json"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            type="button"
          >
            <Braces className="w-4 h-4" />
            JSON Editor
          </button>
        </div>
      )}

      {editMode === "form" ? (
        <>
          {/* Existing Fields */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.key}
                className="border border-gray-200 rounded-xl p-4 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getFieldIcon(field.type)}
                    <span className="font-semibold text-gray-900 text-sm">
                      {field.key}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      {field.type}
                    </span>
                  </div>
                  {!disabled && (
                    <button
                      onClick={() => removeField(index)}
                      className="text-primary-500 hover:text-primary-700 p-1 rounded transition-colors"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {renderFieldInput(field, index)}
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No content fields defined yet
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {disabled
                    ? "This module has no content fields"
                    : "Add your first field below"}
                </p>
              </div>
            )}
          </div>

          {/* Add New Field */}
          {!disabled && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Field
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6">
                  <input
                    type="text"
                    value={newFieldKey}
                    onChange={(e) => setNewFieldKey(e.target.value)}
                    onKeyPress={handleAddFieldKeyPress}
                    placeholder="Field key (e.g., title)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Unique identifier
                  </p>
                </div>

                <div className="md:col-span-4">
                  <div className="relative">
                    <select
                      value={newFieldType}
                      onChange={(e) =>
                        setNewFieldType(e.target.value as ContentFieldType)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white appearance-none pr-10 transition-all duration-200 hover:border-gray-400"
                    >
                      <option value="text">📝 Text</option>
                      <option value="rich-text">📄 Rich Text</option>
                      <option value="number">🔢 Number</option>
                      <option value="boolean">✅ Boolean</option>
                      <option value="array">📋 Array</option>
                      <option value="object">⚙️ Object</option>
                      <option value="image">🖼️ Image URL</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Data Type
                  </p>
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={addField}
                    disabled={!newFieldKey.trim()}
                    className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <JSONEditor value={content} onChange={onChange} disabled={disabled} />
      )}

      {/* JSON Preview */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Code className="w-4 h-4" />
          JSON Preview
        </h4>
        <pre className="text-xs bg-gray-50 p-3 rounded-lg border border-gray-200 overflow-auto max-h-40">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// ────────────────────────────────
// Confirmation Modal Component
// ────────────────────────────────

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertCircle className="w-6 h-6 text-primary-600" />,
          button: "bg-primary-600 hover:bg-primary-700",
          background: "bg-primary-50",
        };
      case "warning":
        return {
          icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
          button: "bg-yellow-600 hover:bg-yellow-700",
          background: "bg-yellow-50",
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-blue-600" />,
          button: "bg-blue-600 hover:bg-blue-700",
          background: "bg-blue-50",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${styles.background}`}>
              {styles.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 mt-1">{message}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              type="button"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${styles.button}`}
              type="button"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DeletePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pageTitle: string;
  isDeleting: boolean;
}

const DeletePageModal: React.FC<DeletePageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  pageTitle,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Delete Page</h3>
              <p className="text-gray-600 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-xl">
            <p className="text-primary-800 font-medium">
              Are you sure you want to delete the page "
              <span className="font-bold">{pageTitle}</span>"?
            </p>
            <div className="mt-3 text-sm text-primary-700 space-y-1">
              <p className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                All page data will be permanently removed
              </p>
              <p className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Modules will not be deleted (they can be reused)
              </p>
              <p className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                This action is irreversible
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              type="button"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Page
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddModule: (moduleId: string) => void;
  currentPageId: string;
}

const AddModuleModal: React.FC<AddModuleModalProps> = ({
  isOpen,
  onClose,
  onAddModule,
  currentPageId,
}) => {
  const [mode, setMode] = useState<AddModuleMode>("existing");
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleType, setNewModuleType] = useState("");
  const [newModuleContent, setNewModuleContent] = useState<any>({});
  const [creatingModule, setCreatingModule] = useState(false);
  const [message, setMessage] = useState<UpdateMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      loadAvailableModules();
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    resetForm();
  }, [mode]);

  const resetForm = () => {
    setSelectedModuleId("");
    setNewModuleTitle("");
    setNewModuleType("");
    setNewModuleContent({});
    setMessage(null);
    setSearchTerm(""); // Reset search term when mode changes
  };

  const loadAvailableModules = async () => {
    setLoadingModules(true);
    try {
      const getModulesList = await getModules();
      setAvailableModules(getModulesList.items);
    } catch (error) {
      console.error("Failed to load modules:", error);
      setMessage({ type: "error", text: "Failed to load available modules" });
    } finally {
      setLoadingModules(false);
    }
  };

  // Filter modules based on search term
  const filteredModules = availableModules.filter((module) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      module.title?.toLowerCase().includes(searchLower) ||
      module.type?.toLowerCase().includes(searchLower) ||
      module._id?.toLowerCase().includes(searchLower) ||
      JSON.stringify(module.content || {})
        .toLowerCase()
        .includes(searchLower)
    );
  });

  const handleAddExistingModule = () => {
    if (!selectedModuleId) {
      setMessage({ type: "error", text: "Please select a module to add" });
      return;
    }

    onAddModule(selectedModuleId);
    setMessage({ type: "success", text: "Module added successfully!" });

    // Close modal after a brief delay to show success message
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleCloneModule = async () => {
    if (!selectedModuleId) {
      setMessage({ type: "error", text: "Please select a module to clone" });
      return;
    }

    if (!newModuleTitle.trim()) {
      setMessage({ type: "error", text: "Module title is required" });
      return;
    }

    setCreatingModule(true);
    setMessage(null);

    try {
      const selectedModule = availableModules.find(
        (module) => module._id === selectedModuleId
      );

      if (!selectedModule) {
        setMessage({ type: "error", text: "Selected module not found" });
        return;
      }

      // Create a clone of the selected module
      const response = await createModule({
        type: selectedModule.type,
        title: newModuleTitle.trim(),
        content: selectedModule.content || {},
        status: "published",
      });

      setMessage({ type: "success", text: "Module cloned successfully!" });

      // Add the new module to the page
      setTimeout(() => {
        onAddModule(response.module._id);
      }, 1000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to clone module",
      });
    } finally {
      setCreatingModule(false);
    }
  };

  const handleCreateNewModule = async () => {
    if (!newModuleTitle.trim()) {
      setMessage({ type: "error", text: "Module title is required" });
      return;
    }

    if (!newModuleType.trim()) {
      setMessage({ type: "error", text: "Module type is required" });
      return;
    }

    setCreatingModule(true);
    setMessage(null);

    try {
      const response = await createModule({
        type: newModuleType.trim(),
        title: newModuleTitle.trim(),
        content: newModuleContent || {},
        status: "published",
      });

      setMessage({ type: "success", text: "Module created successfully!" });

      // Add the new module to the page
      setTimeout(() => {
        onAddModule(response.module._id);
      }, 1000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to create module",
      });
    } finally {
      setCreatingModule(false);
    }
  };

  const handleContentChange = (newContent: any) => {
    setNewModuleContent(newContent);
  };

  const selectedModule = availableModules.find(
    (module) => module._id === selectedModuleId
  );

  const getModeConfig = () => {
    switch (mode) {
      case "existing":
        return {
          title: "Use Existing Module",
          description: "Select an existing module to add to this page",
          icon: <LinkIcon className="w-5 h-5" />,
          buttonText: "Add Module",
          buttonAction: handleAddExistingModule,
          disabled: !selectedModuleId,
        };
      case "clone":
        return {
          title: "Clone Existing Module",
          description: "Create a copy of an existing module with a new title",
          icon: <FaClone className="w-5 h-5" />,
          buttonText: creatingModule ? "Cloning..." : "Clone & Add Module",
          buttonAction: handleCloneModule,
          disabled:
            !selectedModuleId || !newModuleTitle.trim() || creatingModule,
        };
      case "create":
        return {
          title: "Create New Module",
          description: "Create a completely new module from scratch",
          icon: <FilePlus className="w-5 h-5" />,
          buttonText: creatingModule ? "Creating..." : "Create & Add Module",
          buttonAction: handleCreateNewModule,
          disabled:
            !newModuleTitle.trim() || !newModuleType.trim() || creatingModule,
        };
      default:
        return {
          title: "",
          description: "",
          icon: null,
          buttonText: "",
          buttonAction: () => {},
          disabled: true,
        };
    }
  };

  const modeConfig = getModeConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Module</h2>
                <p className="text-gray-500">Add a new module to this page</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Mode Selection */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode("existing")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                mode === "existing"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              type="button"
            >
              <LinkIcon className="w-4 h-4" />
              Use Existing
            </button>
            <button
              onClick={() => setMode("clone")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                mode === "clone"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              type="button"
            >
              <FaClone className="w-4 h-4" />
              Clone Module
            </button>
            <button
              onClick={() => setMode("create")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                mode === "create"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              type="button"
            >
              <FilePlus className="w-4 h-4" />
              Create New
            </button>
          </div>

          {/* Mode Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              {modeConfig.icon}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {modeConfig.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {modeConfig.description}
                </p>
              </div>
            </div>

            {/* Module Selection for Existing and Clone modes */}
            {(mode === "existing" || mode === "clone") && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Select Module</h4>

                {/* Search Input for Modules */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search modules by title, type, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none transition-all duration-200 bg-white"
                  />
                </div>

                {loadingModules ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">
                      Loading available modules...
                    </p>
                  </div>
                ) : filteredModules.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-4">
                    {filteredModules.map((module) => (
                      <label
                        key={module._id}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="moduleSelection"
                          value={module._id}
                          checked={selectedModuleId === module._id}
                          onChange={(e) => {
                            setSelectedModuleId(e.target.value);
                            if (mode === "clone") {
                              setNewModuleTitle(`${module.title} (Copy)`);
                            }
                          }}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {module.title}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                              {module.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            ID: {module._id}
                          </p>
                          {module.content &&
                            Object.keys(module.content).length > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                {Object.keys(module.content).length} field(s)
                              </p>
                            )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {searchTerm
                        ? "No modules match your search"
                        : "No modules available"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Create a new module instead"}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-3 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        type="button"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Module Title Input for Clone and Create modes */}
            {(mode === "clone" || mode === "create") && (
              <InputField
                label="Module Title"
                value={newModuleTitle}
                onChange={setNewModuleTitle}
                placeholder="Enter module title..."
                required
                helperText="A descriptive title for this module"
              />
            )}

            {/* Module Type Input for Create mode */}
            {mode === "create" && (
              <InputField
                label="Module Type"
                value={newModuleType}
                onChange={setNewModuleType}
                placeholder="e.g., hero, card, banner"
                required
                helperText="The type of module (hero, card, banner, etc.)"
              />
            )}

            {/* Module Content Editor for Create mode */}
            {mode === "create" && (
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Module Content
                </h4>
                <ModuleContentEditor
                  content={newModuleContent}
                  onChange={handleContentChange}
                  editMode="form"
                  onEditModeChange={() => {}}
                />
              </div>
            )}

            {/* Preview for Existing and Clone modes */}
            {(mode === "existing" || mode === "clone") && selectedModule && (
              <div className="bg-gray-50 p-4 rounded-xl border">
                <h5 className="font-semibold text-gray-900 text-sm mb-3">
                  Module Preview
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">
                      {selectedModule.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fields:</span>
                    <span className="ml-2 font-medium">
                      {Object.keys(selectedModule.content || {}).length}
                    </span>
                  </div>
                </div>
                {selectedModule.content &&
                  Object.keys(selectedModule.content).length > 0 && (
                    <div className="mt-2">
                      <h6 className="text-xs font-semibold text-gray-600 mb-2">
                        Content Preview:
                      </h6>
                      <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                        {JSON.stringify(selectedModule.content, null, 2)}
                      </pre>
                    </div>
                  )}
              </div>
            )}
          </div>

          {message && (
            <div
              className={`mt-4 p-4 rounded-xl border flex items-center gap-3 ${
                message.type === "error"
                  ? "bg-primary-50 text-primary-800 border-primary-200"
                  : "bg-green-50 text-green-800 border-green-200"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle className="w-5 h-5 shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              type="button"
            >
              Cancel
            </button>

            <button
              onClick={modeConfig.buttonAction}
              disabled={modeConfig.disabled}
              className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 ${
                modeConfig.disabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25"
              }`}
              type="button"
            >
              {creatingModule ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {mode === "clone" ? "Cloning..." : "Creating..."}
                </>
              ) : (
                modeConfig.buttonText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────
// Reorder Modal Component
// ────────────────────────────────

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReorder: (newOrder: string[]) => void;
  modules: PageLayoutItem[];
}

const ReorderModal: React.FC<ReorderModalProps> = ({
  isOpen,
  onClose,
  onReorder,
  modules,
}) => {
  const [reorderedModules, setReorderedModules] = useState<PageLayoutItem[]>(
    []
  );

  useEffect(() => {
    if (isOpen) {
      setReorderedModules([...modules].sort((a, b) => a.order - b.order));
    }
  }, [isOpen, modules]);

  const moveModule = (fromIndex: number, toIndex: number) => {
    const newModules = [...reorderedModules];
    const [movedModule] = newModules.splice(fromIndex, 1);
    newModules.splice(toIndex, 0, movedModule);
    setReorderedModules(newModules);
  };

  const handleSave = () => {
    const moduleIds = reorderedModules.map((item) => item.moduleId);
    onReorder(moduleIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <GripVertical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Reorder Modules
                </h2>
                <p className="text-gray-500">
                  Drag and drop to reorder modules
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {reorderedModules.map((item, index) => (
              <div
                key={item.moduleId}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white"
              >
                <div className="flex items-center gap-3 text-gray-400">
                  <GripVertical className="w-5 h-5 cursor-grab" />
                  <span className="text-sm font-medium w-8 text-center">
                    {index + 1}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {item.module?.title || "Untitled Module"}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      {item.module?.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">ID: {item.moduleId}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveModule(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      moveModule(
                        index,
                        Math.min(reorderedModules.length - 1, index + 1)
                      )
                    }
                    disabled={index === reorderedModules.length - 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/25"
              type="button"
            >
              Save Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────
// Main Component
// ────────────────────────────────

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // ────────────────────────────────
  // State Management
  // ────────────────────────────────
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [pageDataWithoutContent, setPageDataWithoutContent] =
    useState<PageItem2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pageFields, setPageFields] = useState<PageFields>({
    title: "",
    slug: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    status: "draft",
    publishedAt: "",
  });

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PageFields, string>>
  >({});
  const [updatingPage, setUpdatingPage] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<UpdateMessage | null>(null);
  const [activeTab, setActiveTab] = useState<"settings" | "modules">(
    "settings"
  );

  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<any>({});
  const [editMode, setEditMode] = useState<EditMode>("form");
  const [savingModule, setSavingModule] = useState(false);
  const [moduleMsg, setModuleMsg] = useState<UpdateMessage | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  // Add Module Modal State
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [addingModule, setAddingModule] = useState(false);

  // Remove Module State
  const [moduleToRemove, setModuleToRemove] = useState<string | null>(null);
  const [removingModule, setRemovingModule] = useState(false);

  // Reorder Modal State
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderingModules, setReorderingModules] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPage, setDeletingPage] = useState(false);

  const handleDeletePage = async () => {
    setDeletingPage(true);

    try {
      const deleteFn = deletePage as unknown as (
        id: string
      ) => Promise<{ success: boolean; message: string }>;

      await deleteFn(id);

      setUpdateMsg({
        type: "success",
        text: "Page deleted successfully!",
      });

      setTimeout(() => {
        router.push("/admin/dashboard/content/pages");
      }, 1500);
    } catch (err: any) {
      setUpdateMsg({
        type: "error",
        text: err.message || "Failed to delete page",
      });
      setDeletingPage(false);
    }
  };

  const getPageData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const base: PageItem2 = await getPage(id);

      setPageDataWithoutContent(base);

      const slug = base?.page?.slug;

      if (!slug) {
        throw new Error("Page slug not found");
      }

      let fullPageData: PageData | null = null;

      try {
        const full: PageWithContentResponse = await getPageWithContent(slug);
        fullPageData = full.page as PageData;
      } catch (err) {
        console.log("getPageWithContent failed, using base page data");
        fullPageData = {
          ...base.page,
          layout: [],
        } as PageData;
      }

      const page = fullPageData || base.page;
      setPageData(page as PageData);
      setPageFields({
        title: page.title || "",
        slug: page.slug || "",
        excerpt: page.excerpt || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        canonicalUrl: page.canonicalUrl || "",
        status: (page.status as PageStatus) || "draft",
        publishedAt: formatDateForInput(page.publishedAt),
      });
    } catch (err: any) {
      setError(err.message || "Failed to load page");
      console.error("Error fetching page:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getPageData();
  }, [getPageData]);

  // ────────────────────────────────
  // Validation
  // ────────────────────────────────
  const validateFields = (): boolean => {
    const errors: Partial<Record<keyof PageFields, string>> = {};

    if (!pageFields.title.trim()) {
      errors.title = "Title is required";
    }

    if (!pageFields.slug.trim()) {
      errors.slug = "Slug is required";
    } else if (!isValidSlug(pageFields.slug)) {
      errors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (pageFields.canonicalUrl && !isValidUrl(pageFields.canonicalUrl)) {
      errors.canonicalUrl = "Please enter a valid URL";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ────────────────────────────────
  // Page Update
  // ────────────────────────────────
  const handlePageUpdate = async () => {
    if (!validateFields()) {
      setUpdateMsg({ type: "error", text: "Please fix the errors above" });
      return;
    }

    setUpdatingPage(true);
    setUpdateMsg(null);

    try {
      let canonicalUrl = pageFields.canonicalUrl?.trim() || undefined;
      if (canonicalUrl && !/^https?:\/\//i.test(canonicalUrl)) {
        canonicalUrl = `https://${canonicalUrl}`;
      }

      await updatePage(id, {
        title: pageFields.title.trim(),
        slug: pageFields.slug.trim(),
        excerpt: pageFields.excerpt?.trim() || undefined,
        metaTitle: pageFields.metaTitle?.trim() || undefined,
        metaDescription: pageFields.metaDescription?.trim() || undefined,
        canonicalUrl,
        status: pageFields.status as "draft" | "published" | "archived",
        publishedAt: pageFields.publishedAt
          ? new Date(pageFields.publishedAt).toISOString()
          : null,
      });

      setUpdateMsg({ type: "success", text: "Page updated successfully!" });
      await getPageData();
    } catch (err: any) {
      setUpdateMsg({
        type: "error",
        text: err.message || "Failed to update page",
      });
    } finally {
      setUpdatingPage(false);
    }
  };

  // ────────────────────────────────
  // Module Management
  // ────────────────────────────────
  const startEdit = (module: Module) => {
    setEditingModuleId(module._id);
    setEditContent(module.content || {});
    setEditMode("form");
    setModuleMsg(null);
  };

  const cancelEdit = () => {
    setEditingModuleId(null);
    setEditContent({});
    setEditMode("form");
  };

  const handleModuleUpdate = async (
    moduleId: string,
    type: string,
    title: string
  ) => {
    setSavingModule(true);
    setModuleMsg(null);

    try {
      // Ensure we're sending valid JSON content
      const contentToSave =
        editContent && typeof editContent === "object" ? editContent : {};

      await updateModule(moduleId, {
        type,
        title,
        content: contentToSave,
      });

      setModuleMsg({ type: "success", text: "Module updated successfully!" });
      setEditingModuleId(null);
      setEditMode("form");
      await getPageData();
    } catch (err: any) {
      setModuleMsg({
        type: "error",
        text: err.message || "Failed to update module",
      });
    } finally {
      setSavingModule(false);
    }
  };

  const handleContentChange = useCallback((newContent: any) => {
    setEditContent(newContent);
  }, []);

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(moduleId)) {
        newExpanded.delete(moduleId);
      } else {
        newExpanded.add(moduleId);
      }
      return newExpanded;
    });
  };

  // ────────────────────────────────
  // Add Module Functionality
  // ────────────────────────────────
  const handleAddModule = async (moduleId: string) => {
    if (!pageData) return;

    setAddingModule(true);

    try {
      const base: PageItem2 = await getPage(id);

      const nextOrder = base.page.layout.length + 1;

      const newLayoutItem = {
        moduleId,
        order: nextOrder,
      };

      const updatedLayout = [...base.page.layout, newLayoutItem];

      await updatePage(id, {
        layout: updatedLayout,
      });

      setUpdateMsg({ type: "success", text: "Module added successfully!" });
      setShowAddModuleModal(false);
      await getPageData();
    } catch (err: any) {
      setUpdateMsg({
        type: "error",
        text: err.message || "Failed to add module to page",
      });
    } finally {
      setAddingModule(false);
    }
  };

  // ────────────────────────────────
  // Remove Module Functionality
  // ────────────────────────────────
  const handleRemoveModule = async () => {
    if (!moduleToRemove || !pageData) return;

    setRemovingModule(true);

    try {
      const base: PageItem2 = await getPage(id);

      // Filter out the module to remove
      const updatedLayout = base.page.layout.filter(
        (item: PageLayoutItem) => item.moduleId !== moduleToRemove
      );

      // Reorder the remaining modules
      const reorderedLayout = updatedLayout.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      await updatePage(id, {
        layout: reorderedLayout,
      });

      setUpdateMsg({ type: "success", text: "Module removed successfully!" });
      setModuleToRemove(null);
      await getPageData();
    } catch (err: any) {
      setUpdateMsg({
        type: "error",
        text: err.message || "Failed to remove module",
      });
    } finally {
      setRemovingModule(false);
    }
  };

  const handleReorderModules = async (newOrder: string[]) => {
    if (!pageData) return;

    setReorderingModules(true);

    try {
      const newLayout = newOrder.map((moduleId, index) => ({
        moduleId,
        order: index + 1,
      }));

      await updatePage(id, {
        layout: newLayout,
      });

      setUpdateMsg({
        type: "success",
        text: "Modules reordered successfully!",
      });
      setShowReorderModal(false);
      await getPageData();
    } catch (err: any) {
      setUpdateMsg({
        type: "error",
        text: err.message || "Failed to reorder modules",
      });
    } finally {
      setReorderingModules(false);
    }
  };

  // ────────────────────────────────
  // Computed Values
  // ────────────────────────────────
  const filteredModules =
    pageData?.layout?.filter((item: PageLayoutItem) => {
      const moduleData = item.module;
      if (!moduleData) return false;

      const searchLower = searchTerm.toLowerCase();

      return (
        moduleData.title?.toLowerCase().includes(searchLower) ||
        moduleData.type?.toLowerCase().includes(searchLower) ||
        JSON.stringify(moduleData.content).toLowerCase().includes(searchLower)
      );
    }) || [];

  const isDraftWithoutModules =
    pageFields.status === "draft" &&
    (!pageData?.layout || pageData.layout.length === 0);

  const moduleCount = pageData?.layout?.length || 0;

  // ────────────────────────────────
  // Loading State
  // ────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-linear-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Loading Page</h3>
          <p className="text-gray-500 max-w-sm">
            Fetching page details and content...
          </p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────
  // Error State
  // ────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-md text-center">
          <div className="mx-auto w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <AlertCircle className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Page
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={getPageData}
              className="px-8 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold flex items-center gap-3 shadow-lg shadow-primary-600/25"
              type="button"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="px-8 py-3.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center gap-3 border border-gray-300 shadow-sm"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <button
            onClick={() => router.back()}
            className="px-8 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold"
            type="button"
          >
            Return to Previous Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-3 hover:bg-white rounded-xl transition-all duration-200 border border-gray-200 bg-white/50 backdrop-blur-sm"
                type="button"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight line-clamp-1 capitalize">
                  {pageFields.title || "Untitled Page"}
                </h1>

                <div className="flex items-center gap-4 mt-3">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize border ${
                      pageFields.status === "published"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : pageFields.status === "scheduled"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {pageFields.status}
                  </span>

                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Slug:{" "}
                    <span className="font-mono bg-gray-100 px-3 py-1.5 rounded-lg text-gray-800 border">
                      {pageData.slug === "home" ? "/" : `/${pageData.slug}`}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white rounded-2xl border border-gray-200 p-2">
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === "settings"
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                type="button"
              >
                <Settings className="w-4 h-4" />
                Page Settings
              </button>

              <button
                onClick={() => setActiveTab("modules")}
                disabled={isDraftWithoutModules}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === "modules"
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                    : isDraftWithoutModules
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                type="button"
              >
                <Layers className="w-4 h-4" />
                Modules ({moduleCount})
                {isDraftWithoutModules && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-md ml-2">
                    Publish to view
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={getPageData}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200"
                  type="button"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={pageFields.status !== "published"}
                  type="button"
                >
                  <Eye className="w-4 h-4" />
                  View Live Page
                  {pageFields.status !== "published" && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-md ml-auto">
                      {pageFields.status}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Page Status
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDisplayDate(pageData.updatedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {pageData.createdAt
                      ? new Date(pageData.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "Unknown"}
                  </p>
                </div>

                {isDraftWithoutModules && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800 font-medium">
                      Modules are only available for published pages
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deletingPage}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
              Delete This Page
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="xl:col-span-3">
            {/* PAGE SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Settings className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Page Settings
                      </h2>
                      <p className="text-gray-500">
                        Manage your page details, SEO settings, and publication
                        status
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-8">
                  {/* Basic Information */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Type className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Basic Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Title"
                        value={pageFields.title}
                        onChange={(value) =>
                          setPageFields({ ...pageFields, title: value })
                        }
                        placeholder="Enter page title"
                        required
                        icon={<Type className="w-4 h-4" />}
                        error={fieldErrors.title}
                      />

                      <InputField
                        label="Slug"
                        value={
                          pageFields.slug === "home"
                            ? "/"
                            : pageData.type !== "default"
                            ? `/${pageData.type}/${pageFields.slug}`
                            : `/${pageFields.slug}`
                        }
                        onChange={(value) =>
                          setPageFields({ ...pageFields, slug: value })
                        }
                        placeholder="page-slug"
                        required
                        icon={<Hash className="w-4 h-4" />}
                        error={fieldErrors.slug}
                        readOnly={true}
                      />

                      <InputField
                        label="Excerpt"
                        value={pageFields.excerpt || ""}
                        onChange={(value) =>
                          setPageFields({ ...pageFields, excerpt: value })
                        }
                        placeholder="Brief description of your page"
                        type="textarea"
                        fullWidth
                      />
                    </div>
                  </section>

                  {/* SEO Settings */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        SEO Settings
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Meta Title"
                        value={pageFields.metaTitle || ""}
                        onChange={(value) =>
                          setPageFields({ ...pageFields, metaTitle: value })
                        }
                        placeholder="SEO title for search engines"
                        icon={<Type className="w-4 h-4" />}
                        helperText="Recommended: 50-60 characters"
                      />

                      <InputField
                        label="Meta Description"
                        value={pageFields.metaDescription || ""}
                        onChange={(value) =>
                          setPageFields({
                            ...pageFields,
                            metaDescription: value,
                          })
                        }
                        placeholder="SEO description for search engines"
                        type="textarea"
                        fullWidth
                        helperText="Recommended: 150-160 characters"
                      />

                      <InputField
                        label="Canonical URL"
                        value={pageFields.canonicalUrl || ""}
                        onChange={(value) =>
                          setPageFields({ ...pageFields, canonicalUrl: value })
                        }
                        placeholder="https://yourwebsite.com/page"
                        fullWidth
                        icon={<Link className="w-4 h-4" />}
                        error={fieldErrors.canonicalUrl}
                        helperText="The preferred version of this page for SEO"
                      />
                    </div>
                  </section>

                  {/* Publication Settings */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Publication Settings
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectField
                        label="Status"
                        value={pageFields.status}
                        onChange={(value) =>
                          setPageFields({
                            ...pageFields,
                            status: value as PageStatus,
                          })
                        }
                        options={[
                          { value: "draft", label: "Draft" },
                          { value: "published", label: "Published" },
                          { value: "scheduled", label: "Scheduled" },
                        ]}
                        icon={<Calendar className="w-4 h-4" />}
                      />

                      <InputField
                        label="Published At"
                        value={pageFields.publishedAt || ""}
                        onChange={(value) =>
                          setPageFields({ ...pageFields, publishedAt: value })
                        }
                        type="datetime-local"
                        icon={<Calendar className="w-4 h-4" />}
                      />
                    </div>

                    {isDraftWithoutModules && (
                      <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-1">
                              Modules Visibility
                            </h4>
                            <p className="text-blue-800 text-sm leading-relaxed">
                              Modules are only visible and editable when the
                              page is published. Change the status to
                              &quot;Published&quot; to view and manage modules.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 bg-linear-to-r from-gray-50 to-white px-8 py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      {updateMsg && (
                        <div
                          className={`flex items-center gap-3 p-4 rounded-xl border ${
                            updateMsg.type === "success"
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-primary-50 text-primary-800 border-primary-200"
                          }`}
                        >
                          {updateMsg.type === "success" ? (
                            <CheckCircle className="w-5 h-5 shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                          )}
                          <span className="font-medium">{updateMsg.text}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handlePageUpdate}
                      disabled={updatingPage}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 min-w-40 justify-center ${
                        updatingPage
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/25"
                      }`}
                      type="button"
                    >
                      {updatingPage ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Update Page
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULES SECTION */}
            {activeTab === "modules" && (
              <div className="animate-fadeIn space-y-6">
                {/* Modules Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                        <Layers className="w-6 h-6 text-white" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Page Modules
                        </h2>
                        <p className="text-gray-500">
                          {isDraftWithoutModules
                            ? "Modules available after publishing"
                            : `${moduleCount} module${
                                moduleCount !== 1 ? "s" : ""
                              } found`}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {!isDraftWithoutModules && (
                        <div className="relative">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search modules by title, type, or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none w-80 transition-all duration-200 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    {/* Reorder Button */}
                    {!isDraftWithoutModules && moduleCount > 1 && (
                      <button
                        onClick={() => setShowReorderModal(true)}
                        className="flex items-center gap-3 px-4 py-2 bg-linear-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg shadow-gray-500/25 mr-2 cursor-pointer text-sm"
                        type="button"
                      >
                        <GripVertical className="w-4 h-4" />
                        Reorder
                      </button>
                    )}

                    {/* Add Module Button */}
                    {!isDraftWithoutModules && (
                      <button
                        onClick={() => setShowAddModuleModal(true)}
                        className="flex items-center gap-3 px-4 py-2 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/25 cursor-pointer text-sm"
                        type="button"
                      >
                        <Plus className="w-4 h-4" />
                        Add Module
                      </button>
                    )}
                  </div>
                </div>

                {/* Modules Content */}
                {isDraftWithoutModules ? (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <Layers className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Modules Not Available
                      </h3>
                      <p className="text-gray-500 mb-8 leading-relaxed">
                        Page modules are only visible when the page is
                        published. Please change the page status to
                        &quot;Published&quot; in the Page Settings to view and
                        manage modules.
                      </p>
                      <button
                        onClick={() => setActiveTab("settings")}
                        className="px-8 py-3.5 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/25"
                        type="button"
                      >
                        Go to Page Settings
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredModules.length > 0 ? (
                      filteredModules.map(
                        (item: PageLayoutItem, index: number) => {
                          const moduleData = item.module;
                          if (!moduleData) return null;

                          const isEditing = editingModuleId === moduleData._id;
                          const isExpanded = expandedModules.has(
                            moduleData._id
                          );

                          return (
                            <div
                              key={moduleData._id}
                              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                      {moduleData.title || "Untitled Module"}
                                    </h3>
                                    <span className="text-xs bg-linear-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm">
                                      {moduleData.type}
                                    </span>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-semibold">
                                      Order: {index + 1}
                                    </span>
                                  </div>

                                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <Hash className="w-4 h-4" />
                                    Module ID:{" "}
                                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-800 border">
                                      {moduleData._id}
                                    </span>
                                  </p>

                                  {/* Quick Actions */}
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() =>
                                        toggleModuleExpansion(moduleData._id)
                                      }
                                      className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                                      type="button"
                                    >
                                      <Code className="w-3 h-3" />
                                      {isExpanded ? "Collapse" : "Expand"} JSON
                                      {isExpanded ? (
                                        <ChevronUp className="w-3 h-3" />
                                      ) : (
                                        <ChevronDown className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {!isEditing ? (
                                    <>
                                      <button
                                        onClick={() => startEdit(moduleData)}
                                        className="flex items-center gap-2 px-5 py-2 text-xs bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold cursor-pointer"
                                        type="button"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Content
                                      </button>
                                      <button
                                        onClick={() =>
                                          setModuleToRemove(moduleData._id)
                                        }
                                        className="flex items-center gap-2 px-5 py-2 text-xs bg-transparent text-primary-500 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold border border-primary-300 hover:text-white cursor-pointer"
                                        type="button"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={cancelEdit}
                                      className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold border border-gray-300"
                                      type="button"
                                    >
                                      <X className="w-4 h-4" />
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Module Content Display */}
                              {!isEditing && (
                                <div
                                  className={`mt-4 transition-all duration-200 ${
                                    isExpanded
                                      ? "block"
                                      : "max-h-32 overflow-hidden"
                                  }`}
                                >
                                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <pre className="text-sm text-gray-700 overflow-auto font-mono">
                                      {JSON.stringify(
                                        moduleData.content,
                                        null,
                                        2
                                      )}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {/* Edit Mode */}
                              {isEditing && (
                                <div className="mt-6 space-y-4">
                                  <div>
                                    <div className="border border-gray-300 rounded-xl p-4 bg-white">
                                      <ModuleContentEditor
                                        content={editContent}
                                        onChange={handleContentChange}
                                        editMode={editMode}
                                        onEditModeChange={setEditMode}
                                      />
                                    </div>
                                  </div>

                                  {moduleMsg && (
                                    <div
                                      className={`p-4 rounded-xl border flex items-center gap-3 ${
                                        moduleMsg.type === "error"
                                          ? "bg-primary-50 text-primary-800 border-primary-200"
                                          : "bg-green-50 text-green-800 border-green-200"
                                      }`}
                                    >
                                      {moduleMsg.type === "error" ? (
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                      ) : (
                                        <CheckCircle className="w-5 h-5 shrink-0" />
                                      )}
                                      <span className="font-medium">
                                        {moduleMsg.text}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                      onClick={cancelEdit}
                                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-300"
                                      type="button"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleModuleUpdate(
                                          moduleData._id,
                                          moduleData.type,
                                          moduleData.title
                                        )
                                      }
                                      disabled={savingModule}
                                      className={`flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 ${
                                        savingModule
                                          ? "bg-gray-400 cursor-not-allowed"
                                          : "bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25"
                                      }`}
                                      type="button"
                                    >
                                      {savingModule ? (
                                        <>
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                          Saving...
                                        </>
                                      ) : (
                                        <>
                                          <Save className="w-4 h-4" />
                                          Save Changes
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                      )
                    ) : (
                      <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {searchTerm
                            ? "No Modules Found"
                            : "No Modules Available"}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                          {searchTerm
                            ? "No modules match your search criteria. Try adjusting your search terms."
                            : "This page doesn't have any modules configured yet."}
                        </p>
                        {searchTerm ? (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="px-6 py-2.5 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/25"
                            type="button"
                          >
                            Clear Search
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowAddModuleModal(true)}
                            className="flex items-center gap-3 px-6 py-2.5 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/25 mx-auto"
                            type="button"
                          >
                            <Plus className="w-4 h-4" />
                            Add Your First Module
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Module Modal */}
      <AddModuleModal
        isOpen={showAddModuleModal}
        onClose={() => setShowAddModuleModal(false)}
        onAddModule={handleAddModule}
        currentPageId={id}
      />

      {/* Reorder Modal */}
      <ReorderModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        onReorder={handleReorderModules}
        modules={pageDataWithoutContent?.page.layout || []}
      />

      {/* Remove Module Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!moduleToRemove}
        onClose={() => setModuleToRemove(null)}
        onConfirm={handleRemoveModule}
        title="Remove Module"
        message="Are you sure you want to remove this module from the page? This action cannot be undone."
        confirmText={removingModule ? "Removing..." : "Remove Module"}
        cancelText="Cancel"
        type="danger"
      />

      <DeletePageModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePage}
        pageTitle={pageFields.title || "Untitled Page"}
        isDeleting={deletingPage}
      />
    </div>
  );
}
