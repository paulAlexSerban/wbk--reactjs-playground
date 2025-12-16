import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from 'lucide-react';
import { truncateAddress } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface WalletStatusProps {
    className?: string;
}

export function WalletStatus({ className }: WalletStatusProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    // Mock wallet data
    const mockAddress = '0x7890abcdef1234567890abcdef1234567890abcd';
    const mockBalance = 125.45;
    const network = 'testnet';

    const handleConnect = () => {
        setIsConnected(true);
        toast({
            title: 'Wallet Connected',
            description: 'Successfully connected to Sui wallet',
        });
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        toast({
            title: 'Wallet Disconnected',
            description: 'Your wallet has been disconnected',
        });
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(mockAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: 'Address Copied',
            description: 'Wallet address copied to clipboard',
        });
    };

    if (!isConnected) {
        return (
            <Button variant="hero" onClick={handleConnect} className={className}>
                <Wallet className="h-4 w-4" />
                Connect Wallet
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="glass" className={className}>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        <span className="font-mono">{truncateAddress(mockAddress, 4)}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-card border-border">
                <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Connected</span>
                        <Badge variant="success" className="text-xs">
                            {network}
                        </Badge>
                    </div>
                    <div className="font-mono text-sm mb-2">{truncateAddress(mockAddress, 8)}</div>
                    <div className="text-lg font-semibold">
                        {mockBalance.toFixed(2)} <span className="text-muted-foreground text-sm">SUI</span>
                    </div>
                </div>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
                    {copied ? <Check className="h-4 w-4 mr-2 text-success" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                    onClick={handleDisconnect}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
