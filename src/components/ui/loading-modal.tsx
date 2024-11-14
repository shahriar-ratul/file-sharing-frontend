import { Dialog, DialogContent } from "@/components/ui/dialog";

export function LoadingModal() {
    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px] flex items-center justify-center min-h-[150px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin text-4xl">⏳</div>
                    <p className="text-lg font-semibold">Uploading...</p>
                </div>
            </DialogContent>
        </Dialog>
    );
} 