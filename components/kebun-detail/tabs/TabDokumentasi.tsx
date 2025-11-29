"use client";

import { useState, useEffect } from "react";
import { Documentation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image as ImageIcon, FileText, StickyNote, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { toast } from "sonner";
import AddDocumentationModal from "../modals/AddDocumentationModal";
import EditDocumentationModal from "../modals/EditDocumentationModal";
import {
  createDocumentation,
  updateDocumentation,
  deleteDocumentation,
  getDocumentationByGarden
} from "@/lib/supabase/api/documentation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TabDokumentasiProps {
  gardenId: string;
  documentation: Documentation[];
}

export default function TabDokumentasi({ gardenId, documentation: initialDocumentation }: TabDokumentasiProps) {
  const [documentation, setDocumentation] = useState<Documentation[]>(initialDocumentation);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Documentation | null>(null);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch documentation from Supabase on mount
  useEffect(() => {
    fetchDocumentation();
  }, [gardenId]);

  const fetchDocumentation = async () => {
    setIsLoading(true);
    const { data, error } = await getDocumentationByGarden(gardenId);
    if (data) {
      setDocumentation(data);
    } else if (error) {
      toast.error("Gagal memuat dokumentasi: " + error);
      setDocumentation(initialDocumentation);
    }
    setIsLoading(false);
  };

  const handleAddDoc = async (docData: any) => {
    const { data, error } = await createDocumentation({
      ...docData,
      gardenId,
    });

    if (data) {
      setDocumentation((prev) => [...prev, data]);
      setIsAddModalOpen(false);
      toast.success("Dokumentasi berhasil ditambahkan!");
    } else if (error) {
      toast.error("Gagal menambahkan dokumentasi: " + error);
    }
  };

  const handleEditDoc = async (docData: any) => {
    if (!selectedDoc) return;

    const { data, error } = await updateDocumentation(selectedDoc.id, {
      ...docData,
      gardenId,
    });

    if (data) {
      setDocumentation((prev) => prev.map((d) => (d.id === selectedDoc.id ? data : d)));
      setIsEditModalOpen(false);
      setSelectedDoc(null);
      toast.success("Dokumentasi berhasil diperbarui!");
    } else if (error) {
      toast.error("Gagal memperbarui dokumentasi: " + error);
    }
  };

  const handleDeleteDoc = async () => {
    if (!docToDelete) return;

    const { success, error } = await deleteDocumentation(docToDelete);

    if (success) {
      setDocumentation((prev) => prev.filter((d) => d.id !== docToDelete));
      setDocToDelete(null);
      toast.success("Dokumentasi berhasil dihapus!");
    } else if (error) {
      toast.error("Gagal menghapus dokumentasi: " + error);
    }
  };

  const openEditModal = (doc: Documentation) => {
    setSelectedDoc(doc);
    setIsEditModalOpen(true);
  };

  const photos = documentation.filter((d) => d.tipe === "foto");
  const documents = documentation.filter((d) => d.tipe === "dokumen");
  const notes = documentation.filter((d) => d.tipe === "catatan");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base sm:text-lg">Dokumentasi Kebun</CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="h-9 rounded-xl bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Tambah</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center p-2.5 sm:p-4 bg-blue-50 rounded-xl">
              <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-sm text-gray-600">Foto</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{photos.length}</p>
            </div>
            <div className="text-center p-2.5 sm:p-4 bg-green-50 rounded-xl">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-sm text-gray-600">Dokumen</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <div className="text-center p-2.5 sm:p-4 bg-orange-50 rounded-xl">
              <StickyNote className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-sm text-gray-600">Catatan</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{notes.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="foto" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-10 sm:h-11 rounded-xl bg-gray-100 p-1">
          <TabsTrigger value="foto" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Foto ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="dokumen" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Dokumen ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="catatan" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Catatan ({notes.length})
          </TabsTrigger>
        </TabsList>

        {/* Foto Tab */}
        <TabsContent value="foto" className="mt-4 sm:mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              {photos.length === 0 ? (
                <p className="text-center text-gray-500 py-8 sm:py-12 text-sm">Belum ada foto</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group relative">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                        {photo.fileUrl && (
                          <Image
                            src={photo.fileUrl}
                            alt={photo.judul}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                        )}
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openEditModal(photo)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg"
                          >
                            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDocToDelete(photo.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-1.5 sm:mt-2">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {photo.judul}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {format(new Date(photo.createdAt), "d MMM yyyy", { locale: id })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dokumen Tab */}
        <TabsContent value="dokumen" className="mt-4 sm:mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              {documents.length === 0 ? (
                <p className="text-center text-gray-500 py-8 sm:py-12 text-sm">Belum ada dokumen</p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2.5 sm:gap-4 p-2.5 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{doc.judul}</h4>
                        {doc.deskripsi && (
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{doc.deskripsi}</p>
                        )}
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                          {doc.kategori && (
                            <span className="text-[10px] sm:text-xs text-gray-500 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-200 rounded-lg">
                              {doc.kategori}
                            </span>
                          )}
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            {format(new Date(doc.createdAt), "d MMM yyyy", { locale: id })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(doc)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDocToDelete(doc.id)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catatan Tab */}
        <TabsContent value="catatan" className="mt-4 sm:mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              {notes.length === 0 ? (
                <p className="text-center text-gray-500 py-8 sm:py-12 text-sm">Belum ada catatan</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-xl group">
                      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 flex-1">{note.judul}</h4>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(note)}
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDocToDelete(note.id)}
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                        </div>
                      </div>
                      {note.content && (
                        <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-3 sm:line-clamp-4">{note.content}</p>
                      )}
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                        <span>{format(new Date(note.createdAt), "d MMM yyyy", { locale: id })}</span>
                        {note.kategori && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-100 rounded-lg">{note.kategori}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddDocumentationModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDoc}
      />

      <EditDocumentationModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDoc(null);
        }}
        onSubmit={handleEditDoc}
        documentation={selectedDoc}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!docToDelete} onOpenChange={() => setDocToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus dokumentasi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDoc} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
