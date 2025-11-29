"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays } from "date-fns";

const scheduleSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  tanggalTarget: z.string().min(1, "Tanggal wajib diisi"),
  prioritas: z.enum(["High", "Normal", "Low"]),
  assignedTo: z.string().optional(),
  deskripsi: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleHarvestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
}

export default function ScheduleHarvestModal({
  open,
  onClose,
  onSubmit,
}: ScheduleHarvestModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      judul: "Jadwal Panen",
      tanggalTarget: format(addDays(new Date(), 14), "yyyy-MM-dd"),
      prioritas: "Normal",
      assignedTo: "",
      deskripsi: "",
    },
  });

  const prioritas = watch("prioritas");

  const onFormSubmit = (data: ScheduleFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base sm:text-lg">Jadwalkan Panen</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Buat jadwal panen yang akan muncul di daftar tugas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="judul" className="text-xs sm:text-sm font-medium">
              Judul <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              placeholder="Jadwal Panen Minggu Ini"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-xs text-red-500 mt-1">{errors.judul.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tanggalTarget" className="text-xs sm:text-sm font-medium">
              Tanggal Target <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggalTarget"
              type="date"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("tanggalTarget")}
            />
            {errors.tanggalTarget && (
              <p className="text-xs text-red-500 mt-1">
                {errors.tanggalTarget.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prioritas" className="text-xs sm:text-sm font-medium">Prioritas</Label>
            <Select
              value={prioritas}
              onValueChange={(value: any) => setValue("prioritas", value)}
            >
              <SelectTrigger className="h-11 text-base sm:text-sm rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High - Mendesak</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Low">Low - Bisa ditunda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="assignedTo" className="text-xs sm:text-sm font-medium">Penanggung Jawab</Label>
            <Input
              id="assignedTo"
              placeholder="Nama penanggung jawab"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("assignedTo")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="text-xs sm:text-sm font-medium">Catatan</Label>
            <Textarea
              id="deskripsi"
              placeholder="Catatan tambahan..."
              rows={2}
              className="text-base sm:text-sm rounded-xl resize-none"
              {...register("deskripsi")}
            />
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="h-11 rounded-xl w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button 
              type="submit"
              className="h-11 rounded-xl w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              Jadwalkan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
