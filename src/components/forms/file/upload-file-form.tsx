import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingModal } from "@/components/ui/loading-modal";
import axiosInstance from "@/services/axios/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon, X } from "lucide-react";
import { Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    fileType: z.enum(["image", "video"]),
});

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

export function UploadFileForm() {
    const router = useRouter();

    const session = useSession();

    const [files, setFiles] = useState<(File & { preview: string })[]>([]);
    const [rejected, setRejected] = useState<{ file: File; errors: z.ZodIssue[] }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            tags: [],
            fileType: "image",
        },
    });

    const fileType = form.watch("fileType");

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            setFiles(acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })));
            setRejected(rejectedFiles.map(({ file, errors }) => ({
                file,
                errors: errors.map(error => ({
                    message: error.message,
                    code: 'custom',
                    path: []
                })) as z.ZodIssue[]
            })));
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: fileType === "image"
            ? Object.fromEntries(ACCEPTED_IMAGE_TYPES.map(type => [type, []]))
            : Object.fromEntries(ACCEPTED_VIDEO_TYPES.map(type => [type, []])),
        maxSize: fileType === "image" ? 5 * 1024 * 1024 : 500 * 1024 * 1024, // 5MB for images, 500MB for videos
        maxFiles: 1,
        onDrop,
    });

    const FilePreview = ({ file }: { file: File & { preview: string } }) => {
        if (file.type.startsWith("image/")) {
            return (
                <Image
                    src={file.preview}
                    alt={file.name}
                    width={100}
                    height={100}
                    className="object-cover rounded-lg w-[100px] h-[100px]"
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                    }}
                />
            );
        }

        if (file.type.startsWith("video/")) {
            return (
                <div className="relative w-[100px] h-[100px] bg-muted rounded-lg">
                    <video
                        src={file.preview}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        onLoadedMetadata={() => {
                            URL.revokeObjectURL(file.preview);
                        }}
                    >
                        <track kind="captions" />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <Video className="w-8 h-8 text-white" />
                    </div>
                </div>
            );
        }

        return null;
    };

    const removeFile = useCallback((name: string) => {
        setFiles((files) => files.filter((file) => file.name !== name));
    }, []);

    const removeRejected = useCallback((name: string) => {
        setRejected((files) => files.filter(({ file }) => file.name !== name));
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            if (files.length === 0) {
                toast.error("Please select a file to upload");
                return;
            }

            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("title", values.title);
            formData.append("tags", JSON.stringify(values.tags));
            formData.append("fileType", values.fileType);
            if (session.data?.user?.id) {
                formData.append("userId", session.data.user.id);
            } else {
                toast.error("User not found");
                return;
            }

            await axiosInstance.post("/api/v1/files", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("File uploaded successfully");
            router.refresh();
            router.push("/dashboard");
        } catch (error) {
            toast.error("Error uploading file");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            {isSubmitting && <LoadingModal />}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter a title for your file"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fileType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File Type</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div
                    {...getRootProps({
                        className: `p-16 border-2 border-dashed rounded-lg ${isDragActive ? "border-primary" : "border-muted-foreground"
                            }`,
                    })}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-4">
                        <ArrowUpIcon className="h-8 w-8" />
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Drag & drop {fileType} here, or click to select
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {fileType === "image"
                                    ? `Accepted formats: ${ACCEPTED_IMAGE_TYPES.join(", ")} (Max: 5MB)`
                                    : `Accepted formats: ${ACCEPTED_VIDEO_TYPES.join(", ")} (Max: 500MB)`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Accepted files */}
                <div className="space-y-4">
                    {files.map((file) => (
                        <div
                            key={file.name}
                            className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                            <FilePreview file={file} />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(file.name)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Rejected files */}
                {rejected.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-destructive">
                            Rejected files
                        </p>
                        {rejected.map(({ file, errors }) => (
                            <div
                                key={file.name}
                                className="flex items-center gap-4 p-4 border border-destructive rounded-lg"
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-sm text-destructive">
                                        {errors.map((error) => error.message).join(", ")}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeRejected(file.name)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <>
                                    <Input
                                        placeholder="Type a tag and press Enter"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const value = e.currentTarget.value.trim();
                                                if (value) {
                                                    const currentTags = field.value || [];
                                                    if (!currentTags.includes(value)) {
                                                        field.onChange([...currentTags, value]);
                                                    }
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {field.value?.map((tag) => (
                                            <div
                                                key={tag}
                                                className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                                            >
                                                <span className="text-sm">{tag}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-auto p-0 px-1"
                                                    onClick={() => {
                                                        field.onChange(field.value?.filter((t) => t !== tag));
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            Uploading...
                        </>
                    ) : (
                        'Upload'
                    )}
                </Button>
            </form>
        </Form>
    );
} 