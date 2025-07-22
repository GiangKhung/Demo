'use client';

import { FC, useState, useEffect } from 'react';
import { Document } from '@/types';
import DocumentCard from './DocumentCard';
import { FiFileText, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentGridProps {
    documents: Document[];
    bookmarkedDocIds?: string[];
    emptyStateMessage?: string;
    emptyStateIcon?: React.ReactNode;
    isLoading?: boolean;
    showFilters?: boolean;
}

const DocumentGrid: FC<DocumentGridProps> = ({
    documents,
    bookmarkedDocIds = [],
    emptyStateMessage = 'Không tìm thấy tài liệu nào',
    emptyStateIcon = <FiFileText className="h-12 w-12 text-muted-foreground/50" />,
    isLoading = false,
    showFilters = true,
}) => {
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    // Cập nhật danh sách tài liệu khi documents thay đổi hoặc khi sắp xếp thay đổi
    useEffect(() => {
        let sorted = [...documents];
        
        switch (sortBy) {
            case 'newest':
                sorted = sorted.sort((a, b) => {
                    const dateA = a.createdat ? new Date(a.createdat).getTime() : 0;
                    const dateB = b.createdat ? new Date(b.createdat).getTime() : 0;
                    return dateB - dateA;
                });
                break;
            case 'oldest':
                sorted = sorted.sort((a, b) => {
                    const dateA = a.createdat ? new Date(a.createdat).getTime() : 0;
                    const dateB = b.createdat ? new Date(b.createdat).getTime() : 0;
                    return dateA - dateB;
                });
                break;
            case 'name':
                sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'size':
                sorted = sorted.sort((a, b) => b.filesize - a.filesize);
                break;
        }
        
        setFilteredDocuments(sorted);
    }, [documents, sortBy]);
    // Hiển thị trạng thái đang tải
    if (isLoading) {
        return (
            <div className="space-y-4">
                {showFilters && (
                    <div className="flex justify-between items-center mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="h-10 w-40 bg-slate-700 rounded animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-10 w-10 bg-slate-700 rounded animate-pulse" />
                            <div className="h-10 w-10 bg-slate-700 rounded animate-pulse" />
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden h-72">
                            <div className="h-48 bg-white/10" />
                            <div className="p-4">
                                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-white/10 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Hiển thị trạng thái không có tài liệu
    if (documents.length === 0) {
        return (
            <div className="space-y-4">
                {showFilters && (
                    <div className="flex justify-between items-center mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2">
                            <FiFilter className="text-white/60" />
                            <span className="text-white/60 text-sm">Không có tài liệu để lọc</span>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-lg bg-white/5">
                    {emptyStateIcon}
                    <p className="mt-4 text-white/60">{emptyStateMessage}</p>
                </div>
            </div>
        );
    }

    // Hiển thị danh sách tài liệu với bộ lọc và sắp xếp
    return (
        <div className="space-y-4">
            {showFilters && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FiFilter className="text-white/60" />
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="newest">Mới nhất</SelectItem>
                                <SelectItem value="oldest">Cũ nhất</SelectItem>
                                <SelectItem value="name">Tên (A-Z)</SelectItem>
                                <SelectItem value="size">Kích thước</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setViewMode('grid')}
                            className={`${viewMode === 'grid' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10'} text-white`}
                        >
                            <FiGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setViewMode('list')}
                            className={`${viewMode === 'list' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10'} text-white`}
                        >
                            <FiList className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            
            <AnimatePresence>
                <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
                    : "flex flex-col gap-4"
                }>
                    {filteredDocuments.map((document) => (
                        <motion.div
                            key={document.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            layout
                        >
                            <DocumentCard
                                document={document}
                                isBookmarked={bookmarkedDocIds.includes(document.id)}
                            />
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
};

export default DocumentGrid;