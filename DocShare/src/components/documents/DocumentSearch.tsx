'use client';

import { FC, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiSearch, FiX } from 'react-icons/fi';

interface DocumentSearchProps {
    placeholder?: string;
    className?: string;
}

// Hook tùy chỉnh để xử lý việc tìm kiếm
const useDocumentSearch = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    // Cập nhật search query khi URL thay đổi
    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Tạo đối tượng URLSearchParams mới từ searchParams hiện tại
        const params = new URLSearchParams(searchParams.toString());

        // Cập nhật hoặc xóa tham số 'q'
        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim());
        } else {
            params.delete('q');
        }

        // Điều hướng đến cùng trang với tham số tìm kiếm mới
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClear = () => {
        setSearchQuery('');

        // Tạo đối tượng URLSearchParams mới từ searchParams hiện tại
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');

        // Điều hướng đến cùng trang nhưng không có tham số tìm kiếm
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return {
        searchQuery,
        handleSearch,
        handleClear,
        handleInputChange,
    };
};

const DocumentSearch: FC<DocumentSearchProps> = ({
    placeholder = 'Tìm kiếm tài liệu...',
    className = ''
}) => {
    const {
        searchQuery,
        handleSearch,
        handleClear,
        handleInputChange,
    } = useDocumentSearch();

    return (
        <form onSubmit={handleSearch} className={`relative ${className}`}>
            <div className="relative flex items-center">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-blue-500 docshare-input"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />

                {searchQuery && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                )}

                <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
                >
                    Tìm
                </Button>
            </div>
        </form>
    );
};

export default DocumentSearch; 