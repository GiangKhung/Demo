'use client';

import { FC, useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Document } from '@/types';
import { shareDocument } from '@/lib/document-service';
import { toast } from '@/components/ui/use-toast';
import { FiMail, FiCopy, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/providers/auth-provider';

interface DocumentShareDialogProps {
    document: Document;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Hook tùy chỉnh để xử lý việc chia sẻ tài liệu
const useDocumentShare = (document: Document, onOpenChange: (open: boolean) => void) => {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<'view' | 'download'>('view');
    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareLink, setShareLink] = useState('');

    // Sử dụng useEffect để đảm bảo code chỉ chạy ở client-side
    useEffect(() => {
        // Chỉ tạo shareLink khi đang ở client-side
        setShareLink(`${window.location.origin}/documents/${document.id}`);
    }, [document.id]);

    const handleCopyLink = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({ title: 'Đã sao chép liên kết vào clipboard' });
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePermissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPermission(e.target.value as 'view' | 'download');
    };

    const handleShareByEmail = async () => {
        if (!email) {
            toast({ title: 'Vui lòng nhập email', variant: 'destructive' });
            return;
        }

        if (!user) {
            toast({ title: 'Bạn cần đăng nhập để chia sẻ tài liệu', variant: 'destructive' });
            return;
        }

        try {
            setIsSharing(true);

            await shareDocument({
                documentId: document.id,
                userid: user.id,
                sharedEmail: email,
                permissionLevel: permission
            });

            toast({ title: 'Đã chia sẻ tài liệu thành công' });
            setEmail('');
            onOpenChange(false);
        } catch (error) {
            console.error('Lỗi khi chia sẻ tài liệu:', error);
            toast({
                title: 'Chia sẻ thất bại',
                description: 'Đã xảy ra lỗi khi chia sẻ tài liệu. Vui lòng thử lại sau.',
                variant: 'destructive'
            });
        } finally {
            setIsSharing(false);
        }
    };

    return {
        email,
        permission,
        isSharing,
        copied,
        shareLink,
        handleCopyLink,
        handleEmailChange,
        handlePermissionChange,
        handleShareByEmail,
    };
};

const DocumentShareDialog: FC<DocumentShareDialogProps> = ({ document, open, onOpenChange }) => {
    const {
        email,
        permission,
        isSharing,
        copied,
        shareLink,
        handleCopyLink,
        handleEmailChange,
        handlePermissionChange,
        handleShareByEmail,
    } = useDocumentShare(document, onOpenChange);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-gradient-to-b from-gray-800 to-gray-900 border border-white/10 text-white docshare-dialog">
                <DialogHeader>
                    <DialogTitle className="text-white">Chia sẻ tài liệu</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Chia sẻ tài liệu &quot;{document.title}&quot; với người khác.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="link" className="text-white/80">Liên kết chia sẻ</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="link"
                                value={shareLink}
                                readOnly
                                className="flex-1 bg-white/5 border-white/10 text-white focus-visible:ring-blue-500 docshare-input"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopyLink}
                                title="Sao chép liên kết"
                                className="bg-transparent border-white/20 hover:bg-white/10 text-white"
                            >
                                {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white/80">Chia sẻ qua email</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={handleEmailChange}
                                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
                            />
                            <select
                                value={permission}
                                onChange={handlePermissionChange}
                                className="h-10 w-28 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                            >
                                <option value="view">Chỉ xem</option>
                                <option value="download">Tải xuống</option>
                            </select>
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        onClick={handleShareByEmail}
                        disabled={isSharing || !email}
                        variant="gradient"
                        className="gap-2"
                    >
                        <FiMail className="h-4 w-4" />
                        {isSharing ? 'Đang chia sẻ...' : 'Chia sẻ'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentShareDialog; 