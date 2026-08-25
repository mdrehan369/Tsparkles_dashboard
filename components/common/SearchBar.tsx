import { LoaderCircle, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { ChangeEvent } from 'react';

type SearchBarProps = {
    query: string;
    isFetching: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBar({ isFetching, onChange, query }: SearchBarProps) {
    return (
        <div className='relative w-full sm:w-64 shrink-0'>
            <Search
                size={14}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'
            />
            <Input
                placeholder='Search orders or products'
                value={query}
                onChange={onChange}
                className='pl-8 pr-8 h-8 font-light text-sm bg-transparent'
            />
            {isFetching && (
                <LoaderCircle
                    size={14}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin'
                />
            )}
        </div>
    );
}
