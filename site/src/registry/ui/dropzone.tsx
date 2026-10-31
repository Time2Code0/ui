"use client";

import type { DropEvent, DropzoneOptions, FileRejection } from "react-dropzone";

import { createContext, use } from "react";

import { Upload01Icon } from "@hugeicons/core-free-icons";
import { cn } from "cn";
import { useDropzone } from "react-dropzone";

import { Icon } from "./icon";

interface DropzoneContextType {
  accept?: DropzoneOptions["accept"];
  isDragActive: boolean;
  maxFiles?: DropzoneOptions["maxFiles"];
  maxSize?: DropzoneOptions["maxSize"];
  minSize?: DropzoneOptions["minSize"];
  src?: File[];
}

const renderBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(2)}${units[unitIndex]}`;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined
);

function useDropzoneContext() {
  const context = use(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within <Dropzone />");
  }

  return context;
}

type DropzoneProps = Omit<DropzoneOptions, "onDrop"> & {
  src?: File[];
  className?: string;
  onDrop?: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  children?: React.ReactNode;
};

function Dropzone({
  accept,
  maxFiles = 1,
  maxSize,
  minSize,
  onDrop,
  onError,
  disabled,
  src,
  className,
  children,
  ...props
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    disabled,
    maxFiles,
    maxSize,
    minSize,
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (fileRejections.length > 0) {
        const message = fileRejections.at(0)?.errors.at(0)?.message;
        onError?.(new Error(message));
        return;
      }

      onDrop?.(acceptedFiles, fileRejections, event);
    },
    onError,
    ...props,
  });

  return (
    <DropzoneContext.Provider
      key={JSON.stringify(src)}
      value={{ accept, isDragActive, maxFiles, maxSize, minSize, src }}
    >
      <button
        className={cn(
          "group relative h-auto w-full overflow-hidden rounded-lg border border-dashed p-8 transition-colors hover:bg-background-muted",
          "data-[drag-active=true]:outline-none data-[drag-active=true]:ring-1 data-[drag-active=true]:ring-foreground",
          className
        )}
        data-drag-active={isDragActive}
        data-slot="dropzone"
        disabled={disabled}
        type="button"
        {...getRootProps()}
      >
        <input {...getInputProps()} disabled={disabled} />
        {children}
      </button>
    </DropzoneContext.Provider>
  );
}

interface DropzoneContentProps {
  children?: React.ReactNode;
  className?: string;
}

const maxLabelItems = 3;

function DropzoneContent({ children, className }: DropzoneContentProps) {
  const { src } = useDropzoneContext();

  if (!src) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "group-data-[drag-active=true]:group-has-[>[data-slot-dropzone-drag-active]]:opacity-0",
        className
      )}
      data-slot="dropzone-content"
    >
      {children ?? (
        <>
          <div className="flex size-8 items-center justify-center rounded-md bg-background-muted text-foreground-muted">
            <Icon icon={Upload01Icon} size={16} />
          </div>

          <p className="my-2 w-full truncate font-medium text-sm">
            {src.length > maxLabelItems
              ? `${new Intl.ListFormat("en").format(
                  src.slice(0, maxLabelItems).map((file) => file.name)
                )} and ${src.length - maxLabelItems} more`
              : new Intl.ListFormat("en").format(src.map((file) => file.name))}
          </p>

          <p className="w-full text-wrap text-foreground-muted text-xs">
            Drag and drop or click to replace
          </p>
        </>
      )}
    </div>
  );
}

interface DropzoneEmptyStateProps {
  children?: React.ReactNode;
  className?: string;
}

function DropzoneEmptyState({ children, className }: DropzoneEmptyStateProps) {
  const { src, accept, maxSize, minSize, maxFiles } = useDropzoneContext();

  if (src) {
    return null;
  }

  let caption = "";

  if (accept) {
    caption += "Accepts ";
    caption += new Intl.ListFormat("en").format(Object.keys(accept));
  }

  if (minSize && maxSize) {
    caption += ` between ${renderBytes(minSize)} and ${renderBytes(maxSize)}`;
  } else if (minSize) {
    caption += ` at least ${renderBytes(minSize)}`;
  } else if (maxSize) {
    caption += ` less than ${renderBytes(maxSize)}`;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "data-[drag-active=true]:group-has-[>[data-slot-dropzone-drag-active]]:opacity-0",
        className
      )}
      data-slot="dropzone-empty-state"
    >
      {children ?? (
        <>
          <div className="flex size-8 items-center justify-center rounded-md bg-background-muted text-foreground-muted">
            <Icon icon={Upload01Icon} size={16} />
          </div>

          <p className="my-2 w-full truncate text-wrap font-medium text-sm">
            Upload {maxFiles === 1 ? "a file" : "files"}
          </p>

          <p className="w-full truncate text-wrap text-foreground-muted text-xs">
            Drag and drop or click to upload
          </p>

          {caption.length > 0 && (
            <p className="text-wrap text-foreground-muted text-xs">
              {caption}.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function DropzoneDragActive({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { isDragActive } = useDropzoneContext();

  if (!isDragActive) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-lg",
        className
      )}
      data-slot="dropzone-drag-active"
    >
      {children ?? (
        <div className="flex size-full flex-col items-center justify-center rounded-lg bg-accent">
          <div className="my-2">
            <Icon className="size-6" icon={Upload01Icon} />
          </div>

          <p className="mt-3 font-semibold text-sm">Drop files here</p>
        </div>
      )}
    </div>
  );
}

export type { DropzoneContentProps, DropzoneEmptyStateProps, DropzoneProps };
export {
  Dropzone,
  DropzoneContent,
  DropzoneDragActive,
  DropzoneEmptyState,
  useDropzoneContext,
};
